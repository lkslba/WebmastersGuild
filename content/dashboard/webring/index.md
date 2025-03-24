---
title: "Manage WebRing"
description: "Join the WebmastersGuild WebRing and get your navigation code"
draft: false
---

# WebRing Management

```
// This page requires authentication
// Manage your WebRing participation
```

<div class="webring-container">
    <div class="webring-info">
        <h2 class="section-title">// ABOUT THE WEBRING</h2>
        <p>The WebmastersGuild WebRing connects member websites together in a navigable ring, allowing visitors to discover new sites in the community.</p>
        
        <pre class="ascii-art">
  [Previous Site] -- [WebmastersGuild] -- [Next Site]
                       [Random Site]
        </pre>
        
        <p>By joining the WebRing, you'll add a navigation snippet to your website that allows visitors to travel through the ring, discovering other members' sites.</p>
    </div>
    
    <div class="webring-join">
        <h2 class="section-title">// JOIN THE WEBRING</h2>
        <form id="webring-form" name="webring-join" method="POST" data-netlify="true" class="guild-form">
            <input type="hidden" name="form-name" value="webring-join">
            <input type="hidden" id="user-id" name="user-id">
            
            <div class="form-group">
                <label for="website-url">Your Website URL:</label>
                <input type="url" id="website-url" name="website-url" placeholder="https://yourdomain.com" required>
                <small>This must be the same URL you provided in your profile</small>
            </div>
            
            <div class="form-group">
                <label for="preferred-location">Preferred Location for WebRing Navigation:</label>
                <select id="preferred-location" name="preferred-location" required>
                    <option value="">Select a location...</option>
                    <option value="footer">Footer</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="header">Header</option>
                    <option value="custom">Custom Location</option>
                </select>
            </div>
            
            <div class="form-group checkbox-group">
                <input type="checkbox" id="webring-agreement" name="webring-agreement" required>
                <label for="webring-agreement">I agree to add the WebRing navigation code to my website and maintain it while I am a member of the WebRing.</label>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="button">Join WebRing</button>
            </div>
        </form>
    </div>
    
    <div class="webring-code hidden" id="webring-code-section">
        <h2 class="section-title">// YOUR WEBRING CODE</h2>
        <p>Add the following HTML code to your website to join the WebRing:</p>
        
        <pre class="code-block"><code>&lt;div class="webmasters-guild-webring"&gt;
  &lt;div class="webring-links"&gt;
    &lt;a href="https://webmastersguild.org/webring/prev/?from=YOUR_SITE_ID" class="webring-prev"&gt;[Previous]&lt;/a&gt;
    &lt;a href="https://webmastersguild.org/webring/" class="webring-home"&gt;[WebmastersGuild]&lt;/a&gt;
    &lt;a href="https://webmastersguild.org/webring/next/?from=YOUR_SITE_ID" class="webring-next"&gt;[Next]&lt;/a&gt;
    &lt;a href="https://webmastersguild.org/webring/random/" class="webring-random"&gt;[Random]&lt;/a&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
        
        <p>You can style the WebRing navigation to match your site's design. Here's some optional CSS:</p>
        
        <pre class="code-block"><code>.webmasters-guild-webring {
  font-family: monospace;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
}

.webring-links a {
  margin: 0 0.5rem;
  text-decoration: none;
}

.webring-links a:hover {
  text-decoration: underline;
}</code></pre>
        
        <div class="webring-verification">
            <h3>Verification Status</h3>
            <p>After adding the code to your site, click the button below to verify your WebRing implementation:</p>
            <button type="button" class="button" id="verify-webring">Verify Implementation</button>
            <div id="verification-result"></div>
        </div>
        
        <div class="form-actions">
            <a href="/dashboard/" class="button button-secondary">Back to Dashboard</a>
        </div>
    </div>
</div>

<script>
// This function will be replaced with real authentication
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.netlify-identity-user')) {
        window.location.href = '/';
        alert('Please log in to access WebRing management');
    }
    
    // Show the code section when form is submitted (demo only)
    const webringForm = document.getElementById('webring-form');
    if (webringForm) {
        webringForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('webring-code-section').classList.remove('hidden');
            webringForm.parentElement.classList.add('hidden');
        });
    }
    
    // Verification button demo
    const verifyButton = document.getElementById('verify-webring');
    if (verifyButton) {
        verifyButton.addEventListener('click', function() {
            const result = document.getElementById('verification-result');
            result.innerHTML = '<p class="verification-pending">Checking your site... This may take a moment...</p>';
            
            // Simulate verification (would be server-side in production)
            setTimeout(function() {
                result.innerHTML = '<p class="verification-success">WebRing implementation verified! Your site is now part of the WebmastersGuild WebRing.</p>';
            }, 2000);
        });
    }
});
</script>

<style>
.webring-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-xl);
}

.webring-info, .webring-join, .webring-code {
    border: 1px solid var(--color-border);
    padding: var(--space-lg);
}

.code-block {
    background-color: rgba(255, 255, 255, 0.1);
    padding: var(--space-md);
    overflow-x: auto;
    border: 1px solid var(--color-border);
    margin: var(--space-md) 0;
}

.hidden {
    display: none;
}

.verification-pending {
    color: var(--color-accent);
}

.verification-success {
    color: var(--color-success);
}

.webring-verification {
    margin-top: var(--space-lg);
    padding-top: var(--space-md);
    border-top: 1px solid var(--color-border);
}

@media (min-width: 768px) {
    .webring-container {
        grid-template-columns: 1fr;
    }
}
</style>