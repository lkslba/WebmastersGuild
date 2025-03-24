---
title: "Authentication Callback"
description: "Processing your authentication"
draft: false
---

<div class="callback-container">
    <div class="loading">
        <p>Processing your authentication...</p>
        <pre class="ascii-art">
+---------------------------+
|                           |
|      Please wait...       |
|                           |
+---------------------------+
        </pre>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Check when auth is completed
    window.addEventListener('auth:authenticated', function(event) {
        const isAuthenticated = event.detail.isAuthenticated;
        
        if (isAuthenticated) {
            // Check if user has a profile in our system
            checkProfile();
        } else {
            // Redirect to home if not authenticated
            window.location.href = '/';
        }
    });
    
    // Check if the user needs to complete registration
    async function checkProfile() {
        try {
            const token = await window.auth.getAccessToken();
            
            const response = await fetch('/.netlify/functions/get-member', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.success && data.member) {
                    // User has a profile, redirect to dashboard
                    window.location.href = '/dashboard/';
                } else {
                    // User needs to complete registration
                    window.location.href = '/join/?complete=true';
                }
            } else {
                // If API returns 404, user needs to complete registration
                if (response.status === 404) {
                    window.location.href = '/join/?complete=true';
                } else {
                    console.error('Error checking profile:', await response.text());
                    alert('There was an error checking your profile. Please try again later.');
                    window.location.href = '/';
                }
            }
        } catch (error) {
            console.error('Error checking profile:', error);
            alert('There was an error checking your profile. Please try again later.');
            window.location.href = '/';
        }
    }
});
</script>

<style>
.callback-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
}

.loading {
    margin-top: var(--space-xl);
}

.loading p {
    margin-bottom: var(--space-lg);
    font-size: 1.2rem;
    color: var(--color-accent);
}
</style>