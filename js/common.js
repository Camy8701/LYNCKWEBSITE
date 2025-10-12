// LYNCK Studio - Shared JavaScript Functionality
// Common functions used across multiple pages

// Contact Form Modal Functions
function openContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Schedule Modal Functions
function openScheduleModal() {
  const modal = document.getElementById('scheduleModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeScheduleModal() {
  const modal = document.getElementById('scheduleModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Dropdown Functions
function toggleDropdown(type) {
  const dropdown = document.getElementById(type + 'Dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');

    // Close other dropdowns
    const allDropdowns = document.querySelectorAll('.dropdown-menu');
    allDropdowns.forEach(d => {
      if (d.id !== type + 'Dropdown') {
        d.classList.remove('active');
      }
    });
  }
}

function selectService(service) {
  const selectedElement = document.getElementById('selectedService');
  const dropdown = document.getElementById('servicesDropdown');
  if (selectedElement) selectedElement.textContent = service;
  if (dropdown) dropdown.classList.remove('active');
}

function selectBudget(budget) {
  const selectedElement = document.getElementById('selectedBudget');
  const dropdown = document.getElementById('budgetDropdown');
  if (selectedElement) selectedElement.textContent = budget;
  if (dropdown) dropdown.classList.remove('active');
}

function selectCountry(code, country) {
  const selectedElement = document.getElementById('selectedCountry');
  const dropdown = document.getElementById('countryDropdown');
  if (selectedElement) selectedElement.textContent = code;
  if (dropdown) dropdown.classList.remove('active');
}

// Close dropdowns when clicking outside
function initializeDropdownListeners() {
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.form-dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
}

// Close modal when clicking outside
function initializeModalListeners() {
  const contactModal = document.getElementById('contactModal');
  if (contactModal) {
    contactModal.addEventListener('click', function(event) {
      if (event.target === this) {
        closeContactModal();
      }
    });
  }

  const scheduleModal = document.getElementById('scheduleModal');
  if (scheduleModal) {
    scheduleModal.addEventListener('click', function(event) {
      if (event.target === this) {
        closeScheduleModal();
      }
    });
  }
}

// Form validation helpers
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateRequired(value) {
  return value && value.trim().length > 0;
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = '';
  }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Initialize all common functionality
function initializeCommonFunctionality() {
  initializeDropdownListeners();
  initializeModalListeners();
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initializeCommonFunctionality);

// Export functions for global access
if (typeof window !== 'undefined') {
  window.openContactModal = openContactModal;
  window.closeContactModal = closeContactModal;
  window.openScheduleModal = openScheduleModal;
  window.closeScheduleModal = closeScheduleModal;
  window.toggleDropdown = toggleDropdown;
  window.selectService = selectService;
  window.selectBudget = selectBudget;
  window.selectCountry = selectCountry;
  window.scrollToSection = scrollToSection;
}