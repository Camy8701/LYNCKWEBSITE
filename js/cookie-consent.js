/**
 * LYNCK Studio - Cookie Consent Manager
 * GDPR Compliant Cookie Consent Solution
 */

(function() {
  'use strict';

  // Configuration
  const COOKIE_NAME = 'lynck_cookie_consent';
  const COOKIE_EXPIRY_DAYS = 365;

  // Cookie Consent Manager
  const CookieConsent = {
    init: function() {
      this.loadConsentState();
      this.attachEventListeners();
      this.checkAndShowBanner();
    },

    /**
     * Check if user has already given consent
     */
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

    /**
     * Show cookie consent banner
     */
    showBanner: function() {
      const banner = document.getElementById('cookieConsent');
      if (banner) {
        banner.classList.remove('hidden');
        setTimeout(() => {
          banner.classList.add('visible');
        }, 10);
      }
    },

    /**
     * Hide cookie consent banner
     */
    hideBanner: function() {
      const banner = document.getElementById('cookieConsent');
      if (banner) {
        banner.classList.remove('visible');
        setTimeout(() => {
          banner.classList.add('hidden');
        }, 300);
      }
    },

    /**
     * Attach event listeners
     */
    attachEventListeners: function() {
      const acceptAllBtn = document.getElementById('acceptAll');
      const acceptSelectedBtn = document.getElementById('acceptSelected');
      const rejectAllBtn = document.getElementById('rejectAll');
      const settingsBtn = document.getElementById('cookieSettingsBtn');

      if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', () => this.acceptAll());
      }

      if (acceptSelectedBtn) {
        acceptSelectedBtn.addEventListener('click', () => this.acceptSelected());
      }

      if (rejectAllBtn) {
        rejectAllBtn.addEventListener('click', () => this.rejectAll());
      }

      if (settingsBtn) {
        settingsBtn.addEventListener('click', () => this.showBanner());
      }
    },

    /**
     * Accept all cookies
     */
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

    /**
     * Accept selected cookies
     */
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

    /**
     * Reject all non-essential cookies
     */
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

    /**
     * Save consent to localStorage and cookie
     */
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

    /**
     * Get current consent state
     */
    getConsent: function() {
      try {
        const stored = localStorage.getItem(COOKIE_NAME);
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        console.error('Failed to get cookie consent:', e);
        return null;
      }
    },

    /**
     * Load consent state and update checkboxes
     */
    loadConsentState: function() {
      const consent = this.getConsent();
      if (consent) {
        const analyticsCheckbox = document.getElementById('analyticsConsent');
        const marketingCheckbox = document.getElementById('marketingConsent');

        if (analyticsCheckbox) analyticsCheckbox.checked = consent.analytics;
        if (marketingCheckbox) marketingCheckbox.checked = consent.marketing;
      }
    },

    /**
     * Apply consent (load analytics/marketing scripts)
     */
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

    /**
     * Load Google Analytics
     */
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

    /**
     * Load marketing scripts (Facebook Pixel, etc.)
     */
    loadMarketingScripts: function() {
      // Add your marketing scripts here
      // Example: Facebook Pixel, LinkedIn Insight Tag, etc.
      console.log('✅ Marketing scripts would be loaded here');
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CookieConsent.init());
  } else {
    CookieConsent.init();
  }

  // Expose to window for external access
  window.CookieConsent = CookieConsent;

})();
