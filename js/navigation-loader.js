// Navigation Loader - Dynamically loads and injects navigation component
// This eliminates the need to duplicate navigation code across all HTML files

(function() {
  'use strict';

  // Function to load navigation HTML
  async function loadNavigation() {
    try {
      // Determine the correct path based on current page location
      const currentPath = window.location.pathname;
      const isInSubfolder = currentPath.includes('/de/');
      const navPath = isInSubfolder ? '../components/navigation.html' : 'components/navigation.html';

      // Fetch the navigation HTML
      const response = await fetch(navPath);
      if (!response.ok) {
        throw new Error(`Failed to load navigation: ${response.status}`);
      }

      const navHTML = await response.text();

      // Find the navigation placeholder or inject at the beginning of body
      let navContainer = document.getElementById('navigation-placeholder');

      if (!navContainer) {
        // Create placeholder if it doesn't exist
        navContainer = document.createElement('div');
        navContainer.id = 'navigation-placeholder';
        document.body.insertBefore(navContainer, document.body.firstChild);
      }

      // Inject the navigation HTML
      navContainer.innerHTML = navHTML;

      // Fix relative links for pages in subfolders
      if (isInSubfolder) {
        fixNavigationLinks(navContainer);
      }

      // Initialize navigation functionality after injection
      initializeNavigationFunctionality();

    } catch (error) {
      console.error('Error loading navigation:', error);
      // Fail silently in production, but log for debugging
    }
  }

  // Fix navigation links for pages in subfolders (e.g., /de/)
  function fixNavigationLinks(container) {
    const links = container.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');

      // Skip external links and anchor links
      if (href.startsWith('http') || href.startsWith('#')) {
        return;
      }

      // Add ../ prefix for relative links
      if (!href.startsWith('../') && !href.startsWith('/')) {
        link.setAttribute('href', '../' + href);
      }
    });

    // Fix home link
    const homeLink = container.querySelector('[data-nav-home]');
    if (homeLink) {
      homeLink.setAttribute('href', '../index.html#heroSection');
    }
  }

  // Initialize navigation functionality (dropdowns, mobile menu, etc.)
  function initializeNavigationFunctionality() {
    // Mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
        const isExpanded = !mobileNav.classList.contains('hidden');
        menuBtn.setAttribute('aria-expanded', isExpanded);
      });
    }

    // All dropdown toggle
    const allDropdownBtn = document.getElementById('allDropdownBtn');
    const allDropdownMenu = document.getElementById('allDropdownMenu');
    const allDropdownIcon = document.getElementById('allDropdownIcon');

    if (allDropdownBtn && allDropdownMenu) {
      allDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        allDropdownMenu.classList.toggle('hidden');
        const isExpanded = !allDropdownMenu.classList.contains('hidden');
        allDropdownBtn.setAttribute('aria-expanded', isExpanded);

        if (allDropdownIcon) {
          allDropdownIcon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    }

    // Language menu toggle
    const languageBtn = document.getElementById('languageBtn');
    const languageMenu = document.getElementById('languageMenu');

    if (languageBtn && languageMenu) {
      languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageMenu.classList.toggle('hidden');
        const isExpanded = !languageMenu.classList.contains('hidden');
        languageBtn.setAttribute('aria-expanded', isExpanded);
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      // Close All dropdown
      if (allDropdownMenu && !allDropdownMenu.classList.contains('hidden')) {
        if (!e.target.closest('#allDropdownBtn') && !e.target.closest('#allDropdownMenu')) {
          allDropdownMenu.classList.add('hidden');
          if (allDropdownBtn) allDropdownBtn.setAttribute('aria-expanded', 'false');
          if (allDropdownIcon) allDropdownIcon.style.transform = 'rotate(0deg)';
        }
      }

      // Close language menu
      if (languageMenu && !languageMenu.classList.contains('hidden')) {
        if (!e.target.closest('#languageBtn') && !e.target.closest('#languageMenu')) {
          languageMenu.classList.add('hidden');
          if (languageBtn) languageBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Language selection handling
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      option.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        if (lang && typeof setLanguage === 'function') {
          setLanguage(lang);
        }
        if (languageMenu) {
          languageMenu.classList.add('hidden');
        }
      });
    });

    // Contact modal button handling
    const contactButtons = document.querySelectorAll('[data-contact-btn]');
    contactButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        // Wait for common.js to load if needed
        if (typeof openContactModal === 'function') {
          openContactModal();
        } else {
          // Fallback: wait a bit and try again
          setTimeout(() => {
            if (typeof openContactModal === 'function') {
              openContactModal();
            }
          }, 100);
        }
      });
    });
  }

  // Load navigation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavigation);
  } else {
    // DOM already loaded
    loadNavigation();
  }
})();
