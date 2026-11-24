/**
 * Healthcare Appointment Booking System - Storage Management
 * Handles persistent data operations using Web Storage API (localStorage)
 */

const StorageKeys = {
  DOCTORS: 'medicare_doctors_v1',
  APPOINTMENTS: 'medicare_appointments_v1',
  PATIENT_PROFILE: 'medicare_patient_profile_v1',
  SYSTEM_INIT: 'medicare_system_initialized_v1'
};

const StorageService = {
  /**
   * Initializes local storage with seed data if not previously initialized
   */
  init() {
    try {
      if (!localStorage.getItem(StorageKeys.SYSTEM_INIT)) {
        this.resetToDefaults();
      }
    } catch (e) {
      console.warn('LocalStorage access warning, fallback to memory', e);
    }
  },

  /**
   * Resets local storage to default seed data
   */
  resetToDefaults() {
    localStorage.setItem(StorageKeys.DOCTORS, JSON.stringify(DOCTORS_DATA));
    localStorage.setItem(StorageKeys.APPOINTMENTS, JSON.stringify(SEED_APPOINTMENTS));
    localStorage.setItem(StorageKeys.PATIENT_PROFILE, JSON.stringify({
      fullName: 'Robert Martinez',
      email: 'robert.m@example.com',
      phone: '(555) 819-2034',
      age: 45,
      gender: 'Male',
      bloodGroup: 'O+',
      emergencyContact: '+1 (555) 992-1049',
      address: '742 Evergreen Terrace, Springfield',
      medicalHistory: 'Mild hypertension managed with low sodium diet.'
    }));
    localStorage.setItem(StorageKeys.SYSTEM_INIT, 'true');
  },

  /**
   * Doctors operations
   */
  getDoctors() {
    try {
      const data = localStorage.getItem(StorageKeys.DOCTORS);
      return data ? JSON.parse(data) : DOCTORS_DATA;
    } catch (e) {
      return DOCTORS_DATA;
    }
  },

  getDoctorById(id) {
    const doctors = this.getDoctors();
    return doctors.find(doc => doc.id === id) || null;
  },

  getSpecializations() {
    return SPECIALIZATIONS_DATA;
  },

  /**
   * Appointments operations
   */
  getAppointments() {
    try {
      const data = localStorage.getItem(StorageKeys.APPOINTMENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  getAppointmentById(id) {
    const list = this.getAppointments();
    return list.find(item => item.id === id) || null;
  },

  /**
   * Saves a new appointment
   * @param {Object} appointmentData 
   * @returns {Object} Saved appointment with generated ID
   */
  saveAppointment(appointmentData) {
    const list = this.getAppointments();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newAppointment = {
      id: `APT-${new Date().getFullYear()}-${randomNum}`,
      status: 'Upcoming',
      createdAt: new Date().toISOString(),
      ...appointmentData
    };
    list.unshift(newAppointment);
    localStorage.setItem(StorageKeys.APPOINTMENTS, JSON.stringify(list));
    return newAppointment;
  },

  /**
   * Updates an existing appointment
   */
  updateAppointment(id, updates) {
    const list = this.getAppointments();
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(StorageKeys.APPOINTMENTS, JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  /**
   * Marks appointment as cancelled
   */
  cancelAppointment(id, reason = 'Cancelled by user') {
    return this.updateAppointment(id, {
      status: 'Cancelled',
      cancelReason: reason
    });
  },

  /**
   * Reschedules an appointment
   */
  rescheduleAppointment(id, newDate, newTime) {
    return this.updateAppointment(id, {
      appointmentDate: newDate,
      appointmentTime: newTime,
      rescheduledAt: new Date().toISOString()
    });
  },

  /**
   * Deletes an appointment permanently
   */
  deleteAppointment(id) {
    let list = this.getAppointments();
    list = list.filter(item => item.id !== id);
    localStorage.setItem(StorageKeys.APPOINTMENTS, JSON.stringify(list));
    return true;
  },

  /**
   * Returns list of booked times for a doctor on a given date (to disable slots)
   */
  getBookedSlots(doctorId, dateString) {
    const appointments = this.getAppointments();
    return appointments
      .filter(apt => apt.doctorId === doctorId && 
                     apt.appointmentDate === dateString && 
                     apt.status !== 'Cancelled')
      .map(apt => apt.appointmentTime);
  },

  /**
   * Patient profile operations
   */
  getPatientProfile() {
    try {
      const data = localStorage.getItem(StorageKeys.PATIENT_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  savePatientProfile(profile) {
    localStorage.setItem(StorageKeys.PATIENT_PROFILE, JSON.stringify(profile));
    return profile;
  }
};

// Auto-run init
StorageService.init();
