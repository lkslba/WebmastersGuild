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
// This function will be replaced with real authentication
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.netlify-identity-user')) {
        window.location.href = '/';
        alert('Please log in to access your dashboard');
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