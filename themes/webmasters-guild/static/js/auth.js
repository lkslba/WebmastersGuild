/**
 * WebmastersGuild Auth0 Authentication Service
 * Handles login, logout, signup, and authentication state management
 */

let auth0Client = null;
let isAuthenticated = false;
let userProfile = null;
let tokenExpiresAt = null;

// Auth0 configuration object - these will be replaced by environment variables
const auth0Config = {
  domain: 'YOUR_AUTH0_DOMAIN.auth0.com',
  clientId: 'YOUR_AUTH0_CLIENT_ID',
  redirectUri: window.location.origin + '/callback',
  audience: 'https://api.webmastersguild.org', // API identifier (can be configured in Auth0)
  scope: 'openid profile email'
};

/**
 * Initialize the Auth0 client
 */
async function initAuth() {
  try {
    // Create a new Auth0 client
    auth0Client = await createAuth0Client({
      domain: auth0Config.domain,
      clientId: auth0Config.clientId,
      authorizationParams: {
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope
      }
    });

    // If the user is returning from Auth0 (code is in the URL)
    if (window.location.search.includes('code=')) {
      // Handle the redirect and get tokens
      await auth0Client.handleRedirectCallback();
      // Clear the URL of the auth parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if the user is authenticated
    isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
      // Get the user profile
      userProfile = await auth0Client.getUser();
      // Get the token claims which include expiration
      const claims = await auth0Client.getIdTokenClaims();
      tokenExpiresAt = claims.exp * 1000; // Convert to milliseconds
      
      // Update UI based on authenticated state
      updateAuthUI(true);
      
      // Trigger auth state change event
      const authEvent = new CustomEvent('auth:authenticated', { 
        detail: { isAuthenticated: true, user: userProfile } 
      });
      window.dispatchEvent(authEvent);
    } else {
      updateAuthUI(false);
    }
  } catch (error) {
    console.error('Error initializing Auth0:', error);
  }
}

/**
 * Update the UI based on authentication state
 */
function updateAuthUI(isLoggedIn) {
  // Find all elements with data-auth-required attribute
  const authElements = document.querySelectorAll('[data-auth-required]');
  // Find all elements with data-auth-anonymous attribute (only shown when not logged in)
  const anonElements = document.querySelectorAll('[data-auth-anonymous]');
  
  if (isLoggedIn) {
    // Show authenticated elements
    authElements.forEach(el => el.style.display = '');
    // Hide anonymous elements
    anonElements.forEach(el => el.style.display = 'none');
    
    // Update user info if elements exist
    if (userProfile) {
      const userNameElements = document.querySelectorAll('[data-user-name]');
      userNameElements.forEach(el => el.textContent = userProfile.name || userProfile.email);
      
      const userEmailElements = document.querySelectorAll('[data-user-email]');
      userEmailElements.forEach(el => el.textContent = userProfile.email);
    }
  } else {
    // Hide authenticated elements
    authElements.forEach(el => el.style.display = 'none');
    // Show anonymous elements
    anonElements.forEach(el => el.style.display = '');
  }
}

/**
 * Login with Auth0
 * This will redirect to Auth0 login page
 */
async function login() {
  try {
    await auth0Client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: auth0Config.redirectUri
      }
    });
  } catch (error) {
    console.error('Login error:', error);
  }
}

/**
 * Sign up with Auth0
 * This will redirect to Auth0 signup page
 */
async function signup() {
  try {
    await auth0Client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: auth0Config.redirectUri,
        screen_hint: 'signup'
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
  }
}

/**
 * Logout from Auth0
 */
async function logout() {
  try {
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
    isAuthenticated = false;
    userProfile = null;
    tokenExpiresAt = null;
    
    // Update UI based on authenticated state
    updateAuthUI(false);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Get access token for API calls
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
  try {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }
    
    // Check if token is expired
    if (tokenExpiresAt && Date.now() > tokenExpiresAt) {
      console.log('Token expired, getting a new one');
      await auth0Client.getTokenSilently();
    }
    
    return await auth0Client.getTokenSilently();
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
function isUserAuthenticated() {
  return isAuthenticated;
}

/**
 * Get user profile
 * @returns {Object|null} User profile or null if not authenticated
 */
function getUserProfile() {
  return userProfile;
}

/**
 * Add event listeners when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Auth0 client
  initAuth();
  
  // Add click handlers for login/signup/logout buttons
  const loginButtons = document.querySelectorAll('[data-auth-login]');
  loginButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      login();
    });
  });
  
  const signupButtons = document.querySelectorAll('[data-auth-signup]');
  signupButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      signup();
    });
  });
  
  const logoutButtons = document.querySelectorAll('[data-auth-logout]');
  logoutButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to log out?')) {
        logout();
      }
    });
  });
});

// Export functions for use in other scripts
window.auth = {
  login,
  signup,
  logout,
  getAccessToken,
  isAuthenticated: isUserAuthenticated,
  getUserProfile
};