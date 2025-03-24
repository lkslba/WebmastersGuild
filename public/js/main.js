/**
 * WebmastersGuild - Main JavaScript
 * Minimal JS for enhancing the guild experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Random Website Button functionality
    const randomButton = document.getElementById('random-website-btn');
    if (randomButton) {
        randomButton.addEventListener('click', function(e) {
            e.preventDefault();
            // This would be replaced with actual random site selection logic
            fetch('/.netlify/functions/webring/random')
                .then(response => {
                    if (response.ok && response.redirected) {
                        window.location.href = response.url;
                    } else {
                        window.location.href = '/webring/';
                    }
                })
                .catch(error => {
                    console.error('Error fetching random site:', error);
                    window.location.href = '/webring/';
                });
        });
    }
    
    // Mobile menu toggle - moved to header.html for immediate execution
    
    // Form validation for join page
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', function(e) {
            const websiteUrl = document.getElementById('website-url').value;
            const agreementCheckbox = document.getElementById('agreement').checked;
            
            let isValid = true;
            
            // Basic URL validation
            if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
                alert('Please enter a valid website URL starting with http:// or https://');
                isValid = false;
            }
            
            // Agreement must be checked
            if (!agreementCheckbox) {
                alert('You must agree to the guild guidelines to join.');
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    }
    
    // Enhance active navigation highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath === linkPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
            link.classList.add('active');
        }
    });
    
    // Handle Netlify Identity
    if (window.netlifyIdentity) {
        // Handle login/logout events
        window.netlifyIdentity.on('init', user => {
            if (user) {
                // User is already logged in, update UI
                updateUIForLoggedInUser(user);
            }
        });
        
        window.netlifyIdentity.on('login', user => {
            updateUIForLoggedInUser(user);
            
            // Redirect to dashboard after login
            if (currentPath === '/' || currentPath === '/join/') {
                window.location.href = '/dashboard/';
            }
        });
        
        window.netlifyIdentity.on('logout', () => {
            // Redirect to home after logout if on a protected page
            if (currentPath.startsWith('/dashboard/')) {
                window.location.href = '/';
            }
        });
    }
    
    // Handle profile form if on edit profile page
    const profileForm = document.getElementById('profile-form');
    if (profileForm && window.netlifyIdentity) {
        const user = window.netlifyIdentity.currentUser();
        if (user) {
            // Set user ID in the form
            const userIdField = document.getElementById('user-id');
            if (userIdField) {
                userIdField.value = user.id;
            }
            
            // Set known values if we have user metadata
            const userData = user.user_metadata || {};
            
            if (userData.full_name) {
                const displayNameField = document.getElementById('display-name');
                if (displayNameField) {
                    displayNameField.value = userData.full_name;
                }
            }
            
            if (userData.website) {
                const websiteUrlField = document.getElementById('website-url');
                if (websiteUrlField) {
                    websiteUrlField.value = userData.website;
                }
            }
        }
    }
});

// Helper function to update UI for logged-in users
function updateUIForLoggedInUser(user) {
    // Update login button
    const loginButton = document.querySelector('.login-button');
    if (loginButton) {
        loginButton.textContent = 'Dashboard';
        loginButton.setAttribute('href', '/dashboard/');
        loginButton.removeAttribute('data-netlify-identity-button');
    }
    
    // Update user info on dashboard if present
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const userWebsiteElement = document.getElementById('user-website');
    
    if (userNameElement) {
        userNameElement.textContent = `Name: ${user.user_metadata.full_name || 'Not set'}`;
    }
    
    if (userEmailElement) {
        userEmailElement.textContent = `Email: ${user.email}`;
    }
    
    if (userWebsiteElement) {
        userWebsiteElement.textContent = `Website: ${user.user_metadata.website || 'Not set'}`;
    }
}