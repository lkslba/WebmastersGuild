// WebmastersGuild - Member Directory API
// This is a Netlify Function that would fetch member data in production

// Load members from data file (in production this would come from a database)
const fs = require('fs');
const path = require('path');

let mockMembers = [];
try {
  const dataPath = path.resolve(__dirname, '../data/members.json');
  const memberData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  mockMembers = memberData.members || [];
} catch (error) {
  console.error('Error loading member data:', error);
  // Fallback to sample data
  mockMembers = [
    {
      id: "sample",
      name: "Terminal Wizard",
      website: "https://example.com",
      joinDate: "2023-04-15",
      rank: "journeyman",
      badges: ["guild-initiate", "ring-bearer", "challenger"],
      tags: ["blog", "technology", "coding"],
      description: "A personal website focused on programming tutorials, tech experiments, and digital explorations.",
      webring: true
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

  // Parse query parameters
  const params = event.queryStringParameters || {};
  const { rank, tag, search } = params;
  
  // Filter members based on query parameters
  let filteredMembers = [...mockMembers];
  
  // Only return members that have opted to be in the directory
  filteredMembers = filteredMembers.filter(member => 
    member.listInDirectory !== false // If not specified, default to showing
  );
  
  // Hide private information from returned members
  filteredMembers = filteredMembers.map(member => {
    const publicMember = { ...member };
    delete publicMember.email;
    delete publicMember.userId;
    return publicMember;
  });
  
  if (rank) {
    filteredMembers = filteredMembers.filter(member => member.rank === rank);
  }
  
  if (tag) {
    filteredMembers = filteredMembers.filter(member => 
      Array.isArray(member.tags) && member.tags.some(t => 
        t.toLowerCase() === tag.toLowerCase()
      )
    );
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredMembers = filteredMembers.filter(member => 
      member.name.toLowerCase().includes(searchLower) || 
      member.description.toLowerCase().includes(searchLower) ||
      (Array.isArray(member.tags) && member.tags.some(tag => 
        tag.toLowerCase().includes(searchLower)
      ))
    );
  }
  
  // Return filtered members
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      members: filteredMembers,
      total: filteredMembers.length,
      filters: { rank, tag, search }
    })
  };
};