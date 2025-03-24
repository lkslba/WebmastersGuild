---
title: "Member Directory"
description: "Browse the websites of WebmastersGuild members."
draft: false
---

# Member Directory

```
// A collection of guild member websites
// Browse by rank, filter by tags, or search by name
```

<div id="directory-status" class="directory-status">
    <p>Displaying all guild members. Use filters to refine results.</p>
</div>

## Member Profiles

<div class="member-grid">
    <div class="member-card">
        <div class="member-info">
            <h3 class="member-name">
                <a href="/members/sample">Terminal Wizard</a>
            </h3>
            <div class="member-rank rank-journeyman">Journeyman</div>
            <div class="member-tags">
                <span class="tag">blog</span>
                <span class="tag">technology</span>
                <span class="tag">coding</span>
            </div>
            <div class="member-description">
                A personal website focused on programming tutorials, tech experiments, and digital explorations.
            </div>
            <div class="member-link">
                <a href="https://example.com" target="_blank" rel="noopener">https://example.com</a>
            </div>
        </div>
        <div class="member-actions">
            <a href="/members/sample" class="button">View Profile</a>
        </div>
    </div>
    
    <!-- More member cards will be added here as members join -->
</div>

<div class="directory-actions">
    <div class="ascii-divider">+--------------------------------------------------------------+</div>
    <p>The guild is growing! More members will appear here as they join.</p>
    <a href="/join/" class="button">Join the Guild</a>
</div>

<style>
.directory-status {
    margin-bottom: var(--space-lg);
    padding: var(--space-md);
    border: 1px solid var(--color-border);
}

.member-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-lg);
    margin: var(--space-xl) 0;
}

.member-card {
    border: 1px solid var(--color-border);
    padding: var(--space-lg);
}

.member-name {
    margin-top: 0;
    margin-bottom: var(--space-xs);
}

.member-name a {
    color: var(--color-accent);
}

.member-rank {
    display: inline-block;
    margin-bottom: var(--space-md);
    font-size: 0.9rem;
}

.rank-apprentice {
    color: #aaaaaa;
}

.rank-journeyman {
    color: #66cc66;
}

.rank-master {
    color: #b3b300;
}

.rank-grandmaster {
    color: #ff9900;
}

.member-tags {
    margin-bottom: var(--space-md);
}

.tag {
    display: inline-block;
    font-size: 0.9rem;
    padding: var(--space-xs) var(--space-sm);
    margin-right: var(--space-xs);
    margin-bottom: var(--space-xs);
    border: 1px solid var(--color-border);
}

.member-description {
    margin-bottom: var(--space-md);
}

.member-link {
    margin-bottom: var(--space-md);
    word-break: break-all;
    font-family: var(--font-mono);
    font-size: 0.9rem;
}

.member-actions {
    margin-top: var(--space-md);
}

.directory-actions {
    text-align: center;
    margin-top: var(--space-xxl);
    margin-bottom: var(--space-xxl);
}

@media (min-width: 768px) {
    .member-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .member-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>