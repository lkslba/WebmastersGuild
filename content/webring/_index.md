---
title: "WebRing"
description: "Navigate through the WebmastersGuild member websites"
draft: false
---

# WebmastersGuild WebRing

<pre class="ascii-art">
+-------------------------------+
|                               |
|  WebmastersGuild WebRing Hub  |
|                               |
+-------------------------------+</pre>

The WebmastersGuild WebRing connects member websites together in a navigable ring, allowing visitors to discover the diverse personal websites in our community.

## What is a WebRing?

```
A WebRing is a collection of websites linked together in a circular structure.
Navigation buttons on each site allow visitors to travel to the previous site,
the next site, or jump to a random site in the ring.
```

## WebRing Members

<div class="webring-members">
    <p>The WebRing is awaiting its first members. Join the guild and add your site to the ring!</p>
    
    <div class="webring-diagram">
        <pre class="ascii-art">
             +------------+
             |            |
    +------->| Your Site? |------+
    |        |            |      |
    |        +------------+      |
    |                            v
+---+-----------+      +------------------+
|               |      |                  |
| Another Site? |<-----| Yet Another Site?|
|               |      |                  |
+---------------+      +------------------+</pre>
    </div>
</div>

## How to Join

To join the WebmastersGuild WebRing:

1. Become a member of the WebmastersGuild
2. Log in to your [dashboard](/dashboard/)
3. Go to WebRing Management
4. Follow the instructions to add the WebRing navigation to your site

## Navigation Tools

<div class="webring-navigation">
    <p>Choose how to explore the WebRing:</p>
    
    <div class="webring-nav-buttons">
        <a href="/webring/random/" class="button">Random Site</a>
        <a href="/webring/list/" class="button button-secondary">View All Members</a>
    </div>
</div>

<style>
.webring-members {
    margin: var(--space-xl) 0;
}

.webring-diagram {
    margin: var(--space-xl) 0;
}

.webring-navigation {
    margin: var(--space-xl) 0;
    padding: var(--space-lg);
    border: 1px solid var(--color-border);
}

.webring-nav-buttons {
    display: flex;
    gap: var(--space-md);
    margin-top: var(--space-md);
}

@media (max-width: 768px) {
    .webring-nav-buttons {
        flex-direction: column;
    }
}
</style>