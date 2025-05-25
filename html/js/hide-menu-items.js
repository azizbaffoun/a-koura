/**
 * Hide Menu Items Script
 * Hides specific navigation and footer links across all pages
 * Items to hide: Schedule, Results, Videos, Tickets, Awards, FAQ, Gallery, 
 * Home 2, Home 3, Our Players, News, News Details, Store, Store Details
 */

(function() {
    'use strict';
    
    // List of menu items to hide (by href or text content)
    const itemsToHide = [
        // Navigation links
        'schedule.html',
        'match-results.html',
        'videos.html', 
        'tickets.html',
        'awards.html',
        'faq.html',
        'gallery.html',
        'home-2.html',
        'home-3.html',

        'news.html',
        'store.html',
        
        // Text-based matches for dropdown links
        'Schedule',
        'Results',
        'Videos',
        'Tickets', 
        'Awards',
        'FAQ',
        'Gallery',
        'Home 2',
        'Home 3',

        'News',
        'Store',
        'Game Details',
        'Shop',
        'News Details',
        'Store Details',
        'Players Details',
        'Table',
        'table.html'
    ];
    
    // Function to hide menu items
    function hideMenuItems() {
        console.log('🔒 Starting to hide menu items...');
        
        // Hide navigation dropdown links
        const navLinks = document.querySelectorAll('.nav-dropdown-link, .nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            
            // Check if this link should be hidden
            const shouldHide = itemsToHide.some(item => {
                return href && href.includes(item) || text === item;
            });
            
            if (shouldHide) {
                link.style.display = 'none';
                console.log(`🚫 Hidden nav link: ${text} (${href})`);
            }
        });
        
        // Hide footer links
        const footerLinks = document.querySelectorAll('.footer-link');
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            
            // Check if this link should be hidden
            const shouldHide = itemsToHide.some(item => {
                return href && href.includes(item) || text === item;
            });
            
            if (shouldHide) {
                link.style.display = 'none';
                console.log(`🚫 Hidden footer link: ${text} (${href})`);
            }
        });
        
        // Hide specific dropdown sections if they become empty
        hideEmptyDropdownSections();
        
        console.log('✅ Menu items hiding completed');
    }
    
    // Function to hide empty dropdown sections
    function hideEmptyDropdownSections() {
        const dropdownWrappers = document.querySelectorAll('.nav-dropdown-link-wrapper');
        dropdownWrappers.forEach(wrapper => {
            const visibleLinks = wrapper.querySelectorAll('.nav-dropdown-link:not([style*="display: none"])');
            if (visibleLinks.length === 0) {
                wrapper.style.display = 'none';
                console.log('🚫 Hidden empty dropdown section');
            }
        });
    }
    
    // Function to hide the main table section (for table.html)
    function hideTableSection() {
        // Hide table heading, scrolling wrapper, and all table rows
        const tableSelectors = [
            '.table-heading-wrapper',
            '.table-scrolling-wrapper',
            '.table-page-row',
            '.full-width-row-wrapper',
            '.table-team-wrapper',
            '.table-page-first-cell',
            '.table-teams-name',
            '.table',
            '.matches-table',
            '.table-title',
            '.table-text',
            '.h4-black.h4-table',
            '.table-paragraph',
        ];
        let found = false;
        tableSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = 'none';
                found = true;
            });
        });
        if (found) {
            console.log('🚫 Hidden table section(s)');
        }
    }
    
    // Function to add hidden class for CSS-based hiding (backup method)
    function addHiddenClasses() {
        // Add CSS for hidden items
        const style = document.createElement('style');
        style.textContent = `
            .menu-item-hidden {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Run when DOM is ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                hideMenuItems();
                hideTableSection();
            });
        } else {
            hideMenuItems();
            hideTableSection();
        }
        // Also run after a short delay to catch any dynamically loaded content
        setTimeout(function() {
            hideMenuItems();
            hideTableSection();
        }, 500);
        // Add CSS classes
        addHiddenClasses();
    }
    
    // Initialize the script
    init();
    
    // Watch for dynamic content changes
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            let shouldRecheck = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && 
                            (node.classList.contains('nav-dropdown-link') || 
                             node.classList.contains('footer-link') ||
                             node.querySelector('.nav-dropdown-link, .footer-link, .table-page-row, .table-heading-wrapper, .table-scrolling-wrapper'))) {
                            shouldRecheck = true;
                            break;
                        }
                    }
                }
            });
            if (shouldRecheck) {
                setTimeout(function() {
                    hideMenuItems();
                    hideTableSection();
                }, 100);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
})(); 