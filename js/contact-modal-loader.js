// Contact Modal Loader - Dynamically loads and injects contact modal component
// This eliminates the need to duplicate modal code across all HTML files

(function() {
  'use strict';

  // Function to load contact modal HTML
  async function loadContactModal() {
    try {
      // Determine the correct path based on current page location
      const currentPath = window.location.pathname;
      const isInSubfolder = currentPath.includes('/de/');
      const modalPath = isInSubfolder ? '../components/contact-modal.html' : 'components/contact-modal.html';

      // Fetch the modal HTML
      const response = await fetch(modalPath);
      if (!response.ok) {
        throw new Error(`Failed to load contact modal: ${response.status}`);
      }

      const modalHTML = await response.text();

      // Find the modal placeholder or inject at the end of body
      let modalContainer = document.getElementById('contact-modal-placeholder');

      if (!modalContainer) {
        // Create placeholder if it doesn't exist
        modalContainer = document.createElement('div');
        modalContainer.id = 'contact-modal-placeholder';
        document.body.appendChild(modalContainer);
      }

      // Inject the modal HTML
      modalContainer.innerHTML = modalHTML;

      // Initialize modal functionality after injection
      initializeModalFunctionality();

      // CRITICAL: Translate the modal content after injection
      // The modal is loaded AFTER the initial translatePage() call
      // So we need to translate it again here
      if (typeof window.translatePage === 'function') {
        window.translatePage();
      }

    } catch (error) {
      console.error('Error loading contact modal:', error);
      // Fail silently in production, but log for debugging
    }
  }

  // Initialize modal functionality (form handling, dropdowns, etc.)
  function initializeModalFunctionality() {
    // Contact form submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function(event) {
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
          event.preventDefault();
          document.getElementById('firstNameError').textContent = 'First name is required';
          hasErrors = true;
        }

        // Validate last name
        if (!lastName) {
          event.preventDefault();
          document.getElementById('lastNameError').textContent = 'Last name is required';
          hasErrors = true;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          event.preventDefault();
          document.getElementById('emailError').textContent = 'Email is required';
          hasErrors = true;
        } else if (!emailRegex.test(email)) {
          event.preventDefault();
          document.getElementById('emailError').textContent = 'Please enter a valid email address';
          hasErrors = true;
        }

        if (!hasErrors) {
          // Show loading state
          const submitBtn = document.getElementById('submitBtn');
          submitBtn.innerHTML = '<span>Sending...</span>';
          submitBtn.disabled = true;

          // Form will submit naturally to Web3Forms
          // Web3Forms will handle the redirect
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
