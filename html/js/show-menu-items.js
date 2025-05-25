/**
 * Show Menu Items Script
 * Restores all hidden navigation and footer links
 * This reverses the effects of hide-menu-items.js
 */

(function() {
    'use strict';
    
    // Function to show all hidden menu items
    function showMenuItems() {
        console.log('🔓 Starting to show hidden menu items...');
        
        // Show all navigation links
        const navLinks = document.querySelectorAll('.nav-dropdown-link, .nav-link');
        navLinks.forEach(link => {
            if (link.style.display === 'none') {
                link.style.display = '';
                const text = link.textContent.trim();
                const href = link.getAttribute('href');
                console.log(`✅ Restored nav link: ${text} (${href})`);
            }
        });
        
        // Show all footer links
        const footerLinks = document.querySelectorAll('.footer-link');
        footerLinks.forEach(link => {
            if (link.style.display === 'none') {
                link.style.display = '';
                const text = link.textContent.trim();
                const href = link.getAttribute('href');
                console.log(`✅ Restored footer link: ${text} (${href})`);
            }
        });
        
        // Show any hidden dropdown sections
        const dropdownWrappers = document.querySelectorAll('.nav-dropdown-link-wrapper');
        dropdownWrappers.forEach(wrapper => {
            if (wrapper.style.display === 'none') {
                wrapper.style.display = '';
                console.log('✅ Restored dropdown section');
            }
        });
        
        // Remove any hidden classes
        const hiddenElements = document.querySelectorAll('.menu-item-hidden');
        hiddenElements.forEach(element => {
            element.classList.remove('menu-item-hidden');
            console.log('✅ Removed hidden class from element');
        });
        
        // Remove the CSS style that hides items
        const hiddenStyles = document.querySelectorAll('style');
        hiddenStyles.forEach(style => {
            if (style.textContent.includes('.menu-item-hidden')) {
                style.remove();
                console.log('✅ Removed hidden CSS styles');
            }
        });
        
        console.log('🎉 All menu items have been restored!');
    }
    
    // Function to reset all inline styles on navigation elements
    function resetAllStyles() {
        console.log('🔄 Resetting all navigation styles...');
        
        // Reset all navigation elements
        const allNavElements = document.querySelectorAll(`
            .nav-dropdown-link, 
            .nav-link, 
            .footer-link, 
            .nav-dropdown-link-wrapper,
            .nav-dropdown,
            .footer-links-wrapper
        `);
        
        allNavElements.forEach(element => {
            // Only reset display property, keep other styles
            if (element.style.display === 'none') {
                element.style.display = '';
            }
        });
        
        console.log('✅ Navigation styles reset completed');
    }
    
    // Run when DOM is ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                showMenuItems();
                resetAllStyles();
            });
        } else {
            showMenuItems();
            resetAllStyles();
        }
        
        // Also run after a short delay to catch any dynamically loaded content
        setTimeout(function() {
            showMenuItems();
            resetAllStyles();
        }, 500);
    }
    
    // Initialize the script
    init();
    
    console.log('🚀 Show Menu Items script loaded and ready!');
    
})(); 