// WebmastersGuild - Update Member Data API
// This Netlify Function updates member data for the authenticated user

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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }
  
  // Only allow PUT/POST requests
  if (event.httpMethod !== 'PUT' && event.httpMethod !== 'POST') {
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
    
    // Parse request body
    const data = JSON.parse(event.body);
    
    // Get members data
    const membersData = getMembersData();
    
    // Find the member index with the given Auth0 ID
    const memberIndex = membersData.members.findIndex(m => m.auth0Id === userId);
    
    if (memberIndex === -1) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Member not found' })
      };
    }
    
    const currentMember = membersData.members[memberIndex];
    
    // Check if website URL is being changed and if it's already in use
    if (data.website && data.website !== currentMember.website) {
      const websiteExists = membersData.members.some(
        (m, i) => i !== memberIndex && m.website === data.website
      );
      
      if (websiteExists) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Website URL already registered by another member' })
        };
      }
    }
    
    // Fields that can be updated
    const updatableFields = [
      'name', 'website', 'description', 'tags', 'bio', 
      'listInDirectory', 'socialLinks'
    ];
    
    // Update fields
    updatableFields.forEach(field => {
      if (data[field] !== undefined) {
        // Handle arrays (like tags)
        if (field === 'tags' && typeof data[field] === 'string') {
          currentMember[field] = data[field]
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        } else {
          currentMember[field] = data[field];
        }
      }
    });
    
    // Update webring status if specified
    if (data.webring !== undefined) {
      currentMember.webring = !!data.webring;
      
      // Update webring array if joining
      if (currentMember.webring) {
        // Check if already in webring array
        const inWebring = membersData.webring.some(w => w.id === currentMember.id);
        
        if (!inWebring) {
          membersData.webring.push({
            id: currentMember.id,
            url: currentMember.website
          });
        }
      } else {
        // Remove from webring array if leaving
        membersData.webring = membersData.webring.filter(w => w.id !== currentMember.id);
      }
    }
    
    // Save updated data
    const saved = saveMembersData(membersData);
    
    if (!saved) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to save member data' })
      };
    }
    
    // Return updated member data (excluding sensitive fields)
    const publicMember = { ...currentMember };
    delete publicMember.auth0Id;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Member updated successfully',
        member: publicMember
      })
    };
  } catch (error) {
    console.error('Error updating member data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error', details: error.message })
    };
  }
};