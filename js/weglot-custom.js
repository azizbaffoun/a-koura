// Weglot Custom Integration for Sports Vision website
document.addEventListener('DOMContentLoaded', function() {
  // Wait for Weglot to be initialized (it takes a moment after page load)
  const checkWeglotInterval = setInterval(function() {
    if (window.Weglot && window.Weglot.initialized) {
      clearInterval(checkWeglotInterval);
      customizeWeglot();
    }
  }, 100);

  // After 3 seconds, try regardless (fallback)
  setTimeout(function() {
    if (window.Weglot && !window.weglotCustomized) {
      customizeWeglot();
    }
  }, 3000);
});

function customizeWeglot() {
  // Set a flag to prevent multiple initializations
  window.weglotCustomized = true;

  // Add Weglot CSS overrides to match site design
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Hide the default Weglot selector */
    .weglot-container, 
    .country-selector {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;
  
  document.head.appendChild(styleElement);

  // Initialize Weglot language change listeners
  initWeglotLanguageChangeListener();
}

function initWeglotLanguageChangeListener() {
  if (!window.Weglot) return;

  // Listen for Weglot language changes and update RTL/LTR accordingly
  try {
    document.addEventListener('weglot.language.changed', function(e) {
      const newLang = e.detail.newLanguage;
      const htmlElement = document.documentElement;
      
      // Update language switcher UI
      updateLanguageSwitcherUI(newLang);
      
      // Set RTL for Arabic
      if (newLang === 'ar') {
        htmlElement.setAttribute('dir', 'rtl');
        htmlElement.classList.add('rtl');
      } else {
        htmlElement.setAttribute('dir', 'ltr');
        htmlElement.classList.remove('rtl');
      }

      // Store user preference
      localStorage.setItem('preferredLanguage', newLang);
    });
  } catch (error) {
    console.error('Error setting up Weglot language change listener:', error);
  }
}

function updateLanguageSwitcherUI(lang) {
  const allLinks = document.querySelectorAll('.language-switcher a');
  allLinks.forEach(link => {
    const linkLang = link.getAttribute('data-lang');
    if (linkLang === lang) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
} 