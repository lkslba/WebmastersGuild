---
title: "Edit Profile"
description: "Update your WebmastersGuild member profile"
draft: false
---

# Edit Profile

```
// This page requires authentication
// Edit your profile information below
```

<form id="profile-form" name="member-profile" method="POST" data-netlify="true" class="guild-form">
  <input type="hidden" name="form-name" value="member-profile">
  <input type="hidden" id="user-id" name="user-id">
  
  <div class="form-group">
    <label for="display-name">Display Name:</label>
    <input type="text" id="display-name" name="display-name" required>
  </div>
  
  <div class="form-group">
    <label for="website-url">Website URL:</label>
    <input type="url" id="website-url" name="website-url" placeholder="https://yourdomain.com" required>
  </div>
  
  <div class="form-group">
    <label for="website-description">Website Description:</label>
    <textarea id="website-description" name="website-description" rows="3" required></textarea>
  </div>
  
  <div class="form-group">
    <label for="website-tags">Tags (comma separated):</label>
    <input type="text" id="website-tags" name="website-tags" placeholder="blog, photography, technology">
  </div>
  
  <div class="form-group">
    <label for="bio">Bio (optional):</label>
    <textarea id="bio" name="bio" rows="3"></textarea>
  </div>
  
  <div class="form-group">
    <label for="social-links">Social Links (one per line):</label>
    <textarea id="social-links" name="social-links" rows="3" placeholder="Twitter: https://twitter.com/yourusername&#10;GitHub: https://github.com/yourusername"></textarea>
  </div>
  
  <div class="form-group checkbox-group">
    <input type="checkbox" id="list-directory" name="list-directory" checked>
    <label for="list-directory">List my website in the public directory</label>
  </div>
  
  <div class="form-actions">
    <button type="submit" class="button">Update Profile</button>
    <a href="/dashboard/" class="button button-secondary">Cancel</a>
  </div>
</form>

<script>
// Check for authentication and load member data
document.addEventListener('DOMContentLoaded', function() {
    // Add required auth protection
    if (!window.auth || !window.auth.isAuthenticated()) {
        window.location.href = '/';
        alert('Please log in to access your profile');
        return;
    }
    
    // Show loading state
    document.getElementById('display-name').value = 'Loading...';
    document.getElementById('website-url').value = 'Loading...';
    
    // Load member data when auth is ready
    window.addEventListener('auth:authenticated', async function(event) {
        if (!event.detail.isAuthenticated) {
            window.location.href = '/';
            return;
        }
        
        try {
            // Get access token
            const token = await window.auth.getAccessToken();
            
            if (!token) {
                throw new Error('Authentication token not available');
            }
            
            // Fetch member data from API
            const response = await fetch('/.netlify/functions/get-member', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                // If 404, the user needs to complete registration
                if (response.status === 404) {
                    window.location.href = '/join/?complete=true';
                    return;
                }
                throw new Error('Failed to load member data: ' + response.statusText);
            }
            
            const data = await response.json();
            
            if (data.success && data.member) {
                const member = data.member;
                
                // Set form fields
                document.getElementById('display-name').value = member.name || '';
                document.getElementById('website-url').value = member.website || '';
                document.getElementById('website-description').value = member.description || '';
                document.getElementById('website-tags').value = Array.isArray(member.tags) ? member.tags.join(', ') : '';
                document.getElementById('bio').value = member.bio || '';
                document.getElementById('social-links').value = member.socialLinks || '';
                
                if (member.listInDirectory !== undefined) {
                    document.getElementById('list-directory').checked = member.listInDirectory;
                }
                
                // Handle form submission
                const profileForm = document.getElementById('profile-form');
                if (profileForm) {
                    profileForm.addEventListener('submit', async function(e) {
                        e.preventDefault();
                        
                        // Show loading state
                        const submitButton = this.querySelector('button[type="submit"]');
                        const originalButtonText = submitButton.textContent;
                        submitButton.textContent = 'Updating...';
                        submitButton.disabled = true;
                        
                        try {
                            // Get fresh token
                            const token = await window.auth.getAccessToken();
                            
                            if (!token) {
                                throw new Error('Authentication token not available');
                            }
                            
                            // Prepare update data
                            const updateData = {
                                name: document.getElementById('display-name').value,
                                website: document.getElementById('website-url').value,
                                description: document.getElementById('website-description').value,
                                tags: document.getElementById('website-tags').value,
                                bio: document.getElementById('bio').value,
                                socialLinks: document.getElementById('social-links').value,
                                listInDirectory: document.getElementById('list-directory').checked
                            };
                            
                            // Call update API
                            const response = await fetch('/.netlify/functions/update-member', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify(updateData)
                            });
                            
                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.error || 'Failed to update profile');
                            }
                            
                            const data = await response.json();
                            
                            if (data.success) {
                                alert('Profile updated successfully!');
                                window.location.href = '/dashboard/';
                            } else {
                                throw new Error(data.error || 'Failed to update profile');
                            }
                        } catch (error) {
                            console.error('Error updating profile:', error);
                            alert('Error updating profile: ' + error.message);
                            submitButton.textContent = originalButtonText;
                            submitButton.disabled = false;
                        }
                    });
                }
            } else {
                console.error('Invalid member data returned from API');
                alert('Failed to load your profile data');
            }
        } catch (error) {
            console.error('Error fetching member data:', error);
            alert('Failed to load your profile data. Please try again later.');
        }
    });
});
</script>