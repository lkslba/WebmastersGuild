// WebmastersGuild - Member Registration API
// This Netlify Function handles new member registration

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const GoTrue = require('gotrue-js').default;

// Initialize GoTrue client for Netlify Identity
const auth = new GoTrue({
  APIUrl: process.env.NETLIFY_IDENTITY_URL || '/.netlify/identity',
  audience: '',
  setCookie: false,
});

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
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Parse request body
    const data = JSON.parse(event.body);
    const { name, email, password, website, description, tags } = data;

    // Validate required fields
    if (!name || !email || !password || !website || !description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Register user with Netlify Identity
    let user;
    try {
      user = await auth.signup(email, password, {
        data: {
          full_name: name,
          website: website
        }
      });
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Failed to create user account', details: error.message })
      };
    }

    // Get existing members data
    const membersData = getMembersData();

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
      userId: user.id
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