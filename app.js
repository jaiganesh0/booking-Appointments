/**
 * Healthcare Appointment Booking System - Main Application Logic
 * Orchestrates UI interactions, dynamic rendering, booking wizard, and appointments management.
 */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  // State
  doctors: [],
  specializations: [],
  appointments: [],
  selectedDoctorId: null,
  selectedDate: null,
  selectedTimeSlot: null,
  currentDoctorFilter: 'all',
  currentSearchQuery: '',
  currentSortOrder: 'recommended',
  currentAppointmentTab: 'all',

  init() {
    this.doctors = StorageService.getDoctors();
    this.specializations = StorageService.getSpecializations();
    this.appointments = StorageService.getAppointments();

    this.cacheDOM();
    this.bindEvents();
    this.renderSpecializations();
    this.renderDoctors();
    this.populateDoctorSelect();
    this.renderAppointmentsDashboard();
    this.setupDateConstraints();
    this.loadSavedPatientData();
    this.handleUrlParamActions();
  },

  handleUrlParamActions() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (!view) return;

    document.body.dataset.view = view;

    if (view === 'doctor-modal') {
      this.openDoctorModal('doc-101');
    } else if (view === 'ticket-modal') {
      const apt = this.appointments[0] || StorageService.getAppointments()[0];
      if (apt) this.openConfirmationModal(apt);
    } else if (view === 'validate-error') {
      FormValidator.showError(this.patientNameInput, 'Full name is required.');
      FormValidator.showError(this.patientEmailInput, 'Please enter a valid email address.');
      FormValidator.showError(this.patientPhoneInput, 'Contact phone number is required.');
      FormValidator.showError(this.patientAgeInput, 'Age must be a valid whole number between 0 and 120.');
      FormValidator.showError(this.patientSymptomsInput, 'Please briefly describe the reason for your visit.');
    }
  },

  cacheDOM() {
    // Navigation & Mobile menu
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');

    // Sections containers
    this.specializationsGrid = document.getElementById('specializations-grid');
    this.doctorsGrid = document.getElementById('doctors-grid');
    this.doctorSearchInput = document.getElementById('doctor-search');
    this.specializationFilterContainer = document.getElementById('specialization-filters');
    this.sortDoctorsSelect = document.getElementById('sort-doctors');

    // Booking form elements
    this.bookingForm = document.getElementById('appointment-booking-form');
    this.bookingDoctorSelect = document.getElementById('booking-doctor');
    this.bookingDateInput = document.getElementById('booking-date');
    this.timeSlotsContainer = document.getElementById('time-slots-container');
    this.consultationTypeInputs = document.querySelectorAll('input[name="consultation-type"]');
    this.patientNameInput = document.getElementById('patient-name');
    this.patientEmailInput = document.getElementById('patient-email');
    this.patientPhoneInput = document.getElementById('patient-phone');
    this.patientAgeInput = document.getElementById('patient-age');
    this.patientGenderSelect = document.getElementById('patient-gender');
    this.patientBloodGroupSelect = document.getElementById('patient-blood-group');
    this.patientSymptomsInput = document.getElementById('patient-symptoms');
    this.saveProfileCheckbox = document.getElementById('save-profile-checkbox');
    this.useSavedProfileBtn = document.getElementById('use-saved-profile-btn');

    // Pricing summary
    this.summaryDoctorFee = document.getElementById('summary-doctor-fee');
    this.summaryTotalFee = document.getElementById('summary-total-fee');
    this.summaryDoctorName = document.getElementById('summary-doctor-name');

    // Patient profile management form
    this.profileForm = document.getElementById('patient-profile-form');

    // Appointments dashboard
    this.appointmentsListContainer = document.getElementById('appointments-list');
    this.appointmentSearchInput = document.getElementById('appointment-search');
    this.appointmentFilterTabs = document.querySelectorAll('.tab-btn');
    this.statTotal = document.getElementById('stat-total');
    this.statUpcoming = document.getElementById('stat-upcoming');
    this.statCompleted = document.getElementById('stat-completed');
    this.statCancelled = document.getElementById('stat-cancelled');

    // Modals
    this.doctorModal = document.getElementById('doctor-details-modal');
    this.confirmationModal = document.getElementById('confirmation-modal');
    this.rescheduleModal = document.getElementById('reschedule-modal');
    this.cancelConfirmModal = document.getElementById('cancel-modal');
    this.toastContainer = document.getElementById('toast-container');
  },

  bindEvents() {
    // Mobile navigation toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => {
        this.navMenu.classList.toggle('active');
        const isExpanded = this.navMenu.classList.contains('active');
        this.navToggle.setAttribute('aria-expanded', isExpanded);
      });
    }

    // Smooth scroll for nav links & close mobile menu
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            this.navMenu.classList.remove('active');
            if (this.navToggle) this.navToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });

    // Doctor searching and sorting
    if (this.doctorSearchInput) {
      this.doctorSearchInput.addEventListener('input', (e) => {
        this.currentSearchQuery = e.target.value.toLowerCase().trim();
        this.renderDoctors();
      });
    }

    if (this.sortDoctorsSelect) {
      this.sortDoctorsSelect.addEventListener('change', (e) => {
        this.currentSortOrder = e.target.value;
        this.renderDoctors();
      });
    }

    // Booking: Doctor changed
    if (this.bookingDoctorSelect) {
      this.bookingDoctorSelect.addEventListener('change', (e) => {
        this.selectedDoctorId = e.target.value;
        this.selectedTimeSlot = null;
        this.updateDoctorFeeSummary();
        this.renderTimeSlots();
      });
    }

    // Booking: Date changed
    if (this.bookingDateInput) {
      this.bookingDateInput.addEventListener('change', (e) => {
        const dateVal = e.target.value;
        const validation = FormValidator.validateDate(dateVal);
        if (!validation.isValid) {
          FormValidator.showError(this.bookingDateInput, validation.message);
          this.selectedDate = null;
        } else {
          FormValidator.showSuccess(this.bookingDateInput);
          this.selectedDate = dateVal;
        }
        this.selectedTimeSlot = null;
        this.renderTimeSlots();
      });
    }

    // Real-time inline field validation for booking form
    this.setupInlineValidation();

    // Use saved profile button
    if (this.useSavedProfileBtn) {
      this.useSavedProfileBtn.addEventListener('click', () => {
        this.populateBookingFromSavedProfile();
      });
    }

    // Booking Form Submit
    if (this.bookingForm) {
      this.bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleBookingSubmit();
      });
    }

    // Patient Profile Form Submit
    if (this.profileForm) {
      this.profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleProfileSave();
      });
    }

    // Appointment Dashboard Search & Filter Tabs
    if (this.appointmentSearchInput) {
      this.appointmentSearchInput.addEventListener('input', () => {
        this.renderAppointmentsDashboard();
      });
    }

    this.appointmentFilterTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.appointmentFilterTabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentAppointmentTab = e.currentTarget.dataset.tab || 'all';
        this.renderAppointmentsDashboard();
      });
    });

    // Close modals when clicking backdrop or close buttons
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close-btn')) {
          this.closeModal(modal);
        }
      });
    });

    // Escape key closes open modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(m => this.closeModal(m));
      }
    });

    // Reset demo button handler
    const resetDemoBtn = document.getElementById('reset-demo-btn');
    if (resetDemoBtn) {
      resetDemoBtn.addEventListener('click', () => {
        if (confirm('Reset system data to initial sample doctors and appointments?')) {
          StorageService.resetToDefaults();
          this.doctors = StorageService.getDoctors();
          this.appointments = StorageService.getAppointments();
          this.renderSpecializations();
          this.renderDoctors();
          this.populateDoctorSelect();
          this.renderAppointmentsDashboard();
          this.loadSavedPatientData();
          this.showToast('System reset to demo data successfully!', 'success');
        }
      });
    }
  },

  /**
   * Sets minimum date to today and max date to 90 days ahead
   */
  setupDateConstraints() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const max = new Date();
    max.setDate(today.getDate() + 90);
    const maxY = max.getFullYear();
    const maxM = String(max.getMonth() + 1).padStart(2, '0');
    const maxD = String(max.getDate()).padStart(2, '0');
    const maxStr = `${maxY}-${maxM}-${maxD}`;

    if (this.bookingDateInput) {
      this.bookingDateInput.min = todayStr;
      this.bookingDateInput.max = maxStr;
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const tomY = tomorrow.getFullYear();
      const tomM = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const tomD = String(tomorrow.getDate()).padStart(2, '0');
      const defaultDate = `${tomY}-${tomM}-${tomD}`;
      this.bookingDateInput.value = defaultDate;
      this.selectedDate = defaultDate;
    }
  },

  /**
   * Setup real-time blur and input validation listeners
   */
  setupInlineValidation() {
    const fields = [
      { el: this.patientNameInput, validator: (v) => FormValidator.validateName(v) },
      { el: this.patientEmailInput, validator: (v) => FormValidator.validateEmail(v) },
      { el: this.patientPhoneInput, validator: (v) => FormValidator.validatePhone(v) },
      { el: this.patientAgeInput, validator: (v) => FormValidator.validateAge(v) },
      { el: this.patientSymptomsInput, validator: (v) => FormValidator.validateReason(v) },
      { el: this.patientGenderSelect, validator: (v) => FormValidator.validateRequired(v, 'Gender') }
    ];

    fields.forEach(({ el, validator }) => {
      if (!el) return;
      el.addEventListener('blur', () => {
        const res = validator(el.value);
        if (!res.isValid) {
          FormValidator.showError(el, res.message);
        } else {
          FormValidator.showSuccess(el);
        }
      });

      el.addEventListener('input', () => {
        if (el.classList.contains('is-invalid')) {
          const res = validator(el.value);
          if (res.isValid) {
            FormValidator.showSuccess(el);
          }
        }
      });
    });
  },

  /**
   * Render Specializations Grid & Filter Pills
   */
  renderSpecializations() {
    if (!this.specializationsGrid) return;

    this.specializationsGrid.innerHTML = this.specializations.map(spec => `
      <div class="specialization-card" data-spec-id="${spec.id}" role="button" tabindex="0">
        <div class="spec-icon-wrapper ${spec.badgeClass}">
          ${this.getSpecializationIcon(spec.icon)}
        </div>
        <h3 class="spec-title">${spec.name}</h3>
        <p class="spec-desc">${spec.description}</p>
        <div class="spec-footer">
          <span class="spec-count">${spec.count} Specialists</span>
          <span class="spec-arrow">&rarr;</span>
        </div>
      </div>
    `).join('');

    // Specialization card click filter
    this.specializationsGrid.querySelectorAll('.specialization-card').forEach(card => {
      card.addEventListener('click', () => {
        const specId = card.dataset.specId;
        this.filterBySpecialization(specId);
        document.getElementById('doctors').scrollIntoView({ behavior: 'smooth' });
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          card.click();
        }
      });
    });

    // Specialization filter pills in doctors section
    if (this.specializationFilterContainer) {
      let pillsHtml = `<button class="filter-pill active" data-spec="all">All Specialties (${this.doctors.length})</button>`;
      this.specializations.forEach(spec => {
        pillsHtml += `<button class="filter-pill" data-spec="${spec.id}">${spec.name}</button>`;
      });
      this.specializationFilterContainer.innerHTML = pillsHtml;

      this.specializationFilterContainer.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
          this.filterBySpecialization(e.currentTarget.dataset.spec);
        });
      });
    }
  },

  filterBySpecialization(specId) {
    this.currentDoctorFilter = specId;
    if (this.specializationFilterContainer) {
      this.specializationFilterContainer.querySelectorAll('.filter-pill').forEach(p => {
        if (p.dataset.spec === specId) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    }
    this.renderDoctors();
  },

  /**
   * Render Doctors List based on active filters, search, and sort
   */
  renderDoctors() {
    if (!this.doctorsGrid) return;

    let filtered = [...this.doctors];

    // Filter by Specialization
    if (this.currentDoctorFilter !== 'all') {
      filtered = filtered.filter(doc => doc.specializationId === this.currentDoctorFilter);
    }

    // Filter by Search Query
    if (this.currentSearchQuery) {
      const q = this.currentSearchQuery;
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(q) ||
        doc.specializationName.toLowerCase().includes(q) ||
        doc.hospital.toLowerCase().includes(q) ||
        doc.about.toLowerCase().includes(q) ||
        doc.languages.some(lang => lang.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (this.currentSortOrder) {
      case 'rating-high':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience-high':
        filtered.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case 'fee-low':
        filtered.sort((a, b) => a.fee - b.fee);
        break;
      case 'fee-high':
        filtered.sort((a, b) => b.fee - a.fee);
        break;
      default:
        // recommended: combination of rating & experience
        filtered.sort((a, b) => (b.rating * 10 + b.experienceYears) - (a.rating * 10 + a.experienceYears));
        break;
    }

    if (filtered.length === 0) {
      this.doctorsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">&#128269;</div>
          <h3>No Doctors Found</h3>
          <p>We couldn't find any specialist matching "${this.currentSearchQuery}". Try adjusting your search or filter.</p>
          <button class="btn btn-secondary mt-2" onclick="App.resetDoctorFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    this.doctorsGrid.innerHTML = filtered.map(doc => `
      <div class="doctor-card" data-doctor-id="${doc.id}">
        <div class="doctor-card-header">
          <div class="doctor-avatar-wrapper">
            <img src="${doc.avatar}" alt="${doc.name}" class="doctor-avatar" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400';">
            <span class="experience-badge">${doc.experienceYears}+ Yrs Exp</span>
          </div>
          <div class="doctor-meta">
            <span class="doctor-specialty-tag">${doc.specializationName}</span>
            <h3 class="doctor-name">${doc.name}</h3>
            <p class="doctor-qual">${doc.qualification}</p>
            <div class="doctor-rating">
              <span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              <span class="rating-val">${doc.rating}</span>
              <span class="rating-count">(${doc.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        <div class="doctor-card-body">
          <div class="doctor-info-item">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${doc.hospital}</span>
          </div>
          <div class="doctor-info-item">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>Available: ${doc.availableDays.slice(0, 3).join(', ')}${doc.availableDays.length > 3 ? '...' : ''}</span>
          </div>
          <div class="doctor-fee-row">
            <span class="fee-label">Consultation Fee</span>
            <span class="fee-amount">$${doc.fee}</span>
          </div>
        </div>

        <div class="doctor-card-actions">
          <button class="btn btn-outline-primary btn-sm view-doc-btn" data-id="${doc.id}">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            View Profile
          </button>
          <button class="btn btn-primary btn-sm book-doc-btn" data-id="${doc.id}">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Book Visit
          </button>
        </div>
      </div>
    `).join('');

    // Attach card action listeners
    this.doctorsGrid.querySelectorAll('.view-doc-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openDoctorModal(btn.dataset.id);
      });
    });

    this.doctorsGrid.querySelectorAll('.book-doc-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.startBookingForDoctor(btn.dataset.id);
      });
    });
  },

  resetDoctorFilters() {
    this.currentDoctorFilter = 'all';
    this.currentSearchQuery = '';
    this.currentSortOrder = 'recommended';
    if (this.doctorSearchInput) this.doctorSearchInput.value = '';
    if (this.sortDoctorsSelect) this.sortDoctorsSelect.value = 'recommended';
    if (this.specializationFilterContainer) {
      this.specializationFilterContainer.querySelectorAll('.filter-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.spec === 'all');
      });
    }
    this.renderDoctors();
  },

  /**
   * Populate Doctor Select Dropdown in Booking Section
   */
  populateDoctorSelect() {
    if (!this.bookingDoctorSelect) return;

    let options = '<option value="">-- Choose a Doctor or Specialist --</option>';
    this.doctors.forEach(doc => {
      options += `<option value="${doc.id}">${doc.name} - ${doc.specializationName} ($${doc.fee})</option>`;
    });
    this.bookingDoctorSelect.innerHTML = options;

    if (this.doctors.length > 0 && !this.selectedDoctorId) {
      this.selectedDoctorId = this.doctors[0].id;
      this.bookingDoctorSelect.value = this.selectedDoctorId;
      this.updateDoctorFeeSummary();
      this.renderTimeSlots();
    }
  },

  /**
   * Pre-select doctor and scroll smoothly to booking form
   */
  startBookingForDoctor(doctorId) {
    this.selectedDoctorId = doctorId;
    if (this.bookingDoctorSelect) {
      this.bookingDoctorSelect.value = doctorId;
    }
    this.updateDoctorFeeSummary();
    this.renderTimeSlots();

    const bookingSec = document.getElementById('booking');
    if (bookingSec) {
      bookingSec.scrollIntoView({ behavior: 'smooth' });
    }
    this.showToast(`Selected Dr. ${this.getDoctor(doctorId).name}. Please choose your date & time slot.`, 'info');
  },

  getDoctor(id) {
    return this.doctors.find(d => d.id === id) || null;
  },

  /**
   * Updates fee summary cards in booking form
   */
  updateDoctorFeeSummary() {
    const doc = this.getDoctor(this.selectedDoctorId);
    if (!doc) {
      if (this.summaryDoctorName) this.summaryDoctorName.textContent = 'Select a doctor';
      if (this.summaryDoctorFee) this.summaryDoctorFee.textContent = '$0.00';
      if (this.summaryTotalFee) this.summaryTotalFee.textContent = '$0.00';
      return;
    }

    const baseFee = doc.fee;
    const bookingFee = 5.00;
    const total = baseFee + bookingFee;

    if (this.summaryDoctorName) this.summaryDoctorName.textContent = `${doc.name} (${doc.specializationName})`;
    if (this.summaryDoctorFee) this.summaryDoctorFee.textContent = `$${baseFee.toFixed(2)}`;
    if (this.summaryTotalFee) this.summaryTotalFee.textContent = `$${total.toFixed(2)}`;
  },

  /**
   * Render Time Slots based on chosen doctor and selected date
   */
  renderTimeSlots() {
    if (!this.timeSlotsContainer) return;

    const doc = this.getDoctor(this.selectedDoctorId);
    if (!doc || !this.selectedDate) {
      this.timeSlotsContainer.innerHTML = `
        <div class="slot-placeholder">
          <p>Please select a doctor and appointment date to view available time slots.</p>
        </div>
      `;
      return;
    }

    // Check doctor's day availability
    const selectedDateObj = new Date(this.selectedDate + 'T00:00:00');
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const chosenDayName = dayNames[selectedDateObj.getDay()];

    if (!doc.availableDays.includes(chosenDayName)) {
      this.timeSlotsContainer.innerHTML = `
        <div class="slot-warning">
          <svg class="warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>Dr. ${doc.name.replace('Dr. ', '')} is not available on ${chosenDayName}s.</strong>
            <p>Usual consultation days: ${doc.availableDays.join(', ')}. Please select an alternate day.</p>
          </div>
        </div>
      `;
      return;
    }

    // Get slots already booked for this doctor on this date
    const bookedSlots = StorageService.getBookedSlots(doc.id, this.selectedDate);

    // Group into Morning, Afternoon, Evening
    const morningSlots = [];
    const afternoonSlots = [];
    const eveningSlots = [];

    doc.timeSlots.forEach(slot => {
      const isBooked = bookedSlots.includes(slot);
      const isSelected = this.selectedTimeSlot === slot;

      const slotObj = {
        time: slot,
        isBooked,
        isSelected
      };

      if (slot.includes('AM')) {
        morningSlots.push(slotObj);
      } else {
        const hour = parseInt(slot.split(':')[0], 10);
        if (hour < 5 || hour === 12) {
          afternoonSlots.push(slotObj);
        } else {
          eveningSlots.push(slotObj);
        }
      }
    });

    const renderSlotGroup = (title, slots, icon) => {
      if (slots.length === 0) return '';
      return `
        <div class="slot-group">
          <h4 class="slot-group-header">
            <span>${icon}</span> ${title}
          </h4>
          <div class="slot-buttons-grid">
            ${slots.map(s => `
              <button type="button" 
                      class="slot-btn ${s.isBooked ? 'slot-booked' : ''} ${s.isSelected ? 'slot-active' : ''}" 
                      ${s.isBooked ? 'disabled title="Slot already booked by another patient"' : ''}
                      data-slot="${s.time}">
                ${s.time}
                ${s.isBooked ? '<span class="booked-tag">Booked</span>' : ''}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    };

    let html = `
      <div class="slots-wrapper">
        <p class="slots-info-text">
          Available consultation slots for <strong>${chosenDayName}, ${this.selectedDate}</strong>:
        </p>
        ${renderSlotGroup('Morning Sessions', morningSlots, '&#9728;&#65039;')}
        ${renderSlotGroup('Afternoon Sessions', afternoonSlots, '&#9925;')}
        ${renderSlotGroup('Evening Sessions', eveningSlots, '&#127769;')}
      </div>
    `;

    this.timeSlotsContainer.innerHTML = html;

    // Attach slot selection listeners
    this.timeSlotsContainer.querySelectorAll('.slot-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.timeSlotsContainer.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('slot-active'));
        e.currentTarget.classList.add('slot-active');
        this.selectedTimeSlot = e.currentTarget.dataset.slot;
      });
    });
  },

  /**
   * Handle Booking Submission with strict validation
   */
  handleBookingSubmit() {
    FormValidator.clearAll(this.bookingForm);

    let hasErrors = false;

    // Doctor selection
    if (!this.selectedDoctorId) {
      FormValidator.showError(this.bookingDoctorSelect, 'Please select a healthcare doctor.');
      hasErrors = true;
    }

    // Date validation
    const dateVal = FormValidator.validateDate(this.bookingDateInput.value);
    if (!dateVal.isValid) {
      FormValidator.showError(this.bookingDateInput, dateVal.message);
      hasErrors = true;
    }

    // Time slot validation
    if (!this.selectedTimeSlot) {
      this.showToast('Please select an available time slot for your consultation.', 'error');
      if (this.timeSlotsContainer) {
        this.timeSlotsContainer.classList.add('slot-error-highlight');
        setTimeout(() => this.timeSlotsContainer.classList.remove('slot-error-highlight'), 2000);
      }
      hasErrors = true;
    }

    // Patient Fields
    const nameVal = FormValidator.validateName(this.patientNameInput.value);
    if (!nameVal.isValid) {
      FormValidator.showError(this.patientNameInput, nameVal.message);
      hasErrors = true;
    }

    const emailVal = FormValidator.validateEmail(this.patientEmailInput.value);
    if (!emailVal.isValid) {
      FormValidator.showError(this.patientEmailInput, emailVal.message);
      hasErrors = true;
    }

    const phoneVal = FormValidator.validatePhone(this.patientPhoneInput.value);
    if (!phoneVal.isValid) {
      FormValidator.showError(this.patientPhoneInput, phoneVal.message);
      hasErrors = true;
    }

    const ageVal = FormValidator.validateAge(this.patientAgeInput.value);
    if (!ageVal.isValid) {
      FormValidator.showError(this.patientAgeInput, ageVal.message);
      hasErrors = true;
    }

    const genderVal = FormValidator.validateRequired(this.patientGenderSelect.value, 'Gender');
    if (!genderVal.isValid) {
      FormValidator.showError(this.patientGenderSelect, genderVal.message);
      hasErrors = true;
    }

    const symptomsVal = FormValidator.validateReason(this.patientSymptomsInput.value);
    if (!symptomsVal.isValid) {
      FormValidator.showError(this.patientSymptomsInput, symptomsVal.message);
      hasErrors = true;
    }

    if (hasErrors) {
      this.showToast('Please resolve the errors highlighted in red.', 'error');
      return;
    }

    // Double check slot availability
    const bookedSlots = StorageService.getBookedSlots(this.selectedDoctorId, this.bookingDateInput.value);
    if (bookedSlots.includes(this.selectedTimeSlot)) {
      this.showToast('Sorry! That time slot was just booked. Please pick an alternate time.', 'warning');
      this.renderTimeSlots();
      return;
    }

    const doctor = this.getDoctor(this.selectedDoctorId);
    let consultationType = 'In-Person';
    const checkedRadio = document.querySelector('input[name="consultation-type"]:checked');
    if (checkedRadio) {
      consultationType = checkedRadio.value;
    }

    const appointmentPayload = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specializationName,
      doctorHospital: doctor.hospital,
      doctorFee: doctor.fee,
      patientName: this.patientNameInput.value.trim(),
      patientEmail: this.patientEmailInput.value.trim(),
      patientPhone: this.patientPhoneInput.value.trim(),
      patientAge: Number(this.patientAgeInput.value),
      patientGender: this.patientGenderSelect.value,
      patientBloodGroup: this.patientBloodGroupSelect.value || 'Not Disclosed',
      appointmentDate: this.bookingDateInput.value,
      appointmentTime: this.selectedTimeSlot,
      consultationType: consultationType,
      reasonForVisit: this.patientSymptomsInput.value.trim()
    };

    // Save profile if checked
    if (this.saveProfileCheckbox && this.saveProfileCheckbox.checked) {
      StorageService.savePatientProfile({
        fullName: appointmentPayload.patientName,
        email: appointmentPayload.patientEmail,
        phone: appointmentPayload.patientPhone,
        age: appointmentPayload.patientAge,
        gender: appointmentPayload.patientGender,
        bloodGroup: appointmentPayload.patientBloodGroup
      });
    }

    // Save to storage
    const created = StorageService.saveAppointment(appointmentPayload);
    this.appointments = StorageService.getAppointments();

    // Show Confirmation Ticket Modal
    this.openConfirmationModal(created);

    // Refresh UI
    this.renderAppointmentsDashboard();
    this.renderTimeSlots();
    this.showToast('Appointment successfully confirmed!', 'success');
  },

  /**
   * Confirmation Ticket Modal
   */
  openConfirmationModal(appointment) {
    if (!this.confirmationModal) return;

    const modalBody = this.confirmationModal.querySelector('.modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="ticket-wrapper" id="printable-ticket">
          <div class="ticket-badge-banner">
            <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            <span>BOOKING CONFIRMED</span>
          </div>

          <div class="ticket-header">
            <div>
              <h2 class="ticket-clinic-title">MediConnect Health System</h2>
              <p class="ticket-sub">Official Digital Appointment Receipt</p>
            </div>
            <div class="ticket-id-tag">
              <span>Booking ID:</span>
              <strong>${appointment.id}</strong>
            </div>
          </div>

          <div class="ticket-body-grid">
            <div class="ticket-section">
              <span class="ticket-label">Doctor & Specialty</span>
              <p class="ticket-val-doctor">${appointment.doctorName}</p>
              <span class="ticket-specialty-pill">${appointment.doctorSpecialization}</span>
              <p class="ticket-val-hospital">&#128205; ${appointment.doctorHospital}</p>
            </div>

            <div class="ticket-section">
              <span class="ticket-label">Schedule & Mode</span>
              <p class="ticket-val-time">&#128197; ${this.formatDisplayDate(appointment.appointmentDate)}</p>
              <p class="ticket-val-slot">&#9200; ${appointment.appointmentTime}</p>
              <span class="mode-pill">${appointment.consultationType} Consultation</span>
            </div>

            <div class="ticket-section">
              <span class="ticket-label">Patient Details</span>
              <p class="ticket-val-patient">${appointment.patientName}</p>
              <p class="ticket-sub">${appointment.patientGender}, ${appointment.patientAge} yrs | Blood: ${appointment.patientBloodGroup}</p>
              <p class="ticket-sub">&#9993; ${appointment.patientEmail} | &#128222; ${appointment.patientPhone}</p>
            </div>

            <div class="ticket-section">
              <span class="ticket-label">Reason / Symptoms</span>
              <p class="ticket-reason-box">${appointment.reasonForVisit}</p>
              <div class="ticket-fee-pill">
                <span>Total Amount:</span>
                <strong>$${(appointment.doctorFee + 5).toFixed(2)} USD (Paid / Verified)</strong>
              </div>
            </div>
          </div>

          <div class="ticket-qr-footer">
            <div class="qr-box">
              ${this.generateMockQRSvg(appointment.id)}
            </div>
            <div class="qr-instructions">
              <p>Present this digital slip or QR code at clinic reception desk 15 minutes before your scheduled appointment.</p>
              <span class="timestamp-small">Issued: ${new Date(appointment.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="ticket-actions mt-3">
          <button class="btn btn-outline-primary" onclick="window.print()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print Slip / Save PDF
          </button>
          <button class="btn btn-primary" onclick="App.closeConfirmationAndGoToDashboard()">
            View In Dashboard &rarr;
          </button>
        </div>
      `;
    }

    this.openModal(this.confirmationModal);
  },

  closeConfirmationAndGoToDashboard() {
    this.closeModal(this.confirmationModal);
    const dash = document.getElementById('appointments');
    if (dash) {
      dash.scrollIntoView({ behavior: 'smooth' });
    }
  },

  /**
   * Render Appointments Dashboard & Statistics
   */
  renderAppointmentsDashboard() {
    if (!this.appointmentsListContainer) return;

    this.appointments = StorageService.getAppointments();

    // Calculate stats
    const totalCount = this.appointments.length;
    const upcomingCount = this.appointments.filter(a => a.status === 'Upcoming').length;
    const completedCount = this.appointments.filter(a => a.status === 'Completed').length;
    const cancelledCount = this.appointments.filter(a => a.status === 'Cancelled').length;

    if (this.statTotal) this.statTotal.textContent = totalCount;
    if (this.statUpcoming) this.statUpcoming.textContent = upcomingCount;
    if (this.statCompleted) this.statCompleted.textContent = completedCount;
    if (this.statCancelled) this.statCancelled.textContent = cancelledCount;

    // Filter by tab
    let filtered = [...this.appointments];
    if (this.currentAppointmentTab !== 'all') {
      filtered = filtered.filter(a => a.status.toLowerCase() === this.currentAppointmentTab.toLowerCase());
    }

    // Search filter
    if (this.appointmentSearchInput && this.appointmentSearchInput.value.trim()) {
      const q = this.appointmentSearchInput.value.toLowerCase().trim();
      filtered = filtered.filter(a =>
        a.id.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.doctorSpecialization.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      this.appointmentsListContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">&#128197;</div>
          <h3>No Appointments Found</h3>
          <p>No appointments match the selected filter criteria.</p>
          <button class="btn btn-primary btn-sm mt-2" onclick="document.getElementById('booking').scrollIntoView({behavior: 'smooth'})">
            Book an Appointment Now
          </button>
        </div>
      `;
      return;
    }

    this.appointmentsListContainer.innerHTML = filtered.map(apt => {
      const isUpcoming = apt.status === 'Upcoming';
      const isCancelled = apt.status === 'Cancelled';
      const isCompleted = apt.status === 'Completed';

      let statusBadgeClass = 'badge-upcoming';
      if (isCompleted) statusBadgeClass = 'badge-completed';
      if (isCancelled) statusBadgeClass = 'badge-cancelled';

      return `
        <div class="appointment-card ${isCancelled ? 'card-cancelled' : ''}">
          <div class="apt-card-top">
            <div class="apt-id-wrapper">
              <span class="apt-id">${apt.id}</span>
              <span class="apt-status-badge ${statusBadgeClass}">${apt.status}</span>
            </div>
            <span class="apt-type-tag">${apt.consultationType}</span>
          </div>

          <div class="apt-card-grid">
            <div class="apt-info-block">
              <span class="apt-info-label">Doctor</span>
              <p class="apt-info-doc">${apt.doctorName}</p>
              <span class="apt-specialty">${apt.doctorSpecialization}</span>
              <small class="apt-hospital">&#128205; ${apt.doctorHospital}</small>
            </div>

            <div class="apt-info-block">
              <span class="apt-info-label">Date & Time</span>
              <p class="apt-info-date">&#128197; ${this.formatDisplayDate(apt.appointmentDate)}</p>
              <p class="apt-info-time">&#9200; ${apt.appointmentTime}</p>
              <span class="apt-fee-tag">Fee: $${(apt.doctorFee + 5).toFixed(2)}</span>
            </div>

            <div class="apt-info-block">
              <span class="apt-info-label">Patient</span>
              <p class="apt-info-patient">${apt.patientName}</p>
              <small class="apt-contact">${apt.patientPhone} | ${apt.patientEmail}</small>
              <small class="apt-notes"><strong>Notes:</strong> ${apt.reasonForVisit.slice(0, 50)}${apt.reasonForVisit.length > 50 ? '...' : ''}</small>
              ${apt.cancelReason ? `<div class="apt-cancel-notice">Reason: ${apt.cancelReason}</div>` : ''}
            </div>
          </div>

          <div class="apt-card-actions">
            <button class="btn btn-outline-secondary btn-sm" onclick="App.openTicketModal('${apt.id}')">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              View Receipt
            </button>
            ${isUpcoming ? `
              <button class="btn btn-outline-primary btn-sm" onclick="App.openRescheduleModal('${apt.id}')">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Reschedule
              </button>
              <button class="btn btn-outline-danger btn-sm" onclick="App.openCancelModal('${apt.id}')">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Cancel
              </button>
              <button class="btn btn-success-subtle btn-sm" onclick="App.markCompleted('${apt.id}')" title="Mark as completed">
                &#10003; Complete
              </button>
            ` : ''}
            ${(isCancelled || isCompleted) ? `
              <button class="btn btn-outline-danger btn-sm" onclick="App.deleteAppointment('${apt.id}')" title="Remove record">
                &#128465; Delete
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  openTicketModal(id) {
    const apt = StorageService.getAppointmentById(id);
    if (!apt) return;
    this.openConfirmationModal(apt);
  },

  /**
   * Reschedule Appointment Modal Flow
   */
  openRescheduleModal(id) {
    const apt = StorageService.getAppointmentById(id);
    if (!apt) return;

    const doc = this.getDoctor(apt.doctorId);
    const modalBody = this.rescheduleModal.querySelector('.modal-body');
    const today = new Date().toISOString().split('T')[0];

    modalBody.innerHTML = `
      <div class="reschedule-box">
        <p>Rescheduling appointment <strong>${apt.id}</strong> with <strong>${apt.doctorName}</strong>.</p>
        <div class="form-group mt-2">
          <label class="form-label" for="reschedule-date">Select New Date</label>
          <input type="date" id="reschedule-date" class="form-control" min="${today}" value="${apt.appointmentDate}">
        </div>
        <div class="form-group mt-2">
          <label class="form-label">Select New Time Slot</label>
          <div id="reschedule-slots" class="slot-buttons-grid"></div>
        </div>
      </div>
      <div class="modal-footer mt-3">
        <button class="btn btn-secondary" onclick="App.closeModal(App.rescheduleModal)">Cancel</button>
        <button class="btn btn-primary" id="confirm-reschedule-btn" disabled>Confirm Reschedule</button>
      </div>
    `;

    const reschedDateInput = modalBody.querySelector('#reschedule-date');
    const slotsContainer = modalBody.querySelector('#reschedule-slots');
    const confirmBtn = modalBody.querySelector('#confirm-reschedule-btn');
    let selectedSlot = null;

    const updateSlots = () => {
      const dateVal = reschedDateInput.value;
      if (!dateVal) return;

      const bookedSlots = StorageService.getBookedSlots(apt.doctorId, dateVal);
      slotsContainer.innerHTML = (doc ? doc.timeSlots : ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']).map(slot => {
        const isBooked = bookedSlots.includes(slot) && !(dateVal === apt.appointmentDate && slot === apt.appointmentTime);
        return `
          <button type="button" class="slot-btn ${isBooked ? 'slot-booked' : ''}" ${isBooked ? 'disabled' : ''} data-slot="${slot}">
            ${slot}
          </button>
        `;
      }).join('');

      slotsContainer.querySelectorAll('.slot-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
          slotsContainer.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('slot-active'));
          btn.classList.add('slot-active');
          selectedSlot = btn.dataset.slot;
          confirmBtn.disabled = false;
        });
      });
    };

    reschedDateInput.addEventListener('change', () => {
      selectedSlot = null;
      confirmBtn.disabled = true;
      updateSlots();
    });

    confirmBtn.addEventListener('click', () => {
      if (!selectedSlot) return;
      StorageService.rescheduleAppointment(apt.id, reschedDateInput.value, selectedSlot);
      this.closeModal(this.rescheduleModal);
      this.renderAppointmentsDashboard();
      this.renderTimeSlots();
      this.showToast(`Appointment successfully rescheduled to ${reschedDateInput.value} at ${selectedSlot}.`, 'success');
    });

    updateSlots();
    this.openModal(this.rescheduleModal);
  },

  /**
   * Cancel Appointment Modal Flow
   */
  openCancelModal(id) {
    const apt = StorageService.getAppointmentById(id);
    if (!apt) return;

    const modalBody = this.cancelConfirmModal.querySelector('.modal-body');
    modalBody.innerHTML = `
      <div class="cancel-modal-content">
        <div class="warning-badge-icon">&#9888;</div>
        <h3>Cancel Appointment?</h3>
        <p>Are you sure you want to cancel booking <strong>${apt.id}</strong> with <strong>${apt.doctorName}</strong> on <strong>${apt.appointmentDate}</strong> at <strong>${apt.appointmentTime}</strong>?</p>
        <div class="form-group text-left mt-2">
          <label class="form-label" for="cancel-reason-input">Reason for cancellation (optional):</label>
          <select id="cancel-reason-select" class="form-control mb-2">
            <option value="Schedule conflict / Personal emergency">Schedule conflict / Personal emergency</option>
            <option value="Symptoms resolved / Feeling better">Symptoms resolved / Feeling better</option>
            <option value="Found alternative healthcare provider">Found alternative healthcare provider</option>
            <option value="Cost / Insurance issue">Cost / Insurance issue</option>
            <option value="Other reason">Other reason</option>
          </select>
        </div>
      </div>
      <div class="modal-footer mt-3">
        <button class="btn btn-secondary" onclick="App.closeModal(App.cancelConfirmModal)">Keep Appointment</button>
        <button class="btn btn-danger" id="confirm-cancel-btn">Yes, Cancel Appointment</button>
      </div>
    `;

    const confirmBtn = modalBody.querySelector('#confirm-cancel-btn');
    confirmBtn.addEventListener('click', () => {
      const reason = modalBody.querySelector('#cancel-reason-select').value;
      StorageService.cancelAppointment(apt.id, reason);
      this.closeModal(this.cancelConfirmModal);
      this.renderAppointmentsDashboard();
      this.renderTimeSlots();
      this.showToast('Appointment has been cancelled.', 'info');
    });

    this.openModal(this.cancelConfirmModal);
  },

  markCompleted(id) {
    StorageService.updateAppointment(id, { status: 'Completed' });
    this.renderAppointmentsDashboard();
    this.showToast(`Appointment ${id} marked as completed.`, 'success');
  },

  deleteAppointment(id) {
    if (confirm(`Permanently remove record ${id}?`)) {
      StorageService.deleteAppointment(id);
      this.renderAppointmentsDashboard();
      this.showToast('Record removed.', 'info');
    }
  },

  /**
   * Doctor Details Modal
   */
  openDoctorModal(doctorId) {
    const doc = this.getDoctor(doctorId);
    if (!doc || !this.doctorModal) return;

    const modalBody = this.doctorModal.querySelector('.modal-body');
    modalBody.innerHTML = `
      <div class="doc-modal-header">
        <img src="${doc.avatar}" alt="${doc.name}" class="doc-modal-avatar">
        <div>
          <span class="doctor-specialty-tag">${doc.specializationName}</span>
          <h2>${doc.name}</h2>
          <p class="text-muted">${doc.qualification}</p>
          <div class="doctor-rating mt-1">
            <span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <strong>${doc.rating}</strong> (${doc.reviewCount} verified patient reviews)
          </div>
        </div>
      </div>

      <div class="doc-modal-details mt-3">
        <h4>About the Specialist</h4>
        <p class="doc-modal-bio">${doc.about}</p>

        <div class="doc-info-grid mt-2">
          <div class="info-cell">
            <span class="cell-label">Clinical Experience</span>
            <strong>${doc.experienceYears} Years</strong>
          </div>
          <div class="info-cell">
            <span class="cell-label">Consultation Fee</span>
            <strong class="text-primary">$${doc.fee} USD</strong>
          </div>
          <div class="info-cell">
            <span class="cell-label">Affiliated Hospital</span>
            <strong>${doc.hospital}</strong>
          </div>
          <div class="info-cell">
            <span class="cell-label">Languages Spoken</span>
            <strong>${doc.languages.join(', ')}</strong>
          </div>
        </div>

        <h4 class="mt-3">Weekly Consultation Schedule</h4>
        <div class="days-pills-list">
          ${doc.availableDays.map(day => `<span class="day-pill">${day}</span>`).join('')}
        </div>
      </div>

      <div class="modal-footer mt-4">
        <button class="btn btn-secondary" onclick="App.closeModal(App.doctorModal)">Close</button>
        <button class="btn btn-primary" onclick="App.closeModal(App.doctorModal); App.startBookingForDoctor('${doc.id}')">
          Book Appointment with ${doc.name.split(' ')[1]}
        </button>
      </div>
    `;

    this.openModal(this.doctorModal);
  },

  /**
   * Patient Profile Tab / Storage
   */
  loadSavedPatientData() {
    const profile = StorageService.getPatientProfile();
    if (!profile) return;

    if (this.profileForm) {
      if (document.getElementById('profile-name')) document.getElementById('profile-name').value = profile.fullName || '';
      if (document.getElementById('profile-email')) document.getElementById('profile-email').value = profile.email || '';
      if (document.getElementById('profile-phone')) document.getElementById('profile-phone').value = profile.phone || '';
      if (document.getElementById('profile-age')) document.getElementById('profile-age').value = profile.age || '';
      if (document.getElementById('profile-gender')) document.getElementById('profile-gender').value = profile.gender || 'Male';
      if (document.getElementById('profile-blood-group')) document.getElementById('profile-blood-group').value = profile.bloodGroup || 'O+';
      if (document.getElementById('profile-address')) document.getElementById('profile-address').value = profile.address || '';
      if (document.getElementById('profile-history')) document.getElementById('profile-history').value = profile.medicalHistory || '';
    }
  },

  populateBookingFromSavedProfile() {
    const profile = StorageService.getPatientProfile();
    if (!profile) {
      this.showToast('No saved profile found. Please fill in your details below.', 'info');
      return;
    }

    if (this.patientNameInput) this.patientNameInput.value = profile.fullName || '';
    if (this.patientEmailInput) this.patientEmailInput.value = profile.email || '';
    if (this.patientPhoneInput) this.patientPhoneInput.value = profile.phone || '';
    if (this.patientAgeInput) this.patientAgeInput.value = profile.age || '';
    if (this.patientGenderSelect) this.patientGenderSelect.value = profile.gender || 'Male';
    if (this.patientBloodGroupSelect) this.patientBloodGroupSelect.value = profile.bloodGroup || 'O+';

    FormValidator.clearAll(this.bookingForm);
    this.showToast('Patient profile autofilled successfully!', 'success');
  },

  handleProfileSave() {
    const name = document.getElementById('profile-name');
    const email = document.getElementById('profile-email');
    const phone = document.getElementById('profile-phone');
    const age = document.getElementById('profile-age');
    const gender = document.getElementById('profile-gender');
    const blood = document.getElementById('profile-blood-group');
    const address = document.getElementById('profile-address');
    const history = document.getElementById('profile-history');

    const nameVal = FormValidator.validateName(name.value);
    const emailVal = FormValidator.validateEmail(email.value);
    const phoneVal = FormValidator.validatePhone(phone.value);
    const ageVal = FormValidator.validateAge(age.value);

    let hasErrors = false;
    if (!nameVal.isValid) { FormValidator.showError(name, nameVal.message); hasErrors = true; } else { FormValidator.showSuccess(name); }
    if (!emailVal.isValid) { FormValidator.showError(email, emailVal.message); hasErrors = true; } else { FormValidator.showSuccess(email); }
    if (!phoneVal.isValid) { FormValidator.showError(phone, phoneVal.message); hasErrors = true; } else { FormValidator.showSuccess(phone); }
    if (!ageVal.isValid) { FormValidator.showError(age, ageVal.message); hasErrors = true; } else { FormValidator.showSuccess(age); }

    if (hasErrors) {
      this.showToast('Please fix profile validation errors.', 'error');
      return;
    }

    const updated = {
      fullName: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      age: Number(age.value),
      gender: gender.value,
      bloodGroup: blood.value,
      address: address ? address.value.trim() : '',
      medicalHistory: history ? history.value.trim() : ''
    };

    StorageService.savePatientProfile(updated);
    this.showToast('Patient profile details saved to localStorage!', 'success');
  },

  /**
   * Modal helper methods
   */
  openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  },

  closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  },

  /**
   * Toast notification system
   */
  showToast(message, type = 'info', duration = 3500) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    let icon = '&#8505;&#65039;';
    if (type === 'success') icon = '&#10004;&#65039;';
    if (type === 'error') icon = '&#9888;&#65039;';
    if (type === 'warning') icon = '&#9888;&#65039;';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * Helper formatting
   */
  formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  generateMockQRSvg(code) {
    return `
      <svg class="qr-svg" viewBox="0 0 100 100" fill="currentColor">
        <rect x="0" y="0" width="30" height="30" fill="#0f172a"/>
        <rect x="5" y="5" width="20" height="20" fill="#ffffff"/>
        <rect x="10" y="10" width="10" height="10" fill="#0f172a"/>

        <rect x="70" y="0" width="30" height="30" fill="#0f172a"/>
        <rect x="75" y="5" width="20" height="20" fill="#ffffff"/>
        <rect x="80" y="10" width="10" height="10" fill="#0f172a"/>

        <rect x="0" y="70" width="30" height="30" fill="#0f172a"/>
        <rect x="5" y="75" width="20" height="20" fill="#ffffff"/>
        <rect x="10" y="80" width="10" height="10" fill="#0f172a"/>

        <rect x="40" y="10" width="10" height="20" fill="#0f172a"/>
        <rect x="20" y="40" width="20" height="10" fill="#0f172a"/>
        <rect x="50" y="40" width="30" height="10" fill="#0f172a"/>
        <rect x="40" y="60" width="15" height="15" fill="#0f172a"/>
        <rect x="65" y="65" width="25" height="15" fill="#0f172a"/>
        <rect x="45" y="85" width="15" height="15" fill="#0f172a"/>
        <rect x="80" y="40" width="10" height="10" fill="#0f172a"/>
      </svg>
    `;
  },

  getSpecializationIcon(iconName) {
    switch (iconName) {
      case 'heart-pulse':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
      case 'sparkles':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;
      case 'baby':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>`;
      case 'brain':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/></svg>`;
      case 'bone':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 10c.7-.7 1.6-1 2.5-1a3.5 3.5 0 1 1 0 7c-.9 0-1.8-.3-2.5-1l-10 4c-.7.7-1 1.6-1 2.5a3.5 3.5 0 1 1-7 0c0-.9.3-1.8 1-2.5l4-10c-.7-.7-1-1.6-1-2.5a3.5 3.5 0 1 1 7 0c0 .9-.3 1.8-1 2.5l10-4Z"/></svg>`;
      case 'stethoscope':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3"/><path d="M9 12v3a5 5 0 0 0 10 0v-2"/><circle cx="19" cy="10" r="2"/></svg>`;
      case 'shield-plus':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>`;
      case 'smile':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }
  }
};
