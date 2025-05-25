document.addEventListener('DOMContentLoaded', function() {
  // Initialize language switcher immediately
  initLanguageSwitcher();

  // Wait for Weglot to initialize
  const weglotInterval = setInterval(() => {
    if (typeof Weglot !== 'undefined' && Weglot.initialized) {
      clearInterval(weglotInterval);
      syncWithWeglot();
    }
  }, 100);

  // Initialize after 2s even if Weglot isn't detected
  setTimeout(() => {
    if (typeof Weglot === 'undefined' || !Weglot.initialized) {
      console.warn('Weglot not detected, language switcher working independently');
    }
  }, 2000);

  function initLanguageSwitcher() {
    // Update language switcher HTML to use flags
    updateLanguageSwitcherHTML();

    // Set initial language based on browser preference or default to English
    const userLang = navigator.language || navigator.userLanguage;
    let currentLang = 'en'; // Default to English
    
    // Check if browser language is Arabic
    if (userLang.startsWith('ar') || userLang.includes('ar')) {
      currentLang = 'ar';
    }

    // Check for stored language preference (overrides browser detection)
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang) {
      currentLang = storedLang;
    }

    // Initialize the page with the detected language
    setLanguage(currentLang);

    // Add event listeners to language switcher links
    addLanguageSwitcherListeners();
  }

  function addLanguageSwitcherListeners() {
    const languageSwitchers = document.querySelectorAll('.language-switcher a');
    languageSwitchers.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const lang = this.getAttribute('data-lang');
        setLanguage(lang);
      });
    });
  }

  function updateLanguageSwitcherHTML() {
    const languageSwitchers = document.querySelectorAll('.language-switcher');
    languageSwitchers.forEach(switcher => {
      switcher.innerHTML = `
        <a href="#" data-lang="en" class="lang-switch" title="Switch to English">
          <img src="images/flags/usa-flag.svg" alt="English" class="flag-icon">
        </a>
        <a href="#" data-lang="ar" class="lang-switch" title="التبديل إلى العربية">
          <img src="images/flags/saudi-flag.svg" alt="العربية" class="flag-icon">
        </a>
      `;
    });
    
    // Re-add event listeners after updating HTML
    addLanguageSwitcherListeners();
  }

  function syncWithWeglot() {
    // Sync with Weglot if available
    if (typeof Weglot !== 'undefined' && Weglot.initialized) {
      const currentWeglotLang = Weglot.getCurrentLang();
      updateLanguageUI(currentWeglotLang);
    }
  }

  // Update active state on language links and show appropriate flag
  function updateLanguageUI(lang) {
    const allLinks = document.querySelectorAll('.language-switcher a');
    
    // Remove active class from all links
    allLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Show only the flag for the opposite language
    if (lang === 'ar') {
      // If site is in Arabic, show USA flag (to switch to English)
      const enLink = document.querySelector('.language-switcher a[data-lang="en"]');
      const arLink = document.querySelector('.language-switcher a[data-lang="ar"]');
      if (enLink && arLink) {
        enLink.style.display = 'flex';
        arLink.style.display = 'none';
        enLink.classList.add('active');
      }
    } else {
      // If site is in English, show Saudi flag (to switch to Arabic)
      const enLink = document.querySelector('.language-switcher a[data-lang="en"]');
      const arLink = document.querySelector('.language-switcher a[data-lang="ar"]');
      if (enLink && arLink) {
        enLink.style.display = 'none';
        arLink.style.display = 'flex';
        arLink.classList.add('active');
      }
    }
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