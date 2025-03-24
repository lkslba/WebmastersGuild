---
title: "Member Dashboard"
description: "Manage your WebmastersGuild profile and track your achievements."
draft: false
---

# Member Dashboard

```
// Loading user data...
// This page requires authentication
```

<div class="dashboard-container">
    <div class="dashboard-section profile-section">
        <h2 class="section-title">// PROFILE</h2>
        <div class="user-info">
            <div id="user-name"></div>
            <div id="user-email"></div>
            <div id="user-website"></div>
        </div>
        <a href="/dashboard/edit-profile/" class="button">Edit Profile</a>
    </div>

    <div class="dashboard-section achievements-section">
        <h2 class="section-title">// ACHIEVEMENTS</h2>
        <div class="achievements-list">
            <div class="achievement locked">
                <div class="achievement-icon">🔒</div>
                <div class="achievement-details">
                    <div class="achievement-name">Guild Initiate</div>
                    <div class="achievement-desc">Complete your member profile</div>
                </div>
            </div>
            <div class="achievement locked">
                <div class="achievement-icon">🔒</div>
                <div class="achievement-details">
                    <div class="achievement-name">Ring Bearer</div>
                    <div class="achievement-desc">Join the WebRing</div>
                </div>
            </div>
            <div class="achievement locked">
                <div class="achievement-icon">🔒</div>
                <div class="achievement-details">
                    <div class="achievement-name">Challenger</div>
                    <div class="achievement-desc">Complete your first challenge</div>
                </div>
            </div>
        </div>
    </div>

    <div class="dashboard-section webring-section">
        <h2 class="section-title">// WEBRING</h2>
        <div id="webring-status" class="not-joined">
            <pre class="ascii-art">
+---------- WEBRING STATUS ----------+
|                                    |
|  STATUS: Not yet joined            |
|                                    |
+------------------------------------+</pre>
        </div>
        <a href="/dashboard/webring/" class="button">Manage WebRing</a>
    </div>

    <div class="dashboard-section challenges-section">
        <h2 class="section-title">// MY CHALLENGES</h2>
        <div class="challenges-list">
            <p>You haven't completed any challenges yet.</p>
            <a href="/challenges/" class="button">View Available Challenges</a>
        </div>
    </div>
</div>

<script>
// Check for authentication and load member data
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated with Netlify Identity
    if (!window.netlifyIdentity || !window.netlifyIdentity.currentUser()) {
        window.location.href = '/';
        alert('Please log in to access your dashboard');
        return;
    }
    
    // Get current user and token
    const currentUser = window.netlifyIdentity.currentUser();
    
    // Show loading state
    document.getElementById('user-name').textContent = 'Loading...';
    document.getElementById('user-email').textContent = 'Loading...';
    document.getElementById('user-website').textContent = 'Loading...';
    
    // Fetch member data from API
    fetch('/.netlify/functions/get-member', {
        headers: {
            'Authorization': `Bearer ${currentUser.token.access_token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load member data');
        }
        return response.json();
    })
    .then(data => {
        if (data.success && data.member) {
            const member = data.member;
            
            // Update user info sections
            const userNameEl = document.getElementById('user-name');
            const userEmailEl = document.getElementById('user-email');
            const userWebsiteEl = document.getElementById('user-website');
            
            if (userNameEl) userNameEl.textContent = `Name: ${member.name}`;
            if (userEmailEl) userEmailEl.textContent = `Email: ${member.email}`;
            if (userWebsiteEl) userWebsiteEl.textContent = `Website: ${member.website}`;
            
            // Update webring status if applicable
            if (member.webring) {
                const webringStatus = document.getElementById('webring-status');
                if (webringStatus) {
                    webringStatus.innerHTML = `
                        <pre class="ascii-art">
+---------- WEBRING STATUS ----------+
|                                    |
|  STATUS: Active Member             |
|                                    |
+------------------------------------+</pre>
                    `;
                    webringStatus.classList.remove('not-joined');
                }
            }
            
            // Update achievements based on badges
            if (member.badges && member.badges.length > 0) {
                const achievements = document.querySelectorAll('.achievement');
                
                // Check for specific badges and update UI
                if (member.badges.includes('guild-initiate')) {
                    updateAchievement(achievements, 'Guild Initiate');
                }
                
                if (member.badges.includes('ring-bearer')) {
                    updateAchievement(achievements, 'Ring Bearer');
                }
                
                if (member.badges.includes('challenger')) {
                    updateAchievement(achievements, 'Challenger');
                }
            }
        } else {
            console.error('Invalid member data returned from API');
        }
    })
    .catch(error => {
        console.error('Error fetching member data:', error);
        alert('Failed to load your profile data. Please try again later.');
    });
    
    // Helper function to update achievement status
    function updateAchievement(achievements, name) {
        for (let achievement of achievements) {
            const nameEl = achievement.querySelector('.achievement-name');
            if (nameEl && nameEl.textContent === name) {
                achievement.classList.remove('locked');
                achievement.querySelector('.achievement-icon').textContent = '🏆';
                break;
            }
        }
    }
});
</script>

<style>
.dashboard-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-xl);
}

.dashboard-section {
    border: 1px solid var(--color-border);
    padding: var(--space-lg);
}

.achievements-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-md);
}

.achievement {
    display: flex;
    align-items: center;
    padding: var(--space-sm);
    border: 1px solid var(--color-border);
}

.achievement.locked {
    opacity: 0.6;
}

.achievement-icon {
    font-size: 2rem;
    margin-right: var(--space-md);
}

.achievement-name {
    font-weight: bold;
    color: var(--color-accent);
}

.challenges-list {
    margin-top: var(--space-md);
}

@media (min-width: 768px) {
    .dashboard-container {
        grid-template-columns: 1fr 1fr;
    }
}
</style>