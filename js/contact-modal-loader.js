// Contact Modal Loader - Dynamically loads and injects contact modal component
// This eliminates the need to duplicate modal code across all HTML files

(function() {
  'use strict';

const CONTACT_MODAL_TEMPLATE = /* html */ `
<!-- Contact Form Modal -->
<div id="contactModal" class="contact-modal">
  <div class="contact-form-container">
    <button class="close-modal" onclick="closeContactModal()">&times;</button>

    <div class="text-center mb-8">
      <h2 class="text-4xl font-light text-white tracking-tight font-geist mb-4" data-translate="Let's Work Together">
        Let's Work Together
      </h2>
      <p class="text-lg text-gray-300 max-w-lg mx-auto" data-translate="Ready to scale your business with proven marketing strategies? Let's discuss your project.">
        Ready to scale your business with proven marketing strategies? Let's discuss your project.
      </p>
    </div>

    <form id="contactForm" action="https://api.web3forms.com/submit" method="POST" class="space-y-6">
      <!-- Web3Forms Access Key -->
      <input type="hidden" name="access_key" value="6163bfe5-5cc2-4c37-b6c0-af5239e19415">
      <input type="hidden" name="subject" value="New Contact Form Submission from LYNCK Website">
      <input type="hidden" id="redirectField" name="redirect" value="https://lynckstudio.com/thank-you.html">

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            <span data-translate="First Name">First Name</span> <span class="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="First Name"
            required
            class="w-full bg-black/70 border border-white/20 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-green-400/40 focus:outline-none transition-all"
          >
          <div id="firstNameError" class="form-error"></div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            <span data-translate="Last Name">Last Name</span> <span class="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="Last Name"
            required
            class="w-full bg-black/70 border border-white/20 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-green-400/40 focus:outline-none transition-all"
          >
          <div id="lastNameError" class="form-error"></div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          <span data-translate="Email Address">Email Address</span> <span class="text-red-400">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          class="w-full bg-black/70 border border-white/20 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-green-400/40 focus:outline-none transition-all"
        >
        <div id="emailError" class="form-error"></div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2"><span data-translate="Service Interested In">Service Interested In</span></label>
        <input type="hidden" id="serviceInput" name="Service" value="">
        <div class="form-dropdown">
          <button type="button" class="dropdown-button" onclick="toggleDropdown('services')">
            <span id="selectedService" data-translate="Select a service">Select a service</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </button>
          <div id="servicesDropdown" class="dropdown-menu">
            <div class="dropdown-item" onclick="selectService('Digital Marketing')" data-translate="Digital Marketing">Digital Marketing</div>
            <div class="dropdown-item" onclick="selectService('Build a Website')" data-translate="Build a Website">Build a Website</div>
            <div class="dropdown-item" onclick="selectService('Something Else')" data-translate="Something Else">Something Else</div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2"><span data-translate="Budget Range">Budget Range</span></label>
        <input type="hidden" id="budgetInput" name="Budget" value="">
        <div class="form-dropdown">
          <button type="button" class="dropdown-button" onclick="toggleDropdown('budget')">
            <span id="selectedBudget" data-translate="Select budget range">Select budget range</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </button>
          <div id="budgetDropdown" class="dropdown-menu">
            <div class="dropdown-item" onclick="selectBudget('$100 - $500')">$100 - $500</div>
            <div class="dropdown-item" onclick="selectBudget('$500 - $1,000')">$500 - $1,000</div>
            <div class="dropdown-item" onclick="selectBudget('$1,000 - $2,000')">$1,000 - $2,000</div>
            <div class="dropdown-item" onclick="selectBudget('$2,000 - $3,000')">$2,000 - $3,000</div>
            <div class="dropdown-item" onclick="selectBudget('$3,000 - $5,000')">$3,000 - $5,000</div>
            <div class="dropdown-item" onclick="selectBudget('$5,000 - $15,000')">$5,000 - $15,000</div>
            <div class="dropdown-item" onclick="selectBudget('$15,000 - $50,000')">$15,000 - $50,000</div>
            <div class="dropdown-item" onclick="selectBudget('$50,000+')">$50,000+</div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2"><span data-translate="How can LYNCK help you?">How can LYNCK help you?</span></label>
        <textarea
          id="message"
          name="message"
          class="w-full bg-black/70 border border-white/20 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-green-400/40 focus:outline-none transition-all resize-none h-32"
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full inline-flex items-center justify-center gap-2 shiny-cta font-geist"
        id="submitBtn"
      >
        <span data-translate="Send Message">Send Message</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </button>
    </form>
  </div>
</div>

<!-- Schedule Call Modal (for index pages) -->
<div id="scheduleModal" class="contact-modal">
  <div class="contact-form-container">
    <button class="close-modal" onclick="closeScheduleModal()">&times;</button>

    <div class="text-center mb-8">
      <h2 class="text-4xl font-light text-white tracking-tight font-geist mb-4">
        Schedule a Call
      </h2>
      <p class="text-lg text-gray-300 max-w-lg mx-auto">
        Book a consultation with our team to discuss your marketing goals and strategy.
      </p>
    </div>

    <form class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            required
            class="w-full bg-black/70 border border-white/20 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-green-400/40 focus:outline-none transition-all"
            placeholder="Your first name"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
          <input
            type="text"
            required
            class="w-full bg-black/70 border border-white/20 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-green-400/40 focus:outline-none transition-all"
            placeholder="Your last name"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          required
          class="w-full bg-black/70 border border-white/20 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-green-400/40 focus:outline-none transition-all"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Phone Number
        </label>
        <div class="flex gap-2">
          <div class="form-dropdown w-24">
            <button
              type="button"
              class="dropdown-button h-12 px-3 text-sm"
              onclick="toggleDropdown('country')"
              aria-label="Select country code"
              aria-expanded="false"
              aria-haspopup="listbox"
            >
              <span id="selectedCountry">+1</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
            </button>
            <div id="countryDropdown" class="dropdown-menu">
              <div class="dropdown-item" onclick="selectCountry('+1', 'US')">🇺🇸 +1</div>
              <div class="dropdown-item" onclick="selectCountry('+44', 'UK')">🇬🇧 +44</div>
              <div class="dropdown-item" onclick="selectCountry('+49', 'DE')">🇩🇪 +49</div>
              <div class="dropdown-item" onclick="selectCountry('+33', 'FR')">🇫🇷 +33</div>
              <div class="dropdown-item" onclick="selectCountry('+34', 'ES')">🇪🇸 +34</div>
              <div class="dropdown-item" onclick="selectCountry('+39', 'IT')">🇮🇹 +39</div>
              <div class="dropdown-item" onclick="selectCountry('+31', 'NL')">🇳🇱 +31</div>
              <div class="dropdown-item" onclick="selectCountry('+41', 'CH')">🇨🇭 +41</div>
              <div class="dropdown-item" onclick="selectCountry('+61', 'AU')">🇦🇺 +61</div>
              <div class="dropdown-item" onclick="selectCountry('+81', 'JP')">🇯🇵 +81</div>
            </div>
          </div>
          <input
            type="tel"
            required
            class="flex-1 bg-black/70 border border-white/20 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-green-400/40 focus:outline-none transition-all"
            placeholder="Phone number"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Preferred Time
        </label>
        <div class="form-dropdown">
          <button
            type="button"
            class="dropdown-button"
            onclick="toggleDropdown('time')"
            aria-label="Select preferred time"
            aria-expanded="false"
            aria-haspopup="listbox"
          >
            <span id="selectedTime">Select time</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
          </button>
          <div id="timeDropdown" class="dropdown-menu">
            <div class="dropdown-item" onclick="selectTime('Morning (9AM - 12PM)')">Morning (9AM - 12PM)</div>
            <div class="dropdown-item" onclick="selectTime('Afternoon (12PM - 5PM)')">Afternoon (12PM - 5PM)</div>
            <div class="dropdown-item" onclick="selectTime('Evening (5PM - 8PM)')">Evening (5PM - 8PM)</div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Timezone
        </label>
        <div class="form-dropdown">
          <button
            type="button"
            class="dropdown-button"
            onclick="toggleDropdown('timezone')"
            aria-label="Select timezone"
            aria-expanded="false"
            aria-haspopup="listbox"
          >
            <span id="selectedTimezone">Select timezone</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
          </button>
          <div id="timezoneDropdown" class="dropdown-menu">
            <div class="dropdown-item" onclick="selectTimezone('EST (Eastern)')">EST (Eastern)</div>
            <div class="dropdown-item" onclick="selectTimezone('CST (Central)')">CST (Central)</div>
            <div class="dropdown-item" onclick="selectTimezone('MST (Mountain)')">MST (Mountain)</div>
            <div class="dropdown-item" onclick="selectTimezone('PST (Pacific)')">PST (Pacific)</div>
            <div class="dropdown-item" onclick="selectTimezone('GMT (London)')">GMT (London)</div>
            <div class="dropdown-item" onclick="selectTimezone('CET (Central Europe)')">CET (Central Europe)</div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="w-full inline-flex items-center justify-center gap-2 shiny-cta font-geist"
      >
        <span>Schedule Call</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </button>
    </form>
</div>
</div>
  `;

  const CONTACT_TRANSLATIONS = {
    en: {
      "Let's Work Together": "Let's Work Together",
      "Ready to scale your business with proven marketing strategies? Let's discuss your project.": "Ready to scale your business with proven marketing strategies? Let's discuss your project.",
      "First Name": "First Name",
      "Last Name": "Last Name",
      "Email Address": "Email Address",
      "Service Interested In": "Service Interested In",
      "Select a service": "Select a service",
      "Digital Marketing": "Digital Marketing",
      "Build a Website": "Build a Website",
      "Something Else": "Something Else",
      "Budget Range": "Budget Range",
      "Select budget range": "Select budget range",
      "How can LYNCK help you?": "How can LYNCK help you?",
      "Send Message": "Send Message"
    },
    de: {
      "Let's Work Together": "Lassen Sie uns zusammenarbeiten",
      "Ready to scale your business with proven marketing strategies? Let's discuss your project.": "Bereit, Ihr Unternehmen mit bewährten Marketing-Strategien zu skalieren? Lassen Sie uns über Ihr Projekt sprechen.",
      "First Name": "Vorname",
      "Last Name": "Nachname",
      "Email Address": "E-Mail-Adresse",
      "Service Interested In": "Interessierter Service",
      "Select a service": "Service auswählen",
      "Digital Marketing": "Digitales Marketing",
      "Build a Website": "Website Erstellen",
      "Something Else": "Etwas Anderes",
      "Budget Range": "Budget-Bereich",
      "Select budget range": "Budget-Bereich auswählen",
      "How can LYNCK help you?": "Wie kann LYNCK Ihnen helfen?",
      "Send Message": "Nachricht Senden"
    }
  };

  function applyModalTranslations(container, lang) {
    const copy = CONTACT_TRANSLATIONS[lang];
    if (!copy || !container) {
      return;
    }

    const nodes = container.querySelectorAll('[data-translate]');
    nodes.forEach(node => {
      const key = node.getAttribute('data-translate');
      if (key && copy[key]) {
        node.textContent = copy[key];
      }
    });
  }

  function isGermanPath(pathname) {
    if (typeof pathname !== 'string') return false;
    const normalized = pathname.toLowerCase();
    return normalized === '/de' || normalized.startsWith('/de/');
  }

  // Function to load contact modal HTML
  function getThankYouPath(pathname) {
    return isGermanPath(pathname) ? '/de/thank-you.html' : '/thank-you.html';
  }

  function getThankYouUrl(pathname) {
    const origin = window.location.origin || '';
    return `${origin}${getThankYouPath(pathname)}`;
  }

  function loadContactModal() {
    try {
      let modalContainer = document.getElementById('contact-modal-placeholder');

      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'contact-modal-placeholder';
        document.body.appendChild(modalContainer);
      }

      modalContainer.innerHTML = CONTACT_MODAL_TEMPLATE;
      const lang = isGermanPath(window.location.pathname) ? 'de' : 'en';
      applyModalTranslations(modalContainer, lang);

      initializeModalFunctionality();

      // Modal loads after the initial translatePage() call, so re-run translation here
      if (typeof window.translatePage === 'function') {
        window.translatePage();
      }
    } catch (error) {
      console.error('Error loading contact modal:', error);
    }
  }

  // Initialize modal functionality (form handling, dropdowns, etc.)
  function initializeModalFunctionality() {
    // Set language-specific redirect URL for the form
    const redirectField = document.getElementById('redirectField');
    if (redirectField) {
      const currentPath = window.location.pathname;
      redirectField.value = getThankYouUrl(currentPath);
    }

    // Contact form submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      const currentPath = window.location.pathname;
      const isGerman = isGermanPath(currentPath);
      const copy = isGerman
        ? {
            firstNameRequired: 'Vorname ist erforderlich',
            lastNameRequired: 'Nachname ist erforderlich',
            emailRequired: 'E-Mail-Adresse ist erforderlich',
            emailInvalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
            sendingLabel: 'Wird gesendet...',
            submitError: 'Beim Senden des Formulars ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
          }
        : {
            firstNameRequired: 'First name is required',
            lastNameRequired: 'Last name is required',
            emailRequired: 'Email is required',
            emailInvalid: 'Please enter a valid email address',
            sendingLabel: 'Sending...',
            submitError: 'There was an issue submitting the form. Please try again.'
          };

      contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();

        // Clear previous errors
        document.getElementById('firstNameError').textContent = '';
        document.getElementById('lastNameError').textContent = '';
        document.getElementById('emailError').textContent = '';

        let hasErrors = false;

        // Validate first name
        if (!firstName) {
          document.getElementById('firstNameError').textContent = copy.firstNameRequired;
          hasErrors = true;
        }

        if (!lastName) {
          document.getElementById('lastNameError').textContent = copy.lastNameRequired;
          hasErrors = true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          document.getElementById('emailError').textContent = copy.emailRequired;
          hasErrors = true;
        } else if (!emailRegex.test(email)) {
          document.getElementById('emailError').textContent = copy.emailInvalid;
          hasErrors = true;
        }

        if (hasErrors) {
          return;
        }

        const submitBtn = document.getElementById('submitBtn');
        const originalLabel = submitBtn.dataset.originalLabel || submitBtn.innerHTML;
        submitBtn.dataset.originalLabel = originalLabel;
        submitBtn.innerHTML = `<span>${copy.sendingLabel}</span>`;
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
          const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
              Accept: 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`Form submission failed with status ${response.status}`);
          }

          const thankYouPath = getThankYouPath(window.location.pathname);
          window.location.href = thankYouPath;
        } catch (error) {
          console.error('Error submitting form:', error);
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalLabel;
          alert(copy.submitError);
        }
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      const dropdowns = ['servicesDropdown', 'budgetDropdown', 'countryDropdown', 'timeDropdown', 'timezoneDropdown'];
      dropdowns.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown && dropdown.classList.contains('active')) {
          if (!e.target.closest('.form-dropdown')) {
            dropdown.classList.remove('active');
          }
        }
      });
    });
  }

  // Global functions for modal control (called by onclick handlers)
  window.toggleDropdown = function(type) {
    const dropdownMap = {
      'services': 'servicesDropdown',
      'budget': 'budgetDropdown',
      'country': 'countryDropdown',
      'time': 'timeDropdown',
      'timezone': 'timezoneDropdown'
    };

    const dropdownId = dropdownMap[type];
    if (!dropdownId) return;

    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      // Use 'active' class instead of 'hidden' to match CSS
      dropdown.classList.toggle('active');
    }
  };

  window.selectService = function(service) {
    const selectedService = document.getElementById('selectedService');
    if (selectedService) {
      selectedService.textContent = service;
    }
    const serviceInput = document.getElementById('serviceInput');
    if (serviceInput) {
      serviceInput.value = service;
    }
    const dropdown = document.getElementById('servicesDropdown');
    if (dropdown) {
      dropdown.classList.remove('active');
    }
  };

  window.selectBudget = function(budget) {
    const selectedBudget = document.getElementById('selectedBudget');
    if (selectedBudget) {
      selectedBudget.textContent = budget;
    }
    const budgetInput = document.getElementById('budgetInput');
    if (budgetInput) {
      budgetInput.value = budget;
    }
    const dropdown = document.getElementById('budgetDropdown');
    if (dropdown) {
      dropdown.classList.remove('active');
    }
  };

  window.selectCountry = function(code, country) {
    const selectedCountry = document.getElementById('selectedCountry');
    if (selectedCountry) {
      selectedCountry.textContent = code;
    }
    const dropdown = document.getElementById('countryDropdown');
    if (dropdown) {
      dropdown.classList.remove('active');
    }
  };

  window.selectTime = function(time) {
    const selectedTime = document.getElementById('selectedTime');
    if (selectedTime) {
      selectedTime.textContent = time;
    }
    const dropdown = document.getElementById('timeDropdown');
    if (dropdown) {
      dropdown.classList.remove('active');
    }
  };

  window.selectTimezone = function(timezone) {
    const selectedTimezone = document.getElementById('selectedTimezone');
    if (selectedTimezone) {
      selectedTimezone.textContent = timezone;
    }
    const dropdown = document.getElementById('timezoneDropdown');
    if (dropdown) {
      dropdown.classList.remove('active');
    }
  };

  window.openContactModal = function() {
    const modal = document.getElementById('contactModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeContactModal = function() {
    const modal = document.getElementById('contactModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.openScheduleModal = function() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeScheduleModal = function() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close modal when clicking outside
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('contact-modal') && e.target.classList.contains('active')) {
      if (e.target.id === 'contactModal') {
        closeContactModal();
      } else if (e.target.id === 'scheduleModal') {
        closeScheduleModal();
      }
    }
  });

  // Load modal when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContactModal);
  } else {
    // DOM already loaded
    loadContactModal();
  }
})();
