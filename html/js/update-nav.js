// Script to replace Home dropdown with a direct link
document.addEventListener('DOMContentLoaded', function() {
  // Function to handle different themes (home-1, home-2, home-3)
  function updateHomeNavigation() {
    // Get current page path to determine which page is active
    const currentPath = window.location.pathname;
    const isHome1 = currentPath.includes('home-1.html') || currentPath.endsWith('/');
    const isHome2 = currentPath.includes('home-2.html');
    const isHome3 = currentPath.includes('home-3.html');
    
    // Find all Home dropdown elements (handles different page themes)
    const homeDropdowns = document.querySelectorAll('.nav-dropdown.nav-home');
    
    homeDropdowns.forEach(function(dropdown) {
      // Get parent container
      const menuWrap = dropdown.parentElement;
      
      // Create new direct link element
      const newHomeLink = document.createElement('a');
      newHomeLink.href = 'home-1.html';
      newHomeLink.textContent = 'Home';
      
      // Determine the appropriate class based on page theme
      if (dropdown.querySelector('.white-theme-home-title')) {
        // For home-2 theme
        newHomeLink.className = 'nav-link white-theme';
      } else {
        // For home-1 and home-3 themes
        newHomeLink.className = 'nav-link';
      }
      
      // Add active state if on home-1 page
      if (isHome1) {
        newHomeLink.classList.add('w--current');
        newHomeLink.setAttribute('aria-current', 'page');
      }
      
      // Replace dropdown with direct link
      menuWrap.replaceChild(newHomeLink, dropdown);
    });
  }
  
  // Function to remove navbar elements shown in the third image
  function removeNavbarElements() {
    // Remove the NEXT button and its container
    const nextMatchContainers = document.querySelectorAll('.collection-list-wrapper-6, .collection-list-wrapper-5');
    nextMatchContainers.forEach(container => {
      if (container) container.remove();
    });
    
    // Remove the cart wrapper
    const cartWrappers = document.querySelectorAll('.cart-wrapper, .w-commerce-commercecartwrapper.cart');
    cartWrappers.forEach(wrapper => {
      if (wrapper) wrapper.remove();
    });
    
    // Remove "Get in Touch" button in the header
    const touchButtons = document.querySelectorAll('.button-header-wrapper');
    touchButtons.forEach(button => {
      if (button) button.remove();
    });
    
    // Remove "No items found" empty states
    const emptyStates = document.querySelectorAll('.empty-state-4, .w-dyn-empty');
    emptyStates.forEach(state => {
      if (state) state.remove();
    });
  }
  
  // Function to fix the positioning of navigation items
  function fixNavigationPositioning() {
    // Add CSS to adjust the menu positioning
    const style = document.createElement('style');
    style.textContent = `
      /* Adjust main navigation menu position */
      .nav-menu-wrapper {
        justify-content: flex-start !important;
      }
      
      /* Add left margin to the brand/logo to provide some spacing */
      .brand.w-nav-brand, .brand-tablet.w-nav-brand {
        margin-right: 30px !important;
      }
      
      /* Adjust the menu-wrap positioning */
      .menu-wrap {
        margin-left: 0 !important;
        padding-left: 0 !important;
      }
      
      /* Add spacing between navigation items */
      .nav-link, .nav-dropdown {
        margin-right: 15px !important;
      }
      
      /* Remove any extra right margin that might push items right */
      .header-right-block-wrapper {
        margin-left: auto !important;
        margin-right: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Function to remove promotional elements and footer credits
  function removePromotionalElements() {
    // Remove the left promotion label (Get Unlimited Webflow Development)
    const leftPromotion = document.querySelector('.promotion-label-left');
    if (leftPromotion) leftPromotion.remove();
    
    // Remove the right promotion label (Buy this Template, All Templates)
    const rightPromotion = document.querySelector('.promotion-label-right');
    if (rightPromotion) rightPromotion.remove();
    
    // Remove the entire promotion-labels-wrapper
    const promotionWrapper = document.querySelector('.promotion-labels-wrapper-to-remove');
    if (promotionWrapper) promotionWrapper.remove();
    
    // Remove footer credits (Template by wCopilot, Powered by Webflow)
    const footerRightsWrapper = document.querySelector('.footer-rights-wrapper');
    if (footerRightsWrapper) footerRightsWrapper.remove();
  }
  
  // Run the functions
  updateHomeNavigation();
  removeNavbarElements();
  fixNavigationPositioning();
  removePromotionalElements();
}); 