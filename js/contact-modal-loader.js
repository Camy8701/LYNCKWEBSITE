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
        event.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const email = document.getElementById('email').value.trim();

        // Clear previous errors
        document.getElementById('firstNameError').textContent = '';
        document.getElementById('emailError').textContent = '';

        let hasErrors = false;

        // Validate first name
        if (!firstName) {
          document.getElementById('firstNameError').textContent = 'First name is required';
          hasErrors = true;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          document.getElementById('emailError').textContent = 'Email is required';
          hasErrors = true;
        } else if (!emailRegex.test(email)) {
          document.getElementById('emailError').textContent = 'Please enter a valid email address';
          hasErrors = true;
        }

        if (!hasErrors) {
          // Get form data
          const service = document.getElementById('selectedService').textContent;
          const budget = document.getElementById('selectedBudget').textContent;

          const formData = new FormData();
          formData.append('access_key', 'a4f10748-f6e9-4a3a-b8f6-f9e339f59019');
          formData.append('subject', 'New Contact Form Submission from LYNCK Website');
          formData.append('from_name', `${firstName} ${document.getElementById('lastName').value.trim()}`);
          formData.append('email', email);
          formData.append('First Name', firstName);
          formData.append('Last Name', document.getElementById('lastName').value.trim());
          formData.append('Service', service !== 'Select a service' ? service : 'Not specified');
          formData.append('Budget', budget !== 'Select budget range' ? budget : 'Not specified');
          formData.append('message', document.getElementById('message').value.trim());

          // Update submit button
          const submitBtn = document.getElementById('submitBtn');
          const originalHTML = submitBtn.innerHTML;
          submitBtn.innerHTML = '<span>Sending...</span>';
          submitBtn.disabled = true;

          // Send form data to Web3Forms
          fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert('Thank you for your message! We\'ll get back to you within 24 hours.');
              closeContactModal();
              document.getElementById('contactForm').reset();
              document.getElementById('selectedService').textContent = 'Select a service';
              document.getElementById('selectedBudget').textContent = 'Select budget range';
            } else {
              alert('Oops! Something went wrong. Please try again or email us directly at info@lynckstudio.pro');
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('Oops! Something went wrong. Please try again or email us directly at info@lynckstudio.pro');
          })
          .finally(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
          });
        }
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      const dropdowns = ['servicesDropdown', 'budgetDropdown', 'countryDropdown', 'timeDropdown', 'timezoneDropdown'];
      dropdowns.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown && !dropdown.classList.contains('hidden')) {
          if (!e.target.closest('.form-dropdown')) {
            dropdown.classList.add('hidden');
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
      dropdown.classList.toggle('hidden');
    }
  };

  window.selectService = function(service) {
    const selectedService = document.getElementById('selectedService');
    if (selectedService) {
      selectedService.textContent = service;
    }
    const dropdown = document.getElementById('servicesDropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  window.selectBudget = function(budget) {
    const selectedBudget = document.getElementById('selectedBudget');
    if (selectedBudget) {
      selectedBudget.textContent = budget;
    }
    const dropdown = document.getElementById('budgetDropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  window.selectCountry = function(code, country) {
    const selectedCountry = document.getElementById('selectedCountry');
    if (selectedCountry) {
      selectedCountry.textContent = code;
    }
    const dropdown = document.getElementById('countryDropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  window.selectTime = function(time) {
    const selectedTime = document.getElementById('selectedTime');
    if (selectedTime) {
      selectedTime.textContent = time;
    }
    const dropdown = document.getElementById('timeDropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  window.selectTimezone = function(timezone) {
    const selectedTimezone = document.getElementById('selectedTimezone');
    if (selectedTimezone) {
      selectedTimezone.textContent = timezone;
    }
    const dropdown = document.getElementById('timezoneDropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
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
