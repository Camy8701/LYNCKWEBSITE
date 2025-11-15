/**
 * LYNCK Studio - Cookie Consent Loader
 * Embeds cookie consent component directly into the page
 */

(function() {
  'use strict';

  // Cookie consent HTML (embedded directly)
  const cookieConsentHTML = `
<!-- Cookie Consent Banner -->
<div id="cookieConsent" class="cookie-consent hidden">
  <div class="cookie-consent-overlay"></div>
  <div class="cookie-consent-modal">
    <div class="cookie-consent-content">
      <!-- Header -->
      <div class="cookie-consent-header">
        <h3 class="cookie-consent-title">🍪 We Value Your Privacy</h3>
        <p class="cookie-consent-description">
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
          By clicking "Accept All", you consent to our use of cookies.
        </p>
      </div>

      <!-- Cookie Categories -->
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

      <!-- Actions -->
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

      <!-- Footer Links -->
      <div class="cookie-consent-footer">
        <a href="#" class="cookie-link">Privacy Policy</a>
        <span class="cookie-separator">•</span>
        <a href="#" class="cookie-link">Cookie Policy</a>
      </div>
    </div>
  </div>
</div>
`;

  // Load cookie consent HTML
  function loadCookieConsent() {
    // Insert HTML directly into body
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cookieConsentHTML.trim();

    // Append the actual cookie consent element (not the wrapper)
    while (tempDiv.firstChild) {
      document.body.appendChild(tempDiv.firstChild);
    }

    // Initialize cookie consent logic immediately
    initCookieConsent();
  }

  /**
   * Cookie Consent Logic
   */
  function initCookieConsent() {
    const COOKIE_NAME = 'lynck_cookie_consent';
    const COOKIE_EXPIRY_DAYS = 365;

    const CookieConsent = {
      init: function() {
        this.loadConsentState();
        this.attachEventListeners();
        this.checkAndShowBanner();
      },

      checkAndShowBanner: function() {
        const consent = this.getConsent();
        if (!consent) {
          // First time visitor - show banner after 1 second
          setTimeout(() => {
            this.showBanner();
          }, 1000);
        } else {
          // User has already consented - apply their preferences
          this.applyConsent(consent);
        }
      },

      showBanner: function() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
          banner.classList.remove('hidden');
          setTimeout(() => {
            banner.classList.add('visible');
          }, 10);
        }
      },

      hideBanner: function() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
          banner.classList.remove('visible');
          setTimeout(() => {
            banner.classList.add('hidden');
          }, 300);
        }
      },

      attachEventListeners: function() {
        const acceptAllBtn = document.getElementById('acceptAll');
        const acceptSelectedBtn = document.getElementById('acceptSelected');
        const rejectAllBtn = document.getElementById('rejectAll');

        if (acceptAllBtn) {
          acceptAllBtn.addEventListener('click', () => this.acceptAll());
        }

        if (acceptSelectedBtn) {
          acceptSelectedBtn.addEventListener('click', () => this.acceptSelected());
        }

        if (rejectAllBtn) {
          rejectAllBtn.addEventListener('click', () => this.rejectAll());
        }
      },

      acceptAll: function() {
        const consent = {
          essential: true,
          analytics: true,
          marketing: true,
          timestamp: new Date().toISOString()
        };
        this.saveConsent(consent);
        this.applyConsent(consent);
        this.hideBanner();
      },

      acceptSelected: function() {
        const analyticsCheckbox = document.getElementById('analyticsConsent');
        const marketingCheckbox = document.getElementById('marketingConsent');

        const consent = {
          essential: true,
          analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
          marketing: marketingCheckbox ? marketingCheckbox.checked : false,
          timestamp: new Date().toISOString()
        };
        this.saveConsent(consent);
        this.applyConsent(consent);
        this.hideBanner();
      },

      rejectAll: function() {
        const consent = {
          essential: true,
          analytics: false,
          marketing: false,
          timestamp: new Date().toISOString()
        };
        this.saveConsent(consent);
        this.applyConsent(consent);
        this.hideBanner();
      },

      saveConsent: function(consent) {
        try {
          // Save to localStorage
          localStorage.setItem(COOKIE_NAME, JSON.stringify(consent));

          // Save to cookie for server-side access
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
          document.cookie = `${COOKIE_NAME}=${JSON.stringify(consent)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;

          console.log('✅ Cookie consent saved:', consent);
        } catch (e) {
          console.error('Failed to save cookie consent:', e);
        }
      },

      getConsent: function() {
        try {
          const stored = localStorage.getItem(COOKIE_NAME);
          return stored ? JSON.parse(stored) : null;
        } catch (e) {
          console.error('Failed to get cookie consent:', e);
          return null;
        }
      },

      loadConsentState: function() {
        const consent = this.getConsent();
        if (consent) {
          const analyticsCheckbox = document.getElementById('analyticsConsent');
          const marketingCheckbox = document.getElementById('marketingConsent');

          if (analyticsCheckbox) analyticsCheckbox.checked = consent.analytics;
          if (marketingCheckbox) marketingCheckbox.checked = consent.marketing;
        }
      },

      applyConsent: function(consent) {
        // Load Google Analytics if consent given
        if (consent.analytics) {
          this.loadGoogleAnalytics();
        }

        // Load marketing scripts if consent given
        if (consent.marketing) {
          this.loadMarketingScripts();
        }

        // Dispatch event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
          detail: consent
        }));
      },

      loadGoogleAnalytics: function() {
        // Replace with your GA4 Measurement ID
        const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with actual ID

        // Only load if not already loaded
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
      },

      loadMarketingScripts: function() {
        // Add your marketing scripts here
        console.log('✅ Marketing scripts would be loaded here');
      }
    };

    // Initialize
    CookieConsent.init();

    // Expose to window for external access
    window.CookieConsent = CookieConsent;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCookieConsent);
  } else {
    loadCookieConsent();
  }
})();
