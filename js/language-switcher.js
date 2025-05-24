document.addEventListener('DOMContentLoaded', function() {
  // Wait for Weglot to initialize
  const weglotInterval = setInterval(() => {
    if (typeof Weglot !== 'undefined' && Weglot.initialized) {
      clearInterval(weglotInterval);
      initLanguageSwitcher();
    }
  }, 100);

  // Initialize after 2s even if Weglot isn't detected
  setTimeout(() => {
    if (typeof Weglot === 'undefined' || !Weglot.initialized) {
      console.warn('Weglot not detected, initializing language switcher anyway');
      initLanguageSwitcher();
    }
  }, 2000);

  function initLanguageSwitcher() {
    // Set initial language based on browser preference or default to English
    const userLang = navigator.language || navigator.userLanguage;
    let currentLang = userLang.startsWith('ar') ? 'ar' : 'en';

    // Check for stored language preference
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang) {
      currentLang = storedLang;
    }

    // Initialize the page with the detected language
    setLanguage(currentLang);

    // Add event listeners to language switcher links
    const languageSwitchers = document.querySelectorAll('.language-switcher a');
    languageSwitchers.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const lang = this.getAttribute('data-lang');
        setLanguage(lang);
      });
    });
  }

  // Update active state on language links
  function updateLanguageUI(lang) {
    const allLinks = document.querySelectorAll('.language-switcher a');
    allLinks.forEach(link => {
      if (link.getAttribute('data-lang') === lang) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Set language and handle RTL/LTR direction
  function setLanguage(lang) {
    // Update active link in UI
    updateLanguageUI(lang);

    // Handle RTL/LTR
    const htmlElement = document.documentElement;
    if (lang === 'ar') {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.classList.add('rtl');
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.classList.remove('rtl');
    }

    // Update language in Weglot
    if (typeof Weglot !== 'undefined' && Weglot.initialized) {
      try {
        // Get current Weglot language
        const currentWeglotLang = Weglot.getCurrentLang();
        
        // Only switch if needed
        if ((lang === 'ar' && currentWeglotLang !== 'ar') || 
            (lang === 'en' && currentWeglotLang !== 'en')) {
          Weglot.switchTo(lang);
        }
      } catch (error) {
        console.error('Error switching language in Weglot:', error);
      }
    }

    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
  }
}); 