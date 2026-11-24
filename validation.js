/**
 * Healthcare Appointment Booking System - Form Validation
 * Real-time and submission validation with visual error feedback
 */

const FormValidator = {
  // Common Regex patterns
  patterns: {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/,
    name: /^[a-zA-Z\s.'-]{2,60}$/,
    zip: /^\d{5}(-\d{4})?$/
  },

  /**
   * Validates a person's full name
   */
  validateName(value) {
    if (!value || !value.trim()) {
      return { isValid: false, message: 'Full name is required.' };
    }
    if (value.trim().length < 3) {
      return { isValid: false, message: 'Name must be at least 3 characters.' };
    }
    if (!this.patterns.name.test(value.trim())) {
      return { isValid: false, message: 'Name should only contain letters and standard punctuation.' };
    }
    return { isValid: true, message: '' };
  },

  /**
   * Validates email address format
   */
  validateEmail(value) {
    if (!value || !value.trim()) {
      return { isValid: false, message: 'Email address is required for appointment confirmation.' };
    }
    if (!this.patterns.email.test(value.trim())) {
      return { isValid: false, message: 'Please enter a valid email address (e.g., patient@example.com).' };
    }
    return { isValid: true, message: '' };
  },

  /**
   * Validates phone number
   */
  validatePhone(value) {
    if (!value || !value.trim()) {
      return { isValid: false, message: 'Contact phone number is required.' };
    }
    const cleanDigits = value.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      return { isValid: false, message: 'Phone number must contain at least 10 digits.' };
    }
    if (!this.patterns.phone.test(value.trim())) {
      return { isValid: false, message: 'Please enter a valid phone number (e.g., 555-123-4567).' };
    }
    return { isValid: true, message: '' };
  },

  /**
   * Validates age
   */
  validateAge(value) {
    if (value === '' || value === null || value === undefined) {
      return { isValid: false, message: 'Patient age is required.' };
    }
    const age = Number(value);
    if (isNaN(age) || age < 0 || age > 120 || !Number.isInteger(age)) {
      return { isValid: false, message: 'Age must be a valid whole number between 0 and 120.' };
    }
    return { isValid: true, message: '' };
  },

  /**
   * Validates appointment date
   */
  validateDate(value) {
    if (!value) {
      return { isValid: false, message: 'Please select an appointment date.' };
    }
    const selected = new Date(value + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selected.getTime())) {
      return { isValid: false, message: 'Invalid date format.' };
    }
    if (selected < today) {
      return { isValid: false, message: 'Appointment date cannot be in the past.' };
    }

    // Disallow dates more than 90 days out
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 90);
    if (selected > maxDate) {
      return { isValid: false, message: 'Appointments can only be scheduled up to 90 days in advance.' };
    }

    return { isValid: true, message: '' };
  },

  /**
   * Validates required dropdown/selection
   */
  validateRequired(value, fieldLabel = 'This field') {
    if (!value || !value.trim()) {
      return { isValid: false, message: `${fieldLabel} is required.` };
    }
    return { isValid: true, message: '' };
  },

  /**
   * Validates medical symptoms / reason for visit
   */
  validateReason(value) {
    if (!value || !value.trim()) {
      return { isValid: false, message: 'Please briefly describe the reason for your appointment or symptoms.' };
    }
    if (value.trim().length < 5) {
      return { isValid: false, message: 'Please provide at least 5 characters describing your visit reason.' };
    }
    return { isValid: true, message: '' };
  },

  /**
   * Shows error state on an input element
   */
  showError(inputElement, errorMessage) {
    if (!inputElement) return;
    const formGroup = inputElement.closest('.form-group') || inputElement.parentElement;
    inputElement.classList.add('is-invalid');
    inputElement.classList.remove('is-valid');
    inputElement.setAttribute('aria-invalid', 'true');

    let feedback = formGroup.querySelector('.invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      formGroup.appendChild(feedback);
    }
    feedback.textContent = errorMessage;
    feedback.style.display = 'block';
  },

  /**
   * Marks input element as valid
   */
  showSuccess(inputElement) {
    if (!inputElement) return;
    const formGroup = inputElement.closest('.form-group') || inputElement.parentElement;
    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');
    inputElement.removeAttribute('aria-invalid');

    const feedback = formGroup.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.textContent = '';
      feedback.style.display = 'none';
    }
  },

  /**
   * Clears error state on input
   */
  clearError(inputElement) {
    if (!inputElement) return;
    const formGroup = inputElement.closest('.form-group') || inputElement.parentElement;
    inputElement.classList.remove('is-invalid');
    inputElement.classList.remove('is-valid');
    inputElement.removeAttribute('aria-invalid');

    const feedback = formGroup.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.textContent = '';
      feedback.style.display = 'none';
    }
  },

  /**
   * Clears all error states in a container
   */
  clearAll(container) {
    if (!container) return;
    container.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
      el.classList.remove('is-invalid', 'is-valid');
      el.removeAttribute('aria-invalid');
    });
    container.querySelectorAll('.invalid-feedback').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }
};
