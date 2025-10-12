// LYNCK Studio - Shared JavaScript Functionality
// Common functions used across multiple pages

// NOTE: Contact modal functions and dropdown handlers are now managed by
// contact-modal-loader.js to avoid duplication and ensure consistency

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

// Initialize common functionality
function initializeCommonFunctionality() {
  // All modal and dropdown functionality is now handled by contact-modal-loader.js
  // This function is kept for backward compatibility and future common features
  console.log('Common functionality initialized');
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initializeCommonFunctionality);

// Export utility functions for global access
if (typeof window !== 'undefined') {
  window.scrollToSection = scrollToSection;
  window.validateEmail = validateEmail;
  window.validateRequired = validateRequired;
}