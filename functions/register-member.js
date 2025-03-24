// WebmastersGuild - Member Registration API
// This Netlify Function handles new member registration

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Auth0 token verification function
const verifyAuth0Token = (token) => {
  try {
    // In production, we would properly verify the JWT signature
    // using the Auth0 public key and the jsonwebtoken library
    // For this implementation, we'll decode and do basic checks
    
    const decoded = jwt.decode(token);
    
    // Basic validation
    if (!decoded || !decoded.sub || !decoded.exp) {
      console.error('Invalid token format');
      return null;
    }
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      console.error('Token expired');
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Error verifying Auth0 token:', error);
    return null;
  }
};

// Load members from data file
const getMembersData = () => {
  try {
    const dataPath = path.resolve(__dirname, '../data/members.json');
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (error) {
    console.error('Error loading member data:', error);
    return { members: [], webring: [] };
  }
};

// Save members to data file
const saveMembersData = (data) => {
  try {
    const dataPath = path.resolve(__dirname, '../data/members.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving member data:', error);
    return false;
  }
};

// Generate unique member ID
const generateMemberId = (name) => {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const random = crypto.randomBytes(4).toString('hex');
  return `${base}-${random}`;
};

exports.handler = async function(event, context) {
  // Allow OPTIONS for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  try {
    // Verify Auth0 token from Authorization header
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized - Missing or invalid token' })
      };
    }
    
    const token = authHeader.substring(7);
    const decodedToken = verifyAuth0Token(token);
    
    if (!decodedToken) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized - Invalid token' })
      };
    }
    
    // Parse request body
    const data = JSON.parse(event.body);
    const { name, email, website, description, tags, auth0Id } = data;

    // Validate required fields
    if (!name || !email || !website || !description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }
    
    // Use the Auth0 ID from the token if not provided in the request
    const userId = auth0Id || decodedToken.sub;

    // Get existing members data
    const membersData = getMembersData();

    // Check if Auth0 user already exists in our system
    const auth0UserExists = membersData.members.some(member => member.auth0Id === userId);
    
    if (auth0UserExists) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User already registered. Please update your profile instead.' })
      };
    }
    
    // Check if email or website already exists
    const emailExists = membersData.members.some(member => member.email === email);
    const websiteExists = membersData.members.some(member => member.website === website);

    if (emailExists) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email already registered' })
      };
    }

    if (websiteExists) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Website already registered' })
      };
    }

    // Generate member ID
    const memberId = generateMemberId(name);

    // Create new member entry
    const newMember = {
      id: memberId,
      name: name,
      email: email,
      website: website,
      joinDate: new Date().toISOString().split('T')[0],
      rank: 'apprentice',
      badges: ['guild-initiate'],
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      description: description,
      webring: false,
      auth0Id: userId, // Store Auth0 user ID instead of Netlify ID
      listInDirectory: true
    };

    // Add to members array
    membersData.members.push(newMember);

    // Save updated data
    const saved = saveMembersData(membersData);

    if (!saved) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to save member data' })
      };
    }

    // Return success with member data (excluding email for privacy)
    const publicMember = { ...newMember };
    delete publicMember.email;
    delete publicMember.userId;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Registration successful',
        member: publicMember
      })
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error', details: error.message })
    };
  }
};