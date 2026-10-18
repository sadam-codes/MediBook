import { DEMO_DOCTORS, HEALTHCARE_FAQS, PATIENT_FEEDBACK_DEMO } from './healthcareData';

// Backward compatible mapping for existing components
export const doctorData = DEMO_DOCTORS.map((d) => ({
    id: d.id,
    userId: d.userId,
    name: d.name,
    spec: `${d.specialty} Specialist`,
    exp: `${d.experienceYears}+ Years`,
    img: d.image,
    rating: d.rating,
    reviews: d.reviewCount,
    bio: d.bio,
    fee: d.consultationFee,
    clinic: d.clinic.name,
    nextSlot: d.nextAvailable.label,
    originalData: d
}));

export const patientReviews = PATIENT_FEEDBACK_DEMO.map((p, idx) => ({
    name: p.author,
    role: p.visitType,
    text: p.feedback,
    rating: 5,
    clinic: p.clinic,
    date: p.date,
    isDemo: p.isDemo,
    img: DEMO_DOCTORS[idx % DEMO_DOCTORS.length].image
}));

export const faqs = HEALTHCARE_FAQS.map((f) => ({
    q: f.question,
    a: f.answer
}));
