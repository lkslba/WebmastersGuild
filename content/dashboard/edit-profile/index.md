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
// This function will be replaced with real authentication
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.netlify-identity-user')) {
        window.location.href = '/';
        alert('Please log in to access your profile');
    }
});
</script>