import doctor1 from '../assets/doctors/doctor1.png';
import doctor2 from '../assets/doctors/doctor2.png';
import doctor3 from '../assets/doctors/doctor3.png';
import doctor4 from '../assets/doctors/doctor4.png';
import doctor5 from '../assets/doctors/doctor5.png';
import doctor6 from '../assets/doctors/doctor6.png';

export interface ClinicLocation {
  id: string;
  name: string;
  campus: string;
  address: string;
  suite: string;
  phone: string;
  hours: string;
  isVirtual?: boolean;
}

export interface SpecialtyItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  commonConditions: string[];
  icon: 'heart' | 'skin' | 'baby' | 'brain' | 'bone' | 'stethoscope' | 'dna';
  doctorCount: number;
  averageFee: number;
}

export interface DoctorProfile {
  id: number;
  userId?: number;
  name: string;
  title: string;
  specialty: string;
  subspecialty: string;
  qualifications: string;
  experienceYears: number;
  clinic: ClinicLocation;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  nextAvailable: {
    date: string;
    time: string;
    label: string;
  };
  image: string;
  bio: string;
  education: string[];
  certifications: string[];
  languages: string[];
  isDemoRecord: boolean;
  demoNotice: string;
  availableSchedule: {
    days: string[];
    hours: string;
    slots: string[];
  };
}

export const CLINIC_LOCATIONS: ClinicLocation[] = [
  {
    id: 'st-jude',
    name: 'St. Jude Outpatient Pavilion',
    campus: 'Main Hospital Campus',
    address: '1420 Medical Center Parkway',
    suite: 'Pavilion Suite 320',
    phone: '(555) 018-4200',
    hours: 'Mon – Fri: 8:00 AM – 5:30 PM'
  },
  {
    id: 'metro-center',
    name: 'Metropolitan Health Center',
    campus: 'North Medical Plaza',
    address: '880 North Health Way',
    suite: 'Specialty Wing 2B',
    phone: '(555) 019-3380',
    hours: 'Mon – Fri: 8:30 AM – 6:00 PM'
  },
  {
    id: 'parkview-suites',
    name: 'Parkview Medical Suites',
    campus: 'Eastside Outpatient Center',
    address: '425 Parkview Boulevard',
    suite: 'Suite 104',
    phone: '(555) 017-9120',
    hours: 'Mon – Fri: 8:00 AM – 5:00 PM'
  },
  {
    id: 'virtual-care',
    name: 'MediBook Telehealth Service',
    campus: 'Virtual Clinical Consultation',
    address: 'Secure Encrypted Video Portal',
    suite: 'Online Session Room',
    phone: '(555) 012-7000',
    hours: 'Mon – Sat: 8:00 AM – 8:00 PM',
    isVirtual: true
  }
];

export const HEALTHCARE_SPECIALTIES: SpecialtyItem[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    tagline: 'Heart & Vascular Care',
    description: 'Comprehensive evaluation and treatment for cardiac arrhythmias, hypertension, coronary artery health, and preventive cardiovascular screening.',
    commonConditions: ['Hypertension', 'Arrhythmia', 'Coronary Health', 'Preventive Screening'],
    icon: 'heart',
    doctorCount: 4,
    averageFee: 130
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    tagline: 'Skin, Hair & Cutaneous Medicine',
    description: 'Diagnosis and management of acute and chronic skin disorders, dermoscopy, mole surveillance, acne, eczema, and skin cancer screening.',
    commonConditions: ['Eczema & Psoriasis', 'Mole Checks', 'Acne Management', 'Cutaneous Allergy'],
    icon: 'skin',
    doctorCount: 3,
    averageFee: 120
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    tagline: 'Infant, Child & Adolescent Health',
    description: 'Compassionate pediatric care focusing on developmental milestones, childhood preventative medicine, immunizations, and acute illness management.',
    commonConditions: ['Well-Child Checks', 'Developmental Care', 'Pediatric Asthma', 'Vaccinations'],
    icon: 'baby',
    doctorCount: 3,
    averageFee: 110
  },
  {
    id: 'neurology',
    name: 'Neurology',
    tagline: 'Brain, Nerve & Cognitive Medicine',
    description: 'Specialized clinical assessment for migraines, peripheral neuropathy, cognitive changes, neuromuscular disorders, and sleep disturbances.',
    commonConditions: ['Chronic Migraines', 'Neuropathy', 'Cognitive Assessment', 'Seizure Disorders'],
    icon: 'brain',
    doctorCount: 2,
    averageFee: 150
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    tagline: 'Bone, Joint & Sports Medicine',
    description: 'Restoration of mobility and pain reduction through joint preservation, sports injury rehabilitation, fracture care, and musculoskeletal assessment.',
    commonConditions: ['Joint Arthritis', 'Sports Injuries', 'Back & Neck Pain', 'Ligament Sprains'],
    icon: 'bone',
    doctorCount: 4,
    averageFee: 140
  },
  {
    id: 'gynecology',
    name: 'Gynecology',
    tagline: "Women's Health & Preventive Care",
    description: "Holistic care for women across all life stages, including annual well-woman exams, pelvic health, fertility guidance, and hormonal wellness.",
    commonConditions: ['Well-Woman Exams', 'Pelvic Health', 'Hormonal Wellness', 'Pre-conception Care'],
    icon: 'dna',
    doctorCount: 3,
    averageFee: 125
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    tagline: 'Primary & Comprehensive Adult Care',
    description: 'Holistic primary care, routine preventative physicals, chronic condition management (diabetes, cholesterol), and comprehensive health triage.',
    commonConditions: ['Annual Physicals', 'Diabetes Care', 'Preventative Screenings', 'Lipid Management'],
    icon: 'stethoscope',
    doctorCount: 5,
    averageFee: 95
  }
];

export const DEMO_DOCTORS: DoctorProfile[] = [
  {
    id: 1,
    userId: 1,
    name: 'Dr. Sarah Vance, MD',
    title: 'Senior Clinical Cardiologist',
    specialty: 'Cardiology',
    subspecialty: 'Preventive Cardiology & Heart Rhythm',
    qualifications: 'MD, FACC • Board-Certified in Cardiovascular Disease',
    experienceYears: 14,
    clinic: CLINIC_LOCATIONS[0], // St. Jude
    consultationFee: 130,
    rating: 4.9,
    reviewCount: 128,
    nextAvailable: {
      date: 'Tomorrow',
      time: '10:00 AM',
      label: 'Tomorrow at 10:00 AM'
    },
    image: doctor1,
    bio: 'Dr. Sarah Vance has over 14 years of clinical experience in non-invasive cardiology and preventative heart care. She completed her fellowship at Northwestern Memorial Hospital and focuses on patient-centered lifestyle interventions and lipid management.',
    education: ['Johns Hopkins School of Medicine (MD)', 'Northwestern University Fellowship in Cardiology'],
    certifications: ['American Board of Internal Medicine (Cardiovascular Disease)', 'National Board of Echocardiography'],
    languages: ['English', 'Spanish'],
    isDemoRecord: true,
    demoNotice: 'Demo Provider Profile — Simulated clinical credentials for platform evaluation',
    availableSchedule: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      hours: '09:00 AM – 04:30 PM',
      slots: ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '02:00 PM', '02:45 PM', '03:30 PM']
    }
  },
  {
    id: 2,
    userId: 2,
    name: 'Dr. Marcus Sterling, MD',
    title: 'Consultant Dermatologist',
    specialty: 'Dermatology',
    subspecialty: 'Clinical & Cutaneous Medicine',
    qualifications: 'MD, FAAD • Board-Certified Dermatologist',
    experienceYears: 11,
    clinic: CLINIC_LOCATIONS[1], // Metropolitan Health Center
    consultationFee: 120,
    rating: 4.8,
    reviewCount: 94,
    nextAvailable: {
      date: 'Tomorrow',
      time: '11:30 AM',
      label: 'Tomorrow at 11:30 AM'
    },
    image: doctor2,
    bio: 'Dr. Marcus Sterling is an established clinical dermatologist specializing in inflammatory skin diseases, early melanoma detection through digital dermoscopy, and chronic eczema therapeutics. He prioritizes clear communication and minimal intervention.',
    education: ['Columbia University Vagelos College of Physicians (MD)', 'NYU Langone Dermatology Residency'],
    certifications: ['American Board of Dermatology', 'Fellow, American Academy of Dermatology'],
    languages: ['English'],
    isDemoRecord: true,
    demoNotice: 'Demo Provider Profile — Simulated clinical credentials for platform evaluation',
    availableSchedule: {
      days: ['Mon', 'Tue', 'Wed', 'Thu'],
      hours: '09:30 AM – 05:00 PM',
      slots: ['09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM', '01:30 PM', '02:15 PM', '03:45 PM']
    }
  },
  {
    id: 3,
    userId: 3,
    name: 'Dr. Anya Patel, MD',
    title: 'Lead Pediatric Specialist',
    specialty: 'Pediatrics',
    subspecialty: 'Developmental Pediatrics & Well-Child Care',
    qualifications: 'MD, FAAP • Board-Certified Pediatrician',
    experienceYears: 12,
    clinic: CLINIC_LOCATIONS[2], // Parkview Medical Suites
    consultationFee: 110,
    rating: 5.0,
    reviewCount: 156,
    nextAvailable: {
      date: 'Oct 20',
      time: '09:00 AM',
      label: 'Oct 20 at 9:00 AM'
    },
    image: doctor3,
    bio: 'Dr. Anya Patel has dedicated 12 years to primary and developmental pediatric care. She partners closely with families from infancy to adolescence, with specialized interest in pediatric allergy, asthma action plans, and developmental milestones.',
    education: ['University of Michigan Medical School (MD)', 'Children’s Hospital of Philadelphia Residency'],
    certifications: ['American Board of Pediatrics', 'Pediatric Advanced Life Support (PALS)'],
    languages: ['English', 'Hindi', 'Gujarati'],
    isDemoRecord: true,
    demoNotice: 'Demo Provider Profile — Simulated clinical credentials for platform evaluation',
    availableSchedule: {
      days: ['Mon', 'Wed', 'Thu', 'Fri'],
      hours: '08:30 AM – 04:00 PM',
      slots: ['08:30 AM', '09:15 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '03:15 PM']
    }
  },
  {
    id: 4,
    userId: 4,
    name: 'Dr. Tariq Al-Mansoor, MD',
    title: 'Consultant Neurologist',
    specialty: 'Neurology',
    subspecialty: 'Headache & Neuromuscular Medicine',
    qualifications: 'MD, FAAN • Board-Certified Neurologist',
    experienceYears: 16,
    clinic: CLINIC_LOCATIONS[0], // St. Jude Outpatient Pavilion
    consultationFee: 150,
    rating: 4.9,
    reviewCount: 112,
    nextAvailable: {
      date: 'Oct 20',
      time: '02:00 PM',
      label: 'Oct 20 at 2:00 PM'
    },
    image: doctor5,
    bio: 'Dr. Tariq Al-Mansoor is a senior neurologist with expertise in complex headache management, peripheral neuropathies, and vestibular diagnostics. His practice emphasizes comprehensive neurological examinations and evidence-based therapeutic regimens.',
    education: ['McGill University Faculty of Medicine (MD)', 'Mayo Clinic Fellowship in Clinical Neurophysiology'],
    certifications: ['American Board of Psychiatry and Neurology', 'American Headache Society Certified Specialist'],
    languages: ['English', 'Arabic', 'French'],
    isDemoRecord: true,
    demoNotice: 'Demo Provider Profile — Simulated clinical credentials for platform evaluation',
    availableSchedule: {
      days: ['Tue', 'Wed', 'Thu', 'Fri'],
      hours: '09:00 AM – 04:30 PM',
      slots: ['09:15 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:15 PM', '04:00 PM']
    }
  },
  {
    id: 5,
    userId: 5,
    name: 'Dr. Sofia Lindqvist, MD',
    title: 'Orthopedic Specialist',
    specialty: 'Orthopedics',
    subspecialty: 'Joint Preservation & Sports Medicine',
    qualifications: 'MD, FAAOS • Board-Certified Orthopedic Surgeon',
    experienceYears: 15,
    clinic: CLINIC_LOCATIONS[1], // Metropolitan Health Center
    consultationFee: 140,
    rating: 4.8,
    reviewCount: 98,
    nextAvailable: {
      date: 'Oct 21',
      time: '10:30 AM',
      label: 'Oct 21 at 10:30 AM'
    },
    image: doctor4,
    bio: 'Dr. Sofia Lindqvist specializes in non-operative musculoskeletal medicine, joint injection therapies, and sports rehabilitation. She collaborates closely with physical therapists to restore athletic performance and joint function safely.',
    education: ['Karolinska Institute (MD)', 'Stanford University Orthopedic Surgery Fellowship'],
    certifications: ['American Board of Orthopaedic Surgery', 'Certificate of Added Qualification in Sports Medicine'],
    languages: ['English', 'Swedish'],
    isDemoRecord: true,
    demoNotice: 'Demo Provider Profile — Simulated clinical credentials for platform evaluation',
    availableSchedule: {
      days: ['Mon', 'Tue', 'Thu', 'Fri'],
      hours: '08:30 AM – 05:00 PM',
      slots: ['08:30 AM', '09:45 AM', '10:30 AM', '01:15 PM', '02:45 PM', '04:00 PM']
    }
  },
  {
    id: 6,
    userId: 6,
    name: 'Dr. Rachel Chen, MD',
    title: 'Obstetrician & Gynecologist',
    specialty: 'Gynecology',
    subspecialty: 'Reproductive Endocrinology & Pelvic Care',
    qualifications: 'MD, FACOG • Board-Certified in Obstetrics & Gynecology',
    experienceYears: 13,
    clinic: CLINIC_LOCATIONS[2], // Parkview Medical Suites
    consultationFee: 125,
    rating: 4.9,
    reviewCount: 142,
    nextAvailable: {
      date: 'Oct 21',
      time: '03:15 PM',
      label: 'Oct 21 at 3:15 PM'
    },
    image: doctor6,
    bio: "Dr. Rachel Chen provides comprehensive gynecological consultations with a focus on preventative care, hormonal balance, minimally invasive diagnostic evaluation, and respectful, comfortable patient visits.",
    education: ['University of California San Francisco (MD)', 'Brigham and Women’s Hospital Residency'],
    certifications: ['American Board of Obstetrics and Gynecology (ABOG)', 'Fellow, American College of OB/GYN'],
    languages: ['English', 'Mandarin'],
    isDemoRecord: true,
    demoNotice: 'Demo Provider Profile — Simulated clinical credentials for platform evaluation',
    availableSchedule: {
      days: ['Mon', 'Wed', 'Fri'],
      hours: '09:00 AM – 04:30 PM',
      slots: ['09:00 AM', '10:00 AM', '11:15 AM', '01:30 PM', '02:30 PM', '03:15 PM']
    }
  },
  {
    id: 7,
    userId: 7,
    name: 'Dr. David Thorne, MD',
    title: 'Consultant Internist',
    specialty: 'General Medicine',
    subspecialty: 'Internal Medicine & Preventative Health',
    qualifications: 'MD, FACP • Board-Certified in Internal Medicine',
    experienceYears: 18,
    clinic: CLINIC_LOCATIONS[0], // St. Jude
    consultationFee: 95,
    rating: 4.7,
    reviewCount: 204,
    nextAvailable: {
      date: 'Tomorrow',
      time: '08:30 AM',
      label: 'Tomorrow at 8:30 AM'
    },
    image: doctor2,
    bio: 'Dr. David Thorne brings 18 years of comprehensive clinical hospital and ambulatory internal medicine experience. He focuses on cardiovascular risk reduction, metabolic health, preventative screenings, and proactive longevity medicine.',
    education: ['Penn State College of Medicine (MD)', 'Cleveland Clinic Internal Medicine Residency'],
    certifications: ['American Board of Internal Medicine', 'Fellow of the American College of Physicians'],
    languages: ['English'],
    isDemoRecord: true,
    demoNotice: 'Demo Provider Profile — Simulated clinical credentials for platform evaluation',
    availableSchedule: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      hours: '08:00 AM – 04:00 PM',
      slots: ['08:00 AM', '08:45 AM', '09:30 AM', '10:30 AM', '01:15 PM', '02:00 PM', '03:00 PM']
    }
  }
];

export const TRUST_PILLARS = [
  {
    id: 'credentialing',
    title: 'Verified Medical Credentials',
    description: 'Every listed physician undergoes primary-source license verification, clinical privileges validation, and board-certification screening.',
    badge: 'Credentialed Faculty'
  },
  {
    id: 'pricing',
    title: 'Upfront, Transparent Pricing',
    description: 'Consultation fees are established in advance with zero surprise facility fees, booking surcharges, or hidden administrative markups.',
    badge: 'Zero Hidden Fees'
  },
  {
    id: 'sync',
    title: 'Direct Clinic Calendar Sync',
    description: 'Appointment slots update directly against clinic scheduling software to eliminate double bookings and unconfirmed requests.',
    badge: 'Real-Time Sync'
  },
  {
    id: 'privacy',
    title: 'Patient Privacy Standards',
    description: 'Appointments and patient intake data are safeguarded with AES-256 encryption conforming to international healthcare data protections.',
    badge: 'Encrypted & Confidential'
  }
];

export const PATIENT_FEEDBACK_DEMO = [
  {
    id: '1',
    author: 'C. Henderson',
    visitType: 'Cardiology Consultation',
    clinic: 'St. Jude Outpatient Pavilion',
    feedback: 'The appointment experience was exemplary. Dr. Vance reviewed my previous ECGs thoroughly and outlined an actionable, calm preventative plan without rushing.',
    date: 'Verified Demo Visit • September 2026',
    isDemo: true
  },
  {
    id: '2',
    author: 'M. Gallagher',
    visitType: 'Pediatric Well-Child Care',
    clinic: 'Parkview Medical Suites',
    feedback: 'Scheduling through MediBook saved us from days of telephone tag. Dr. Patel was wonderful with our toddler and provided clear, reassuring guidance.',
    date: 'Verified Demo Visit • October 2026',
    isDemo: true
  },
  {
    id: '3',
    author: 'S. Al-Khatib',
    visitType: 'Dermatology Screening',
    clinic: 'Metropolitan Health Center',
    feedback: 'Clean facility, zero wait time upon arrival, and upfront fee transparency. Dr. Sterling took time to explain mole surveillance steps clearly.',
    date: 'Verified Demo Visit • August 2026',
    isDemo: true
  }
];

export const HEALTHCARE_FAQS = [
  {
    question: 'How does appointment scheduling work on MediBook?',
    answer: 'You can search specialists by department, clinic location, or doctor name. Once you select a physician, you can view their real-time calendar, pick an available slot, input your consultation details, and receive an instant digital booking confirmation pass.'
  },
  {
    question: 'Are the consultation fees transparent and final?',
    answer: 'Yes. The fee displayed on each specialist profile reflects the full cost of the clinical consultation. MediBook does not charge patient platform fees or unexpected facility surcharges.'
  },
  {
    question: 'How do I reschedule or cancel an appointment?',
    answer: 'Confirmed appointments can be managed directly in the "My Appointments" portal. In accordance with clinic cancellation guidelines, appointments can be rescheduled up to 24 hours prior to the scheduled consultation window without penalty.'
  },
  {
    question: 'Is my health data and medical reason confidential?',
    answer: 'Yes. All personal contact information and consultation intake notes are transmitted over 256-bit TLS encrypted channels and stored in compliance with patient privacy standards. Only your assigned physician and clinic reception have authorized access.'
  },
  {
    question: 'Can I choose between an in-person clinic visit and a telehealth consultation?',
    answer: 'Yes. Many of our specialists offer both in-person consultations at affiliated hospital pavilions and secure, encrypted video telehealth sessions. You can filter by clinic location or telehealth when searching.'
  }
];
