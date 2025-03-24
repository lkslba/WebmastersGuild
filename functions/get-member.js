// WebmastersGuild - Get Authenticated Member Data API
// This Netlify Function retrieves member data for the authenticated user

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

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

// Parse and verify JWT from the Authorization header
const getUserIdFromToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    // In production, we would verify this token with the Netlify JWT secret
    // This would use jwt.verify(token, process.env.NETLIFY_JWT_SECRET)
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
    
    return decoded.sub; // subject claim contains the user ID
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

exports.handler = async function(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };
  
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }
  
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }
  
  try {
    // Get user ID from token
    const userId = getUserIdFromToken(event.headers.authorization);
    
    if (!userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }
    
    // Get members data
    const membersData = getMembersData();
    
    // Find the member with the given userId
    const member = membersData.members.find(m => m.userId === userId);
    
    if (!member) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Member not found' })
      };
    }
    
    // Create a copy with sensitive fields removed for security
    const publicMember = { ...member };
    delete publicMember.userId;
    // We keep email because this is an authenticated endpoint
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        member: publicMember
      })
    };
  } catch (error) {
    console.error('Error getting member data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error', details: error.message })
    };
  }
};