/**
 * LYNCK Studio - Cookie Consent
 * GDPR-compliant cookie consent banner
 */

(function() {
  'use strict';

  const COOKIE_NAME = 'lynck_cookie_consent';
  const COOKIE_EXPIRY_DAYS = 365;

  // Cookie consent HTML
  const cookieConsentHTML = `
<div id="cookieConsent" class="cookie-consent hidden">
  <div class="cookie-consent-overlay"></div>
  <div class="cookie-consent-modal">
    <div class="cookie-consent-content">
      <div class="cookie-consent-header">
        <h3 class="cookie-consent-title">🍪 We Value Your Privacy</h3>
        <p class="cookie-consent-description">
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
          By clicking "Accept All", you consent to our use of cookies.
        </p>
      </div>

      <div class="cookie-consent-options">
        <div class="cookie-option">
          <div class="cookie-option-header">
            <label class="cookie-checkbox-label">
              <input type="checkbox" checked disabled class="cookie-checkbox">
              <span class="cookie-option-title">Essential Cookies</span>
            </label>
            <span class="cookie-badge required">Required</span>
          </div>
          <p class="cookie-option-description">
            These cookies are necessary for the website to function and cannot be switched off.
          </p>
        </div>

        <div class="cookie-option">
          <div class="cookie-option-header">
            <label class="cookie-checkbox-label">
              <input type="checkbox" id="analyticsConsent" class="cookie-checkbox">
              <span class="cookie-option-title">Analytics Cookies</span>
            </label>
          </div>
          <p class="cookie-option-description">
            Help us understand how visitors interact with our website by collecting and reporting information anonymously.
          </p>
        </div>

        <div class="cookie-option">
          <div class="cookie-option-header">
            <label class="cookie-checkbox-label">
              <input type="checkbox" id="marketingConsent" class="cookie-checkbox">
              <span class="cookie-option-title">Marketing Cookies</span>
            </label>
          </div>
          <p class="cookie-option-description">
            Used to track visitors across websites to display relevant advertisements.
          </p>
        </div>
      </div>

      <div class="cookie-consent-actions">
        <button id="acceptAll" class="cookie-btn cookie-btn-primary">
          Accept All
        </button>
        <button id="acceptSelected" class="cookie-btn cookie-btn-secondary">
          Accept Selected
        </button>
        <button id="rejectAll" class="cookie-btn cookie-btn-text">
          Reject All
        </button>
      </div>

      <div class="cookie-consent-footer">
        <a href="#" class="cookie-link">Privacy Policy</a>
        <span class="cookie-separator">•</span>
        <a href="#" class="cookie-link">Cookie Policy</a>
      </div>
    </div>
  </div>
</div>
`;

  // Initialize cookie consent
  function init() {
    try {
      // Insert HTML into page
      const container = document.createElement('div');
      container.innerHTML = cookieConsentHTML.trim();

      while (container.firstChild) {
        document.body.appendChild(container.firstChild);
      }

      // Wait a tick for DOM to settle
      setTimeout(() => {
        setupCookieConsent();
      }, 100);
    } catch (error) {
      console.error('Failed to initialize cookie consent:', error);
    }
  }

  // Setup cookie consent functionality
  function setupCookieConsent() {
    const banner = document.getElementById('cookieConsent');

    if (!banner) {
      console.error('Cookie consent banner not found');
      return;
    }

    // Attach event listeners
    const acceptAllBtn = document.getElementById('acceptAll');
    const acceptSelectedBtn = document.getElementById('acceptSelected');
    const rejectAllBtn = document.getElementById('rejectAll');

    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleAcceptAll();
      });
    }

    if (acceptSelectedBtn) {
      acceptSelectedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleAcceptSelected();
      });
    }

    if (rejectAllBtn) {
      rejectAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleRejectAll();
      });
    }

    // Check if consent already given
    const existingConsent = getConsent();

    if (existingConsent) {
      // User already made a choice - keep banner hidden
      console.log('Existing consent found:', existingConsent);
      applyConsent(existingConsent);
    } else {
      // First time visitor - show banner after 1 second
      setTimeout(() => {
        showBanner();
      }, 1000);
    }
  }

  // Show banner
  function showBanner() {
    const banner = document.getElementById('cookieConsent');
    if (banner) {
      banner.classList.remove('hidden');
      // Force reflow
      void banner.offsetWidth;
      banner.classList.add('visible');
      console.log('Cookie banner shown');
    }
  }

  // Hide banner
  function hideBanner() {
    const banner = document.getElementById('cookieConsent');
    if (banner) {
      banner.classList.remove('visible');
      banner.classList.add('hidden');
      console.log('Cookie banner hidden');
    }
  }

  // Handle Accept All
  function handleAcceptAll() {
    console.log('Accept All clicked');
    const consent = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    saveConsent(consent);
    applyConsent(consent);
    hideBanner();
  }

  // Handle Accept Selected
  function handleAcceptSelected() {
    console.log('Accept Selected clicked');
    const analyticsCheckbox = document.getElementById('analyticsConsent');
    const marketingCheckbox = document.getElementById('marketingConsent');

    const consent = {
      essential: true,
      analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
      marketing: marketingCheckbox ? marketingCheckbox.checked : false,
      timestamp: new Date().toISOString()
    };
    saveConsent(consent);
    applyConsent(consent);
    hideBanner();
  }

  // Handle Reject All
  function handleRejectAll() {
    console.log('Reject All clicked');
    const consent = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    saveConsent(consent);
    applyConsent(consent);
    hideBanner();
  }

  // Save consent
  function saveConsent(consent) {
    try {
      // Save to localStorage
      localStorage.setItem(COOKIE_NAME, JSON.stringify(consent));

      // Save to cookie
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
      document.cookie = `${COOKIE_NAME}=${JSON.stringify(consent)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;

      console.log('✅ Cookie consent saved:', consent);
    } catch (error) {
      console.error('Failed to save cookie consent:', error);
    }
  }

  // Get consent
  function getConsent() {
    try {
      const stored = localStorage.getItem(COOKIE_NAME);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get cookie consent:', error);
      return null;
    }
  }

  // Apply consent (load scripts if approved)
  function applyConsent(consent) {
    if (consent.analytics) {
      loadGoogleAnalytics();
    }
    if (consent.marketing) {
      loadMarketingScripts();
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
      detail: consent
    }));
  }

  // Load Google Analytics
  function loadGoogleAnalytics() {
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual ID

    if (!window.gtag && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=None;Secure'
      });

      console.log('✅ Google Analytics loaded');
    }
  }

  // Load marketing scripts
  function loadMarketingScripts() {
    console.log('✅ Marketing scripts would load here');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.CookieConsent = {
    show: showBanner,
    hide: hideBanner,
    getConsent: getConsent,
    reset: function() {
      localStorage.removeItem(COOKIE_NAME);
      document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      console.log('Cookie consent reset');
    }
  };

})();
