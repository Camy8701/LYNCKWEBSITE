/**
 * LYNCK Studio - Cookie Consent Loader
 * Loads the cookie consent component into the page
 */

(function() {
  'use strict';

  // Load cookie consent HTML
  function loadCookieConsent() {
    fetch('/components/cookie-consent.html')
      .then(response => response.text())
      .then(html => {
        // Create a container div
        const container = document.createElement('div');
        container.innerHTML = html;

        // Append to body
        document.body.appendChild(container);

        // Load cookie consent script
        const script = document.createElement('script');
        script.src = '/js/cookie-consent.js';
        script.defer = true;
        document.body.appendChild(script);
      })
      .catch(error => {
        console.error('Failed to load cookie consent:', error);
      });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCookieConsent);
  } else {
    loadCookieConsent();
  }
})();
