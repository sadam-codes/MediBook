import doctor1 from '../assets/doctors/doctor1.png';
import doctor2 from '../assets/doctors/doctor2.png';
import doctor3 from '../assets/doctors/doctor3.png';
import doctor4 from '../assets/doctors/doctor4.png';
import doctor5 from '../assets/doctors/doctor5.png';
import doctor6 from '../assets/doctors/doctor6.png';

export const doctorData = [
    {
        id: 1,
        name: "Dr. Ali",
        spec: "Cardiology Specialist",
        exp: "12+ Years",
        img: doctor1,
        rating: 4.9,
        reviews: 124,
        bio: "Dr. Ali is a board-certified cardiologist with over 12 years of experience in treating complex heart conditions. She specializes in preventive cardiology and non-invasive imaging techniques. Her approach focuses on patient education and personalized treatment plans to ensure long-term cardiovascular health."
    },
    {
        id: 2,
        name: "Dr. Sana",
        spec: "Orthopedic Surgeon",
        exp: "15+ Years",
        img: doctor2,
        rating: 4.8,
        reviews: 98,
        bio: "Dr. Sana is a renowned orthopedic surgeon specializing in sports medicine and joint replacement. He has helped hundreds of athletes recover from career-threatening injuries. He utilizes minimally invasive surgical techniques to minimize recovery time and maximize patient outcomes."
    },
    {
        id: 3,
        name: "Dr. Ahmad",
        spec: "Senior Pediatrician",
        exp: "8+ Years",
        img: doctor3,
        rating: 5.0,
        reviews: 156,
        bio: "Dr. Ahmad is dedicated to providing compassionate care for children from infancy through adolescence. She is known for her gentle approach and expertise in developmental pediatrics. She believes in building strong partnerships with parents to ensure the healthy growth and development of every child."
    },
    {
        id: 4,
        name: "Dr. Maryam",
        spec: "Dermatology Specialist",
        exp: "10+ Years",
        img: doctor4,
        rating: 4.7,
        reviews: 84,
        bio: "Dr. Maryam specializes in both clinical and cosmetic dermatology. He is an expert in skin cancer screening, acne treatment, and advanced laser therapies for skin rejuvenation. He stays at the forefront of dermatological research to offer the most effective treatments for various skin concerns."
    },
    {
        id: 5,
        name: "Dr. Shahid",
        spec: "Neurology Expert",
        exp: "14+ Years",
        img: doctor5,
        rating: 4.9,
        reviews: 112,
        bio: "Dr. Shahid is a leading neurologist with a focus on neurodegenerative disorders and migraine management. She utilizes the latest diagnostic tools and therapeutic approaches to improve patient outcomes. Her research-driven practice ensures that patients receive the most advanced care available."
    },
    {
        id: 6,
        name: "Dr. Fatima",
        spec: "Internal Medicine",
        exp: "20+ Years",
        img: doctor6,
        rating: 4.6,
        reviews: 204,
        bio: "Dr. Fatima has over two decades of experience in internal medicine, providing comprehensive care for adults. He emphasizes holistic health and chronic disease management. His vast experience allows him to accurately diagnose and manage complex medical conditions."
    },
];

export const patientReviews = [
    {
        name: "Ali",
        role: "Patient",
        text: "Incredible experience. I found a specialist within minutes and booked an appointment seamlessly. The doctors are top-notch.",
        rating: 5,
        img: doctor5
    },
    {
        name: "Sara.",
        role: "Patient",
        text: "The platform is so easy to use. Highly professional doctors and a very clean booking system. It saved me a lot of time!",
        rating: 5,
        img: doctor4
    },
    {
        name: "Sonia",
        role: "Patient",
        text: "I love how I can see the doctor's complete profile and fee before booking. Very transparent and trustworthy service.",
        rating: 4,
        img: doctor6
    }
];

export const faqs = [
    {
        q: "How do I book an appointment?",
        a: "Simply browse through our list of verified specialists, check their availability, and click 'Book Now'. You'll need to complete your profile first to ensure the doctor has all the necessary information."
    },
    {
        q: "Is my medical data secure?",
        a: "Security is our top priority. We use advanced end-to-end encryption and comply with international healthcare data standards to ensure your medical records remains private and safe."
    },
    {
        q: "Can I join as a doctor?",
        a: "Yes! We are always looking for professional healthcare providers. Click the 'Join as Doctor' button on our home page to start the registration process and reach more patients."
    },
    {
        q: "Are there any hidden charges?",
        a: "No hidden fees at all. The consultation fee you see on the doctor's profile is the exact amount you pay. We believe in complete transparency for our users."
    },
    {
        q: "What if I need to reschedule?",
        a: "You can easily manage your appointments from your dashboard. Most doctors allow rescheduling up to 24 hours before the appointment time."
    }
];
