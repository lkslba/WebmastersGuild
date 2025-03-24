/**
 * WebmastersGuild - Member Directory Script
 * Handles member filtering, searching, and sorting
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.getElementById('member-search');
    const rankFilter = document.getElementById('rank-filter');
    const categoryFilter = document.getElementById('category-filter');
    const directoryStatus = document.getElementById('directory-status');
    const memberCards = document.querySelectorAll('.member-card');
    
    // This is a demo implementation with limited functionality
    // In production, this would use actual data filtering
    
    if (searchInput && rankFilter && categoryFilter) {
        // Member search
        searchInput.addEventListener('input', function() {
            const searchText = this.value.toLowerCase();
            updateDirectoryStatus(`Searching for: "${searchText}"...`);
            
            // In a real implementation, this would filter the members
            if (searchText.length > 0) {
                updateDirectoryStatus(`Showing results for: "${searchText}"`);
            } else {
                updateDirectoryStatus('Displaying all guild members. Use filters to refine results.');
            }
        });
        
        // Rank filter
        rankFilter.addEventListener('change', function() {
            const selectedRank = this.value;
            
            if (selectedRank) {
                updateDirectoryStatus(`Filtering by rank: ${selectedRank}`);
            } else {
                updateDirectoryStatus('Displaying all guild members. Use filters to refine results.');
            }
        });
        
        // Category filter
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            
            if (selectedCategory) {
                updateDirectoryStatus(`Filtering by category: ${selectedCategory}`);
            } else {
                updateDirectoryStatus('Displaying all guild members. Use filters to refine results.');
            }
        });
        
        // Enable filters for demo
        searchInput.disabled = false;
        rankFilter.disabled = false;
        categoryFilter.disabled = false;
    }
    
    // Helper function to update directory status
    function updateDirectoryStatus(message) {
        if (directoryStatus) {
            directoryStatus.innerHTML = `<p>${message}</p>`;
        }
    }
    
    // Random member button functionality
    const randomMemberBtn = document.getElementById('random-member-btn');
    if (randomMemberBtn && memberCards.length > 0) {
        randomMemberBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const randomIndex = Math.floor(Math.random() * memberCards.length);
            const randomMemberLink = memberCards[randomIndex].querySelector('.member-name a');
            
            if (randomMemberLink) {
                window.location.href = randomMemberLink.getAttribute('href');
            }
        });
    }
});