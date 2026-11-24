# MediConnect - Healthcare Appointment Booking System

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![LocalStorage](https://img.shields.io/badge/LocalStorage-Web_Storage_API-0284c7?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Responsive-Mobile_Friendly-10b981?style=for-the-badge)

A complete, enterprise-grade **Healthcare Appointment Booking System** built from the ground up using modern semantic **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)**. Designed for outpatient clinics, hospitals, and telemedicine platforms as part of a Virtual Internship Capstone Project.

---

## Table of Contents
1. [Key Features](#-key-features)
2. [Live Screenshots](#-live-screenshots)
3. [Technology Stack](#-technology-stack)
4. [Project File Structure](#-project-file-structure)
5. [Getting Started & Quick Setup](#-getting-started--quick-setup)
6. [Interactive Walkthrough & Workflows](#-interactive-walkthrough--workflows)
7. [Form Validation Rules](#-form-validation-rules)
8. [Testing & Quality Assurance](#-testing--quality-assurance)
9. [Documentation Deliverables](#-documentation-deliverables)
10. [Submission & Evaluation Details](#-submission--evaluation-details)

---

## 🌟 Key Features

### 👨‍⚕️ 1. Doctor Directory & Specialty Explorer
- **8 Medical Specializations**: Cardiology, Dermatology, Pediatrics, Neurology, Orthopedics, General Medicine, Gynecology, and Psychiatry.
- **Rich Doctor Profiles**: Doctor credentials, years of clinical experience, affiliated hospital suites, verified star ratings, and transparent fees.
- **Search & Multi-Filter**: Real-time keyword search across doctor names, hospitals, languages, and specialties, plus sorting by rating, experience, and fee.
- **Specialist Detail Modal**: Deep-dive popup displaying practitioner biographies, working days, and consultation hours.

### 📅 2. Dynamic Scheduling & Slot Conflict Engine
- **Calendar Picker**: Automated min/max date constraints (locks past dates; enables scheduling up to 90 days in advance).
- **Working Day Detection**: Verifies whether a physician holds clinics on the selected day of the week, with helpful alerts if off-duty.
- **Session Division**: Slots neatly categorized into **Morning**, **Afternoon**, and **Evening** sessions.
- **Collision Avoidance**: Dynamic detection of existing bookings; previously reserved slots are automatically disabled and strikethrough-marked.

### 📝 3. Patient Registration & Form Validation
- **Patient Profile Fields**: Full Name, Email, Phone Number, Age, Gender, Blood Group, Address, and Clinical Symptoms.
- **Real-Time Inline Validation**: Instant visual cues (green for valid, red for errors) with descriptive error messages.
- **Browser State Persistence**: "Remember Me" toggle and dedicated Patient Profile manager for 1-click booking autofill.

### 🎫 4. Digital Appointment Ticket & Confirmation
- **Official Digital Slip**: Generates a unique Booking ID (`APT-2026-XXXX`), appointment timetable, clinic address, and payment status.
- **SVG QR Code**: Verified digital security pass suitable for reception check-in.
- **Print Optimization**: Built-in `@media print` stylesheet formatted for physical printing or saving directly to PDF.

### 📊 5. Appointment Management Dashboard
- **Live Statistics Cards**: Real-time counters for **Total**, **Upcoming**, **Completed**, and **Cancelled** appointments.
- **Search & Status Filtering**: Instant tab filtering (All, Upcoming, Completed, Cancelled) and keyword search by patient or doctor name.
- **In-Place Rescheduling**: Select alternative dates and newly available slots without re-registering.
- **Cancellation Auditing**: Cancel visits with structured reason tracking (schedule conflict, symptoms resolved, etc.).
- **One-Click Demo Reset**: Restores original seed data for demo testing and grading evaluators.

---

## 📸 Live Screenshots

| 01. Landing Hero Page | 02. Specialties Grid |
| :---: | :---: |
| ![Hero Page](screenshots/01_home_hero.png) | ![Specialties](screenshots/02_specializations.png) |

| 03. Doctor Listing | 04. Doctor Profile Modal |
| :---: | :---: |
| ![Doctor Listing](screenshots/03_doctor_listing.png) | ![Doctor Modal](screenshots/04_doctor_profile_modal.png) |

| 05. Appointment Booking Form | 06. Form Validation Errors |
| :---: | :---: |
| ![Booking Form](screenshots/05_appointment_booking.png) | ![Validation](screenshots/06_form_validation_errors.png) |

| 07. Digital Confirmation Ticket | 08. Appointment Dashboard |
| :---: | :---: |
| ![Ticket Modal](screenshots/07_appointment_confirmation_ticket.png) | ![Dashboard](screenshots/08_appointments_dashboard.png) |

| 09. Patient Health Profile | 10. Mobile Responsive View |
| :---: | :---: |
| ![Patient Profile](screenshots/09_patient_profile.png) | ![Mobile View](screenshots/10_responsive_mobile_view.png) |

---

## 🛠 Technology Stack

- **Markup**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<dialog>`)
- **Styling**: Modern CSS3 (Custom Properties / CSS Variables, Flexbox, CSS Grid, Media Queries, `@media print`)
- **Programming Language**: Vanilla JavaScript (ES6+ Classes, Modules, Arrow Functions, LocalStorage API)
- **Typography & Icons**: Inter Font (Google Fonts) & Crisp Native SVG Vector Icons
- **Third-Party Dependencies**: **None (0 dependencies)** — pure vanilla web standards.

---

## 📂 Project File Structure

```
healthcare-appointment-system/
│
├── index.html                  # Main responsive single-page healthcare web application
├── css/
│   ├── style.css               # Core design system, variables, typography, modals, print layout
│   └── responsive.css          # Responsive breakpoints (1024px, 768px, 480px)
├── js/
│   ├── data.js                 # Seed dataset of 8 specialties, 8 detailed doctors, and sample appointments
│   ├── storage.js              # Web Storage API (localStorage) wrapper, CRUD functions, slot query logic
│   ├── validation.js           # Real-time regex validation rules, boundary checks, and DOM error rendering
│   └── app.js                  # Application orchestrator, dynamic DOM rendering, booking engine, dashboard
├── screenshots/                # Real screenshots capturing all pages and states
│   ├── 01_home_hero.png
│   ├── 02_specializations.png
│   ├── 03_doctor_listing.png
│   ├── 04_doctor_profile_modal.png
│   ├── 05_appointment_booking.png
│   ├── 06_form_validation_errors.png
│   ├── 07_appointment_confirmation_ticket.png
│   ├── 08_appointments_dashboard.png
│   ├── 09_patient_profile.png
│   └── 10_responsive_mobile_view.png
├── report/
│   ├── Project_Report.html     # Formal printable HTML report with cover page and diagrams
│   └── generate_pdf.ps1        # PowerShell script to compile report to PDF via Headless Chrome
├── README.md                   # This comprehensive repository guide
├── Project_Report.md           # Formal Academic / Internship Project Report in Markdown
├── Healthcare_Appointment_System_Report.pdf # Final compiled official PDF report
├── FEATURES.md                 # Detailed feature breakdown and specification matrix
└── capture_screenshots.ps1     # Automated headless screenshot capture script
```

---

## 🚀 Getting Started & Quick Setup

### Prerequisites
Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari, or Opera).

### Running the Application
1. Download or clone this repository to your local computer:
   ```bash
   git clone https://github.com/your-username/healthcare-appointment-system.git
   ```
2. Navigate to the project directory:
   ```bash
   cd healthcare-appointment-system
   ```
3. Open `index.html` directly in your browser:
   - On Windows: Double-click `index.html` or run `start index.html` in PowerShell.
   - On macOS: Run `open index.html` in Terminal.
   - On Linux: Run `xdg-open index.html`.
4. The application is completely client-side and requires **no node_modules, no npm install, and no local web server** to function!

---

## 🔄 Interactive Walkthrough & Workflows

### 1. Booking an Appointment
1. Scroll to the **Doctors** section or click **Specialties** to filter by department.
2. Click **"Book Visit"** on any physician card to automatically pre-select that practitioner in the booking wizard.
3. Choose your consultation mode (**In-Person Clinic Visit** or **Video Telehealth**).
4. Select your preferred date.
5. Pick an available time slot from the **Morning**, **Afternoon**, or **Evening** sessions.
6. Enter patient demographic information or click **"Autofill Saved Profile"**.
7. Click **"Confirm & Book Appointment"**.
8. Instantly view your digital receipt ticket with unique Booking ID and QR code, or click **"Print Slip / Save PDF"**.

### 2. Rescheduling an Appointment
1. Scroll to the **My Bookings** dashboard.
2. Locate an upcoming appointment and click the **"Reschedule"** button.
3. Select a new date and an open time slot.
4. Click **"Confirm Reschedule"**.

### 3. Cancelling an Appointment
1. On any upcoming appointment card, click **"Cancel"**.
2. Select your reason for cancellation from the dropdown menu.
3. Click **"Yes, Cancel Appointment"**. The status updates to **Cancelled**, releasing the reserved time slot for other patients.

---

## 🛡 Form Validation Rules

| Field | Validation Type | Criteria |
| :--- | :--- | :--- |
| **Full Name** | Regex & Length | Required; minimum 3 characters; letters, spaces, hyphens only. |
| **Email Address** | Standard RFC Regex | Required; must match standard email pattern (`name@domain.com`). |
| **Phone Number** | Digit Count | Required; minimum 10 numerical digits. |
| **Age** | Boundary Check | Required; integer between 0 and 120. |
| **Gender** | Required Dropdown | Must select one of the valid options. |
| **Appointment Date** | Date Range | Cannot be in the past; maximum 90 days in advance. |
| **Time Slot** | Slot Selection | Must choose an available (unbooked) time slot. |
| **Symptoms / Reason** | Minimum Length | Required; minimum 5 characters describing the health concern. |

---

## 🧪 Testing & Quality Assurance

All test cases have been executed and verified:
- **TC-01 (Blank Submission)**: Halts form submission and highlights all invalid fields in red.
- **TC-02 (Email Format)**: Flags invalid formatting (e.g. `user@com` or `user@`).
- **TC-03 (Past Date Locking)**: Date picker restricts selection of dates prior to today.
- **TC-04 (Doctor Working Day)**: Displays an off-duty warning banner if a doctor does not practice on the chosen day.
- **TC-05 (Slot Conflict)**: Already booked time slots are marked `[Booked]` and disabled from selection.
- **TC-06 (Reschedule Workflow)**: Updates date/time in `localStorage` and frees the previous slot.
- **TC-07 (Cancellation Workflow)**: Updates status to `Cancelled` and audits cancellation reason.
- **TC-08 (Mobile Responsiveness)**: Responsive hamburger drawer menu and flexible grid layout across viewports.

---

## 📄 Documentation Deliverables

1. **`README.md`**: Complete project overview, feature matrix, installation instructions, and testing matrix.
2. **`Project_Report.md`**: Formal academic and virtual internship report.
3. **`Healthcare_Appointment_System_Report.pdf`**: Publication-grade PDF report with cover page and diagrams.
4. **`FEATURES.md`**: Detailed technical specifications, data schemas, and module breakdowns.
5. **`screenshots/`**: Directory containing 10 high-resolution screenshots of the running application.

---

## 🎓 Submission & Evaluation Details

- **Internship Project Title**: MediConnect - Healthcare Appointment Booking System
- **Domain**: Frontend Web Development / Full Stack Internship
- **Status**: Completed, Fully Tested, and Ready for GitHub & Virtual Internship Portal Submission
- **License**: MIT Open Source License (2026)
