// Navigation Loader - Dynamically loads and injects navigation component
// Ensures language-aware routing across the site

(function () {
  'use strict';

  const STORAGE_KEY = 'language';
  const SUPPORTED_LANGS = ['en', 'de'];

  const ROUTE_MAP = {
    index: {
      en: '',
      de: 'de/index.html'
    },
    'google-ads': {
      en: 'google-ads.html',
      de: 'de/google-ads.html'
    },
    'custom-website': {
      en: 'custom-website.html',
      de: 'de/custom-website.html'
    },
    'digital-products': {
      en: 'digital-products.html',
      de: 'de/digital-products.html'
    },
    'leads-supply': {
      en: 'leads-supply.html',
      de: 'de/leads-supply.html'
    },
    'learning-platform': {
      en: 'learning-platform.html',
      de: 'de/learning-platform.html'
    },
    'coming-soon': {
      en: 'coming-soon.html',
      de: 'de/coming-soon.html'
    },
    pricing: {
      en: 'pricing.html',
      de: 'de/pricing.html'
    },
    'why-choose-us': {
      en: 'why-choose-us.html',
      de: 'de/why-choose-us.html'
    }
  };

  const NAV_COPY = {
    en: {
      'All': 'All',
      'Google Ads': 'Google Ads',
      'Custom Website': 'Custom Website',
      'Digital Products': 'Digital Products',
      'Leads Supply': 'Leads Supply',
      'Learning Platform': 'Learning Platform',
      'Pricing': 'Pricing',
      'About LYNCK': 'About LYNCK',
      'Our Services': 'Our Services',
      'Testimonials': 'Testimonials',
      "Let's connect": "Let's connect",
      'All Services': 'All Services',
      'Language': 'Language'
    },
    de: {
      'All': 'Alle',
      'Google Ads': 'Google Ads',
      'Custom Website': 'Anpassbare Website',
      'Digital Products': 'Digitale Produkte',
      'Leads Supply': 'Lead Bereitstellung',
      'Learning Platform': 'Lernplattform',
      'Pricing': 'Preise',
      'About LYNCK': 'Über LYNCK',
      'Our Services': 'Unsere Dienstleistungen',
      'Testimonials': 'Referenzen',
      "Let's connect": 'Jetzt kontaktieren',
      'All Services': 'Alle Leistungen',
      'Language': 'Sprache'
    }
  };

const NAVIGATION_TEMPLATE = /* html */ `
<header class="fixed top-0 left-0 right-0 z-40 opacity-0 animate-fade-in my-4 backdrop-blur-3xl delay-200">
  <div class="mx-4 lg:mx-8">
    <div class="relative ring-1 ring-white/10 bg-white/10 border-white/20 border rounded-2xl shadow-lg backdrop-blur-lg">
      <div class="flex h-20 items-center justify-between px-3 sm:px-6 max-w-7xl mx-auto">
<div class="flex items-center gap-2 sm:gap-4">
  <div class="hidden sm:flex items-center gap-3">
    <a href="https://www.linkedin.com/in/lynck-studio-9476a6392/" target="_blank" rel="noopener noreferrer" class="group" aria-label="LinkedIn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 hover:text-white transition-all duration-300 group-hover:scale-110">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    </a>
    <a href="https://www.instagram.com/lynck_studio/" target="_blank" rel="noopener noreferrer" class="group" aria-label="Instagram">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 hover:text-white transition-all duration-300 group-hover:scale-110">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    </a>
  </div>
  <div class="hidden sm:block h-6 w-px bg-white/20"></div>
  <a href="index.html#heroSection" class="group" data-nav-home data-route="index" data-anchor="#heroSection">
    <div class="flex items-center">
      <img src="/logo-home.png" alt="LYNCK Studio" width="32" height="32" class="transition-all duration-300 group-hover:scale-105 cursor-pointer">
    </div>
  </a>
  <div class="relative hidden sm:block">
    <button id="allDropdownBtn" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-md text-sm font-medium font-geist" aria-label="Services navigation menu" aria-expanded="false" aria-haspopup="true">
      <span data-translate="All">All</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200" id="allDropdownIcon">
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    </button>
    <div id="allDropdownMenu" class="hidden absolute top-full left-0 mt-2 w-56 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl ring-1 ring-white/10" style="z-index: 9999;">
      <div class="px-2 py-2 space-y-1" data-nav-dropdown>
        <a href="google-ads.html" data-route="google-ads" class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Google Ads">Google Ads</a>
        <a href="custom-website.html" data-route="custom-website" class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Custom Website">Custom Website</a>
        <a href="digital-products.html" data-route="digital-products" class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Digital Products">Digital Products</a>
        <a href="leads-supply.html" data-route="leads-supply" class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Leads Supply">Leads Supply</a>
        <a href="coming-soon.html" data-route="coming-soon" class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Learning Platform">Learning Platform</a>
        <a href="pricing.html" data-route="pricing" class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Pricing">Pricing</a>
      </div>
    </div>
  </div>
</div>

<nav class="hidden md:flex items-center gap-6" data-nav-links>
  <a href="why-choose-us.html#about-lynck" class="shiny-cta-white" data-translate="About LYNCK" data-route="why-choose-us" data-anchor="#about-lynck"><span data-translate="About LYNCK">About LYNCK</span></a>
  <a href="index.html#work" class="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 font-geist whitespace-nowrap" data-translate="Our Services" data-route="index" data-anchor="#work">Our Services</a>
  <a href="index.html#testimonials" class="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 font-geist" data-translate="Testimonials" data-route="index" data-anchor="#testimonials">Testimonials</a>
  <a href="coming-soon.html" class="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 font-geist" data-translate="Learning Platform" data-route="coming-soon">Learning Platform</a>
  <a href="pricing.html" class="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 font-geist mr-4" data-translate="Pricing" data-route="pricing">Pricing</a>
</nav>

<div class="relative">
  <button id="languageBtn" class="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-md" aria-label="Language selector" aria-expanded="false" aria-haspopup="true">
    <span id="currentLang" class="text-sm font-medium">EN</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M6 9l6 6 6-6"></path></svg>
  </button>
  <div id="languageMenu" class="hidden absolute top-full right-0 mt-2 w-32 bg-black/90 border border-white/20 rounded-lg shadow-xl backdrop-blur-xl z-50">
    <button class="lang-option w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2" data-lang="en">
      <span class="text-base">🇺🇸</span> English
    </button>
    <button class="lang-option w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 rounded-b-lg" data-lang="de">
      <span class="text-base">🇩🇪</span> Deutsch
    </button>
  </div>
</div>

<button data-contact-btn class="hidden md:inline-flex items-center gap-2 shiny-cta font-geist ml-2">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
  <span data-translate="Let's connect" style="white-space: nowrap;">Let's connect</span>
</button>

<button id="menuBtn" class="md:hidden rounded-xl bg-white/15 border border-white/30 p-2.5 text-white hover:bg-white/20 backdrop-blur-md" aria-label="Open mobile menu" aria-expanded="false">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M4 12h16"></path><path d="M4 18h16"></path><path d="M4 6h16"></path></svg>
</button>
</div>

<div id="mobileNav" class="hidden md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/20 rounded-b-2xl shadow-lg ring-1 ring-white/10">
<div class="px-6 py-6 space-y-3" data-nav-mobile>
  <div class="space-y-2">
    <a href="why-choose-us.html#about-lynck" data-route="why-choose-us" data-anchor="#about-lynck" class="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="About LYNCK">About LYNCK</a>
    <a href="index.html#work" data-route="index" data-anchor="#work" class="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Our Services">Our Services</a>
    <a href="index.html#testimonials" data-route="index" data-anchor="#testimonials" class="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Testimonials">Testimonials</a>
    <a href="pricing.html" data-route="pricing" class="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Pricing">Pricing</a>
  </div>

  <div class="pt-3 border-t border-white/20">
    <p class="px-4 py-2 text-xs uppercase tracking-wider text-gray-400 font-geist font-semibold" data-translate="All Services">All Services</p>
    <div class="space-y-1">
      <a href="google-ads.html" data-route="google-ads" class="block rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Google Ads">Google Ads</a>
      <a href="custom-website.html" data-route="custom-website" class="block rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Custom Website">Custom Website</a>
      <a href="digital-products.html" data-route="digital-products" class="block rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Digital Products">Digital Products</a>
      <a href="leads-supply.html" data-route="leads-supply" class="block rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Leads Supply">Leads Supply</a>
      <a href="coming-soon.html" data-route="coming-soon" class="block rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-geist" data-translate="Learning Platform">Learning Platform</a>
    </div>
  </div>

  <div class="pt-3 border-t border-white/20">
    <p class="px-4 py-2 text-xs uppercase tracking-wider text-gray-400 font-geist font-semibold" data-translate="Language">Language</p>
    <div class="flex gap-2 px-4">
      <button class="lang-option flex-1 px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/10" data-lang="en">
        <span class="text-base">🇺🇸</span> English
      </button>
      <button class="lang-option flex-1 px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/10" data-lang="de">
        <span class="text-base">🇩🇪</span> Deutsch
      </button>
    </div>
  </div>

  <div class="pt-3 border-t border-white/20">
    <div class="flex items-center justify-center gap-6 px-4 py-2">
      <a href="https://www.linkedin.com/in/lynck-studio-9476a6392/" target="_blank" rel="noopener noreferrer" class="group" aria-label="LinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 hover:text-white transition-all duration-300 group-hover:scale-110">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      </a>
      <a href="https://www.instagram.com/lynck_studio/" target="_blank" rel="noopener noreferrer" class="group" aria-label="Instagram">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 hover:text-white transition-all duration-300 group-hover:scale-110">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </a>
    </div>
  </div>

  <div class="pt-4">
    <button data-contact-btn class="flex items-center justify-center gap-2 shiny-cta font-geist w-full">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
      <span data-translate="Let's connect">Let's connect</span>
    </button>
  </div>
      </div>
    </div>
  </div>
</header>
`;

  function applyNavTranslations(navContainer, lang) {
    const copy = NAV_COPY[lang];
    if (!copy || !navContainer) {
      return;
    }

    const nodes = navContainer.querySelectorAll('[data-translate]');
    nodes.forEach(node => {
      const key = node.getAttribute('data-translate');
      if (key && copy[key]) {
        node.textContent = copy[key];
      }
    });
  }

  function normalizeLang(lang) {
    if (typeof lang !== 'string') return 'en';
    const normalized = lang.toLowerCase();
    return SUPPORTED_LANGS.includes(normalized) ? normalized : 'en';
  }

  function getPathSegments(pathname) {
    if (typeof pathname !== 'string') return [];
    return pathname.split('/').filter(Boolean);
  }

  function splitWithoutLocale(segments) {
    if (!segments.length) {
      return { baseSegments: [], pageSegments: [] };
    }

    const last = segments[segments.length - 1];
    if (last && last.includes('.')) {
      return {
        baseSegments: segments.slice(0, -1),
        pageSegments: segments.slice(-1)
      };
    }

    return { baseSegments: segments, pageSegments: [] };
  }

  function deriveSlug(pageSegments) {
    if (!pageSegments.length) {
      return 'index';
    }
    const last = pageSegments[pageSegments.length - 1];
    if (!last || last === '' || /index\.html?$/i.test(last)) {
      return 'index';
    }
    if (last.includes('.')) {
      return last.replace(/\.html?$/i, '') || 'index';
    }
    return last;
  }

  function getPathInfo(pathname) {
    const segments = getPathSegments(pathname);
    const localeIndex = segments.findIndex(seg => SUPPORTED_LANGS.includes(seg.toLowerCase()));

    let baseSegments = [];
    let pageSegments = [];
    let locale = null;

    if (localeIndex !== -1) {
      locale = segments[localeIndex].toLowerCase();
      baseSegments = segments.slice(0, localeIndex);
      pageSegments = segments.slice(localeIndex + 1);
    } else {
      const split = splitWithoutLocale(segments);
      baseSegments = split.baseSegments;
      pageSegments = split.pageSegments;
    }

    const slug = deriveSlug(pageSegments);
    const basePath = baseSegments.length ? `/${baseSegments.join('/')}` : '';

    return {
      basePath,
      locale,
      pageSegments,
      slug
    };
  }

  function joinPath(basePath, target) {
    const normalizedBase = basePath ? basePath.replace(/\/+$/, '') : '';
    const normalizedTarget = target ? String(target).replace(/^\/+/, '') : '';

    if (!normalizedTarget) {
      return normalizedBase ? `${normalizedBase}/` : '/';
    }

    if (!normalizedBase) {
      return `/${normalizedTarget}`;
    }

    return `${normalizedBase}/${normalizedTarget}`;
  }

  function buildRelativeFallback(info, lang) {
    const targetLang = normalizeLang(lang);
    const lastSegment = info.pageSegments.length ? info.pageSegments[info.pageSegments.length - 1] : '';
    const fileName = lastSegment && lastSegment.includes('.') ? lastSegment : (info.slug === 'index' ? 'index.html' : `${info.slug}.html`);

    if (targetLang === 'en') {
      if (info.slug === 'index') {
        return '';
      }
      return fileName;
    }

    if (info.slug === 'index') {
      return `${targetLang}/`;
    }

    return `${targetLang}/${fileName}`;
  }

  function normalizePathForCompare(path) {
    if (typeof path !== 'string' || path === '') {
      return '/';
    }
    return path === '/' ? '/' : path.replace(/\/+$/, '');
  }

  function detectLanguageFromPath() {
    const info = getPathInfo(window.location.pathname);
    return info.locale && SUPPORTED_LANGS.includes(info.locale) ? info.locale : 'en';
  }

  function getStoredLanguage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED_LANGS.includes(stored)) {
        return stored;
      }
    } catch (err) {
      console.warn('Unable to access localStorage for language preference:', err);
    }
    return null;
  }

  function setStoredLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      console.warn('Unable to persist language preference:', err);
    }
  }

  function resolveLocalizedPath(lang) {
    const info = getPathInfo(window.location.pathname);
    const normalizedLang = normalizeLang(lang);
    const route = ROUTE_MAP[info.slug];

    let relativeTarget = null;

    if (route) {
      relativeTarget = route[normalizedLang] || route.en;
    }

    if (!relativeTarget) {
      relativeTarget = buildRelativeFallback(info, normalizedLang);
    }

    // Always build path from root, not from current location
    // This prevents /de/de/ double prefix issues
    return '/' + (relativeTarget || '').replace(/^\/+/, '');
  }

  function applyLocalizedLinks(container, lang) {
    const normalizedLang = normalizeLang(lang);
    const links = container.querySelectorAll('[data-route]');

    links.forEach(link => {
      const routeKey = link.getAttribute('data-route');
      const anchor = link.getAttribute('data-anchor') || '';
      const route = ROUTE_MAP[routeKey];

      if (!route) {
        return;
      }

      const relativeTarget = route[normalizedLang] || route.en;
      if (!relativeTarget || typeof relativeTarget !== 'string') {
        return;
      }

      // Always use absolute paths from root to avoid double /de/ prefixes
      const href = '/' + relativeTarget.replace(/^\/+/, '');
      link.setAttribute('href', `${href}${anchor}`);
    });
  }

  function updateLanguageIndicator(lang) {
    const langMap = { en: 'EN', de: 'DE' };
    const langButton = document.getElementById('currentLang');
    if (langButton) {
      langButton.textContent = langMap[lang] || 'EN';
    }
  }

  function highlightSelectedLanguage(lang) {
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      const isActive = option.getAttribute('data-lang') === lang;
      option.classList.toggle('bg-white/10', isActive);
      option.setAttribute('aria-pressed', String(isActive));
      if (isActive) {
        option.classList.add('text-white');
        option.classList.remove('text-gray-300');
      } else {
        option.classList.remove('text-white');
        option.classList.add('text-gray-300');
      }
    });
  }

  function redirectToLanguage(lang) {
    const target = resolveLocalizedPath(lang);
    if (!target) {
      return;
    }

    const normalizedTarget = normalizePathForCompare(target);
    const normalizedCurrent = normalizePathForCompare(window.location.pathname);

    if (normalizedTarget !== normalizedCurrent) {
      const hash = window.location.hash || '';
      window.location.href = `${target}${hash}`;
    } else if (window.location.hash) {
      window.location.href = `${target}${window.location.hash}`;
    }
  }

  async function loadNavigation() {
    try {
      const currentPath = window.location.pathname;
      const pathLang = detectLanguageFromPath();
      const storedLangRaw = getStoredLanguage();
      const storedLang = storedLangRaw ? normalizeLang(storedLangRaw) : null;

      if (storedLang && storedLang !== pathLang) {
        setStoredLanguage(pathLang);
      }

      let navContainer = document.getElementById('navigation-placeholder');
      if (!navContainer) {
        navContainer = document.createElement('div');
        navContainer.id = 'navigation-placeholder';
        document.body.insertBefore(navContainer, document.body.firstChild);
      }

      navContainer.innerHTML = NAVIGATION_TEMPLATE;

      const activeLang = pathLang;
      applyNavTranslations(navContainer, activeLang);
      setStoredLanguage(activeLang);

      if (typeof window.updateCurrentLanguage === 'function') {
        window.updateCurrentLanguage(activeLang);
      }

      applyLocalizedLinks(navContainer, activeLang);
      updateLanguageIndicator(activeLang);
      highlightSelectedLanguage(activeLang);
      initializeNavigationFunctionality(navContainer, activeLang);

      if (typeof translatePage === 'function') {
        translatePage();
      }

    } catch (error) {
      console.error('Error loading navigation:', error);
    }
  }

  function initializeNavigationFunctionality(navContainer, activeLang) {
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
        const isExpanded = !mobileNav.classList.contains('hidden');
        menuBtn.setAttribute('aria-expanded', String(isExpanded));
      });
    }

    const allDropdownBtn = document.getElementById('allDropdownBtn');
    const allDropdownMenu = document.getElementById('allDropdownMenu');
    const allDropdownIcon = document.getElementById('allDropdownIcon');

    if (allDropdownBtn && allDropdownMenu) {
      allDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        allDropdownMenu.classList.toggle('hidden');
        const isExpanded = !allDropdownMenu.classList.contains('hidden');
        allDropdownBtn.setAttribute('aria-expanded', String(isExpanded));

        if (allDropdownIcon) {
          allDropdownIcon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    }

    const languageBtn = document.getElementById('languageBtn');
    const languageMenu = document.getElementById('languageMenu');

    if (languageBtn && languageMenu) {
      languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageMenu.classList.toggle('hidden');
        const isExpanded = !languageMenu.classList.contains('hidden');
        languageBtn.setAttribute('aria-expanded', String(isExpanded));
      });
    }

    document.addEventListener('click', (e) => {
      if (allDropdownMenu && !allDropdownMenu.classList.contains('hidden')) {
        if (!e.target.closest('#allDropdownBtn') && !e.target.closest('#allDropdownMenu')) {
          allDropdownMenu.classList.add('hidden');
          if (allDropdownBtn) allDropdownBtn.setAttribute('aria-expanded', 'false');
          if (allDropdownIcon) allDropdownIcon.style.transform = 'rotate(0deg)';
        }
      }

      if (languageMenu && !languageMenu.classList.contains('hidden')) {
        if (!e.target.closest('#languageBtn') && !e.target.closest('#languageMenu')) {
          languageMenu.classList.add('hidden');
          if (languageBtn) languageBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      option.addEventListener('click', (event) => {
        event.preventDefault();
        const lang = option.getAttribute('data-lang');
        if (!SUPPORTED_LANGS.includes(lang)) {
          return;
        }

        updateLanguageIndicator(lang);
        highlightSelectedLanguage(lang);

        if (typeof setLanguage === 'function') {
          setLanguage(lang);
        } else {
          setStoredLanguage(lang);
          redirectToLanguage(lang);
        }

        if (languageMenu) {
          languageMenu.classList.add('hidden');
        }
      });
    });

    highlightSelectedLanguage(activeLang);

    const contactButtons = document.querySelectorAll('[data-contact-btn]');
    contactButtons.forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();

        const tryOpenModal = (attempts = 0) => {
          if (typeof openContactModal === 'function') {
            openContactModal();
          } else if (attempts < 20) {
            setTimeout(() => tryOpenModal(attempts + 1), 100);
          } else {
            console.error('openContactModal function not available after 2 seconds');
          }
        };

        tryOpenModal();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavigation);
  } else {
    loadNavigation();
  }

  if (typeof window !== 'undefined') {
    window.__lynckRouting = {
      SUPPORTED_LANGS: SUPPORTED_LANGS.slice(),
      ROUTE_MAP,
      getPathInfo,
      resolveLocalizedPath,
      detectLanguageFromPath,
      normalizeLang
    };

    window.__lynckApplyLocalizedLinks = function (lang) {
      const normalizedLang = normalizeLang(lang);
      if (!SUPPORTED_LANGS.includes(normalizedLang)) {
        return;
      }
      const navContainer = document.getElementById('navigation-placeholder');
      if (!navContainer) {
        return;
      }
      applyLocalizedLinks(navContainer, normalizedLang);
      updateLanguageIndicator(normalizedLang);
      highlightSelectedLanguage(normalizedLang);
    };
  }
})();
