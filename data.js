/**
 * Healthcare Appointment Booking System - Data Store
 * Contains seed data for doctor specializations, doctors list, and initial sample bookings.
 */

const SPECIALIZATIONS_DATA = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: 'heart-pulse',
    description: 'Heart and cardiovascular system specialists',
    badgeClass: 'badge-cardio',
    count: 3
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    icon: 'sparkles',
    description: 'Skin, hair, nail conditions and cosmetic care',
    badgeClass: 'badge-derma',
    count: 2
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    icon: 'baby',
    description: 'Child health, growth monitoring, and infant care',
    badgeClass: 'badge-pediatric',
    count: 2
  },
  {
    id: 'neurology',
    name: 'Neurology',
    icon: 'brain',
    description: 'Brain, spinal cord, and nervous system disorders',
    badgeClass: 'badge-neuro',
    count: 2
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    icon: 'bone',
    description: 'Bones, joints, ligaments, and musculoskeletal care',
    badgeClass: 'badge-ortho',
    count: 2
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    icon: 'stethoscope',
    description: 'Comprehensive primary care and routine health screenings',
    badgeClass: 'badge-general',
    count: 3
  },
  {
    id: 'gynecology',
    name: 'Gynecology & Obstetrics',
    icon: 'shield-plus',
    description: "Women's reproductive health and maternity care",
    badgeClass: 'badge-gynec',
    count: 2
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry & Mental Health',
    icon: 'smile',
    description: 'Mental health, therapy, anxiety, and depression treatment',
    badgeClass: 'badge-mental',
    count: 2
  }
];

const DOCTORS_DATA = [
  {
    id: 'doc-101',
    name: 'Dr. Sarah Jenkins',
    qualification: 'MD, FACC - Cardiologist',
    specializationId: 'cardiology',
    specializationName: 'Cardiology',
    experienceYears: 14,
    hospital: 'Metro Heart Institute, Suite 402',
    fee: 120,
    rating: 4.9,
    reviewCount: 238,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Sarah Jenkins is a board-certified cardiologist with over 14 years of clinical experience in treating coronary artery diseases, hypertension, and heart failure. She is passionate about preventive cardiology and lifestyle medicine.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: [
      '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
      '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM',
      '05:00 PM', '05:45 PM'
    ],
    languages: ['English', 'Spanish'],
    phone: '+1 (555) 234-5678',
    email: 'sarah.jenkins@metrohealth.org'
  },
  {
    id: 'doc-102',
    name: 'Dr. Marcus Vance',
    qualification: 'MD, FAAD - Dermatologist',
    specializationId: 'dermatology',
    specializationName: 'Dermatology',
    experienceYears: 11,
    hospital: 'Apex Skin & Laser Clinic',
    fee: 95,
    rating: 4.8,
    reviewCount: 184,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Vance specializes in clinical and surgical dermatology, including acne therapies, eczema, psoriasis, and early skin cancer screening. He utilizes cutting-edge laser and phototherapy equipment.',
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timeSlots: [
      '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM',
      '01:30 PM', '02:15 PM', '03:00 PM', '03:45 PM',
      '04:30 PM', '05:15 PM'
    ],
    languages: ['English'],
    phone: '+1 (555) 345-6789',
    email: 'marcus.vance@apexskin.com'
  },
  {
    id: 'doc-103',
    name: 'Dr. Priya Patel',
    qualification: 'MD, FAAP - Pediatric Specialist',
    specializationId: 'pediatrics',
    specializationName: 'Pediatrics',
    experienceYears: 9,
    hospital: 'Little Stars Children Hospital',
    fee: 80,
    rating: 4.9,
    reviewCount: 312,
    avatar: 'https://images.unsplash.com/photo-1594824813589-9833777596c3?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Priya Patel offers compassionate pediatric care ranging from newborn examinations to adolescent developmental consultations. She focuses on gentle, kid-friendly clinical approaches.',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    timeSlots: [
      '09:00 AM', '09:40 AM', '10:20 AM', '11:00 AM',
      '01:00 PM', '01:40 PM', '02:20 PM', '03:00 PM',
      '03:40 PM', '04:20 PM'
    ],
    languages: ['English', 'Hindi', 'Gujarati'],
    phone: '+1 (555) 456-7890',
    email: 'priya.patel@littlestars.org'
  },
  {
    id: 'doc-104',
    name: 'Dr. Alexander Wright',
    qualification: 'MD, PhD - Neurologist',
    specializationId: 'neurology',
    specializationName: 'Neurology',
    experienceYears: 16,
    hospital: 'Neuroscience Research & Care Center',
    fee: 150,
    rating: 4.9,
    reviewCount: 165,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Wright is a leading neurologist specializing in migraine management, neuropathy, Parkinsonian disorders, and cognitive assessments. He is affiliated with regional academic medical centers.',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    timeSlots: [
      '10:00 AM', '11:00 AM', '12:00 PM',
      '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ],
    languages: ['English', 'German'],
    phone: '+1 (555) 567-8901',
    email: 'a.wright@neurocare.org'
  },
  {
    id: 'doc-105',
    name: 'Dr. Emily Chen',
    qualification: 'MD, FAAOS - Orthopedic Surgeon',
    specializationId: 'orthopedics',
    specializationName: 'Orthopedics',
    experienceYears: 12,
    hospital: 'Alliance Bone & Joint Institute',
    fee: 130,
    rating: 4.8,
    reviewCount: 220,
    avatar: 'https://images.unsplash.com/photo-1559839734-6014e75a6c38?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Emily Chen focuses on sports injuries, arthroscopic surgeries, joint preservation, and rehabilitation of knees, shoulders, and hips. Former consultant for collegiate athletic teams.',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: [
      '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
      '01:30 PM', '02:15 PM', '03:00 PM', '04:00 PM'
    ],
    languages: ['English', 'Mandarin'],
    phone: '+1 (555) 678-9012',
    email: 'emily.chen@alliancebone.com'
  },
  {
    id: 'doc-106',
    name: 'Dr. David Miller',
    qualification: 'MD - Primary Care Physician',
    specializationId: 'general-medicine',
    specializationName: 'General Medicine',
    experienceYears: 18,
    hospital: 'Evergreen Family Health Center',
    fee: 70,
    rating: 4.7,
    reviewCount: 410,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Miller is a seasoned general practitioner providing diagnostic consultations, chronic disease management (diabetes, blood pressure), annual physical examinations, and wellness counseling.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: [
      '08:30 AM', '09:15 AM', '10:00 AM', '10:45 AM', '11:30 AM',
      '01:30 PM', '02:15 PM', '03:00 PM', '03:45 PM', '04:30 PM'
    ],
    languages: ['English'],
    phone: '+1 (555) 789-0123',
    email: 'david.miller@evergreenhealth.org'
  },
  {
    id: 'doc-107',
    name: 'Dr. Anita Desai',
    qualification: 'MD, FACOG - Obstetrician & Gynecologist',
    specializationId: 'gynecology',
    specializationName: 'Gynecology & Obstetrics',
    experienceYears: 13,
    hospital: 'Women & Wellness Specialty Care',
    fee: 110,
    rating: 4.9,
    reviewCount: 275,
    avatar: 'https://images.unsplash.com/photo-1594824813682-132d0ffbaeb3?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Anita Desai specializes in comprehensive prenatal and postpartum care, hormonal wellness, polycystic ovary syndrome (PCOS), and minimally invasive gynecological care.',
    availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    timeSlots: [
      '09:30 AM', '10:30 AM', '11:30 AM',
      '01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM'
    ],
    languages: ['English', 'Hindi', 'Marathi'],
    phone: '+1 (555) 890-1234',
    email: 'anita.desai@womenwellness.com'
  },
  {
    id: 'doc-108',
    name: 'Dr. Julian Foster',
    qualification: 'MD, FAPA - Adult & Adolescent Psychiatrist',
    specializationId: 'psychiatry',
    specializationName: 'Psychiatry & Mental Health',
    experienceYears: 10,
    hospital: 'Harbor Light Behavioral Health',
    fee: 140,
    rating: 4.9,
    reviewCount: 140,
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Julian Foster provides evidence-based psychotherapy, pharmacological evaluations, and mindfulness-integrated treatments for anxiety disorders, depression, ADHD, and sleep disturbances.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    timeSlots: [
      '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ],
    languages: ['English', 'French'],
    phone: '+1 (555) 901-2345',
    email: 'julian.foster@harborlight.org'
  }
];

// Helper to calculate future date string (YYYY-MM-DD)
function getFutureDate(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const SEED_APPOINTMENTS = [
  {
    id: 'APT-2026-1042',
    doctorId: 'doc-101',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpecialization: 'Cardiology',
    doctorHospital: 'Metro Heart Institute, Suite 402',
    doctorFee: 120,
    patientName: 'Robert Martinez',
    patientEmail: 'robert.m@example.com',
    patientPhone: '(555) 819-2034',
    patientAge: 45,
    patientGender: 'Male',
    patientBloodGroup: 'O+',
    appointmentDate: getFutureDate(1), // Tomorrow
    appointmentTime: '10:30 AM',
    consultationType: 'In-Person',
    reasonForVisit: 'Routine cardiac follow-up and blood pressure management review.',
    status: 'Upcoming',
    createdAt: new Date().toISOString()
  },
  {
    id: 'APT-2026-1043',
    doctorId: 'doc-102',
    doctorName: 'Dr. Marcus Vance',
    doctorSpecialization: 'Dermatology',
    doctorHospital: 'Apex Skin & Laser Clinic',
    doctorFee: 95,
    patientName: 'Emma Watson-Lee',
    patientEmail: 'emma.lee@example.com',
    patientPhone: '(555) 742-9988',
    patientAge: 29,
    patientGender: 'Female',
    patientBloodGroup: 'A+',
    appointmentDate: getFutureDate(3),
    appointmentTime: '02:15 PM',
    consultationType: 'Video Consultation',
    reasonForVisit: 'Persistent eczema flare-up on hands and allergy consultation.',
    status: 'Upcoming',
    createdAt: new Date().toISOString()
  },
  {
    id: 'APT-2026-1039',
    doctorId: 'doc-106',
    doctorName: 'Dr. David Miller',
    doctorSpecialization: 'General Medicine',
    doctorHospital: 'Evergreen Family Health Center',
    doctorFee: 70,
    patientName: 'Jessica Taylor',
    patientEmail: 'jessica.t@example.com',
    patientPhone: '(555) 431-8822',
    patientAge: 36,
    patientGender: 'Female',
    patientBloodGroup: 'B+',
    appointmentDate: getFutureDate(-4), // Past appointment
    appointmentTime: '11:30 AM',
    consultationType: 'In-Person',
    reasonForVisit: 'Annual comprehensive health checkup and lipid blood panel.',
    status: 'Completed',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'APT-2026-1035',
    doctorId: 'doc-104',
    doctorName: 'Dr. Alexander Wright',
    doctorSpecialization: 'Neurology',
    doctorHospital: 'Neuroscience Research & Care Center',
    doctorFee: 150,
    patientName: 'Daniel Kim',
    patientEmail: 'daniel.kim@example.com',
    patientPhone: '(555) 620-1144',
    patientAge: 52,
    patientGender: 'Male',
    patientBloodGroup: 'AB-',
    appointmentDate: getFutureDate(-7),
    appointmentTime: '03:00 PM',
    consultationType: 'In-Person',
    reasonForVisit: 'Evaluation of chronic tension headaches and neck stiffness.',
    status: 'Cancelled',
    cancelReason: 'Patient rescheduled due to work travel conflict.',
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString()
  }
];
