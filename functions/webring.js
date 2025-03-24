// WebmastersGuild - WebRing Navigation API
// This is a Netlify Function that handles WebRing navigation

// Load WebRing members from data file
const fs = require('fs');
const path = require('path');

let webringMembers = [];
try {
  const dataPath = path.resolve(__dirname, '../data/members.json');
  const memberData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  webringMembers = memberData.webring || [];
} catch (error) {
  console.error('Error loading WebRing data:', error);
  // Fallback to sample data
  webringMembers = [
    {
      id: "sample",
      name: "Terminal Wizard",
      url: "https://example.com"
    }
  ];
}

exports.handler = async function(event, context) {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // Get the path and query parameters
  const path = event.path.split('/').pop();
  const params = event.queryStringParameters || {};
  const { from } = params;
  
  // Handle different navigation actions
  switch (path) {
    case 'next':
      return handleNext(from, headers);
    
    case 'prev':
      return handlePrev(from, headers);
    
    case 'random':
      return handleRandom(headers);
    
    default:
      // Return WebRing info
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          members: webringMembers,
          total: webringMembers.length
        })
      };
  }
};

// Helper function to handle "next" navigation
function handleNext(from, headers) {
  // If WebRing is empty or has only one member, redirect to WebRing hub
  if (webringMembers.length <= 1) {
    return redirectToHub(headers);
  }
  
  // Find the current member's index
  const currentIndex = from ? webringMembers.findIndex(member => member.id === from) : -1;
  
  // If not found or is the last, go to the first member
  const nextIndex = (currentIndex === -1 || currentIndex === webringMembers.length - 1) ? 0 : currentIndex + 1;
  const nextMember = webringMembers[nextIndex];
  
  // Redirect to the next member's site
  return {
    statusCode: 302,
    headers: {
      ...headers,
      "Location": nextMember.url
    },
    body: JSON.stringify({ redirect: nextMember.url })
  };
}

// Helper function to handle "previous" navigation
function handlePrev(from, headers) {
  // If WebRing is empty or has only one member, redirect to WebRing hub
  if (webringMembers.length <= 1) {
    return redirectToHub(headers);
  }
  
  // Find the current member's index
  const currentIndex = from ? webringMembers.findIndex(member => member.id === from) : -1;
  
  // If not found or is the first, go to the last member
  const prevIndex = (currentIndex === -1 || currentIndex === 0) ? webringMembers.length - 1 : currentIndex - 1;
  const prevMember = webringMembers[prevIndex];
  
  // Redirect to the previous member's site
  return {
    statusCode: 302,
    headers: {
      ...headers,
      "Location": prevMember.url
    },
    body: JSON.stringify({ redirect: prevMember.url })
  };
}

// Helper function to handle "random" navigation
function handleRandom(headers) {
  // If WebRing is empty, redirect to WebRing hub
  if (webringMembers.length === 0) {
    return redirectToHub(headers);
  }
  
  // Get a random member
  const randomIndex = Math.floor(Math.random() * webringMembers.length);
  const randomMember = webringMembers[randomIndex];
  
  // Redirect to the random member's site
  return {
    statusCode: 302,
    headers: {
      ...headers,
      "Location": randomMember.url
    },
    body: JSON.stringify({ redirect: randomMember.url })
  };
}

// Helper function to redirect to the WebRing hub
function redirectToHub(headers) {
  return {
    statusCode: 302,
    headers: {
      ...headers,
      "Location": "https://webmastersguild.org/webring/"
    },
    body: JSON.stringify({ redirect: "https://webmastersguild.org/webring/" })
  };
}