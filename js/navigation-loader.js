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
      const pathInfo = getPathInfo(currentPath);
      const isInLocalizedFolder = pathInfo.locale && pathInfo.locale !== 'en';
      const navPath = isInLocalizedFolder ? '../components/navigation.html' : 'components/navigation.html';

      // Always prioritize path language over stored language
      // This ensures the page you're on determines the language, not localStorage
      const pathLang = detectLanguageFromPath();
      const storedLangRaw = getStoredLanguage();
      const storedLang = storedLangRaw ? normalizeLang(storedLangRaw) : null;

      // If stored language differs from path, update storage to match path
      // This prevents the conflict where localStorage says 'de' but we're on English page
      if (storedLang && storedLang !== pathLang) {
        setStoredLanguage(pathLang);
      }

      const response = await fetch(navPath);
      if (!response.ok) {
        throw new Error(`Failed to load navigation: ${response.status}`);
      }

      const navHTML = await response.text();
      let navContainer = document.getElementById('navigation-placeholder');

      if (!navContainer) {
        navContainer = document.createElement('div');
        navContainer.id = 'navigation-placeholder';
        document.body.insertBefore(navContainer, document.body.firstChild);
      }

      navContainer.innerHTML = navHTML;

      // Always use path language as the active language
      // The URL determines the language, not localStorage
      const activeLang = pathLang;
      setStoredLanguage(activeLang);

      // Update translations.js currentLanguage before translating
      // This ensures translatePage() uses the correct language
      if (typeof window.updateCurrentLanguage === 'function') {
        window.updateCurrentLanguage(activeLang);
      }

      applyLocalizedLinks(navContainer, activeLang);
      updateLanguageIndicator(activeLang);
      highlightSelectedLanguage(activeLang);
      initializeNavigationFunctionality(navContainer, activeLang);

      // Translate navigation after it's been loaded and language is set
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
