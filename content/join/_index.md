---
title: "Join the Guild"
description: "Become a member of the WebmastersGuild and connect with fellow website creators."
draft: false
---

# Join the WebmastersGuild

```
> Welcome, aspiring guild member!
> We're excited that you're interested in joining our community of website creators.
```

## Membership Benefits

As a member of the WebmastersGuild, you'll gain:

- `> Community Connection:` Join a supportive network of personal website creators
- `> Skill Development:` Access to tutorials, resources, and monthly challenges
- `> Discovery:` Have your site included in our member directory
- `> Achievement System:` Earn badges and advance through guild ranks
- `> WebRing Participation:` Join our classic web navigation system

## Requirements

```
Required:
- [x] A personal website that you've created and maintain
- [x] Willingness to participate in the community
- [x] Agreement to follow our community guidelines
```

## /* REGISTRATION FORM */

<form id="join-form" name="guild-join" method="POST" data-netlify="true" class="guild-form">
  <input type="hidden" name="form-name" value="guild-join">
  
  <div class="form-group">
    <label for="name">Name or Handle:</label>
    <input type="text" id="name" name="name" required>
  </div>
  
  <div class="form-group">
    <label for="email">Email Address:</label>
    <input type="email" id="email" name="email" required>
  </div>
  
  <div class="form-group">
    <label for="website-url">Your Website URL:</label>
    <input type="url" id="website-url" name="website-url" placeholder="https://yourdomain.com" required>
  </div>
  
  <div class="form-group">
    <label for="website-description">Brief Website Description:</label>
    <textarea id="website-description" name="website-description" rows="3" required></textarea>
  </div>
  
  <div class="form-group">
    <label for="website-tags">Tags (comma separated):</label>
    <input type="text" id="website-tags" name="website-tags" placeholder="blog, photography, technology">
  </div>
  
  <div class="form-group">
    <label for="password">Choose a Password:</label>
    <input type="password" id="password" name="password" required>
    <small>Minimum 8 characters, must include one letter and one number</small>
  </div>
  
  <div class="form-group checkbox-group">
    <input type="checkbox" id="agreement" name="agreement" required>
    <label for="agreement">I agree to the WebmastersGuild community guidelines and understand my website will be listed in the public directory.</label>
  </div>
  
  <div class="form-actions">
    <button type="submit" class="button">Submit Application</button>
  </div>
</form>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is already logged in
  if (window.netlifyIdentity && window.netlifyIdentity.currentUser()) {
    // If already logged in, redirect to dashboard
    window.location.href = '/dashboard/';
  }
  
  // Handle form submission for registration
  const joinForm = document.getElementById('join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const website = document.getElementById('website-url').value;
      const description = document.getElementById('website-description').value;
      const tags = document.getElementById('website-tags').value;
      
      // First, create a new user with Netlify Identity
      if (window.netlifyIdentity) {
        window.netlifyIdentity.signup(email, password, {
          data: {
            full_name: name,
            website: website,
            description: description,
            tags: tags,
            rank: 'apprentice',
            join_date: new Date().toISOString().split('T')[0]
          }
        }).then(() => {
          // Also submit the form to Netlify for the site owner to process
          joinForm.submit();
          
          // A success message will be shown by Netlify Identity
          // The user will be redirected to the dashboard after login via main.js
        }).catch(error => {
          alert('Registration failed: ' + error.message);
        });
      } else {
        // Fallback if Netlify Identity isn't loaded
        joinForm.submit();
      }
    });
  }
});
</script>

## After You Join

Once your application is approved:

1. You'll receive a welcome email with your unique guild member code
2. Your website will be added to our member directory
3. You'll be able to add the WebmastersGuild badge to your site
4. You'll start as an Apprentice and can begin earning achievements

## Community Guidelines

The WebmastersGuild is committed to maintaining a positive, supportive community. We ask all members to:

- Be respectful and constructive in all interactions
- Support fellow guild members in their web development journey
- Avoid spam, excessive self-promotion, or disruptive behavior
- Create websites that don't contain harmful, illegal, or offensive content

We look forward to welcoming you to the guild!