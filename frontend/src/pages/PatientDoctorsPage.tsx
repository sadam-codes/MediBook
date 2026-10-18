import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../services/api';
import PatientDashboard from '../components/home/PatientDashboard';
import DoctorProfileModal from '../components/home/DoctorProfileModal';
import InteractiveBookingModal from '../components/home/InteractiveBookingModal';
import { DEMO_DOCTORS } from '../data/healthcareData';

export const PatientDoctorsPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useMemo(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    }, []);

    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [bookingDoctor, setBookingDoctor] = useState<any>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        if (user?.role !== 'patient') {
            navigate('/');
            return;
        }
        fetchDoctors();
    }, [user?.role]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const res = await api.get('/doctors');
            if (res.data && res.data.length > 0) {
                setDoctors(res.data);
            } else {
                setDoctors(DEMO_DOCTORS);
            }
        } catch (err) {
            console.error('Failed to fetch doctors, using demo doctors:', err);
            setDoctors(DEMO_DOCTORS);
        } finally {
            setLoading(false);
        }
    };

    const mapDoctorToUi = (d: any) => {
        if (d.image && d.clinic) return d;
        return {
            name: `Dr. ${d.user?.fullName || d.name}`,
            spec: d.specialization || d.specialty || 'General Specialist',
            exp: `${d.experience || 10} Years Exp.`,
            rating: d.averageRating ? String(Number(d.averageRating).toFixed(1)) : '4.9',
            reviews: d.reviewCount ? `${d.reviewCount}+` : '100+',
            img: d.user?.profileImage
                ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${d.user.profileImage}`
                : (d.image || '/default-doc.png'),
            bio: d.bio || 'Accredited specialist providing personalized medical evaluation.',
            originalData: d,
        };
    };

    return (
        <div className="flex-1 flex flex-col text-left">
            <button
                type="button"
                onClick={() => navigate('/patient')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#687773] hover:text-[#173D39] mb-6 transition-colors self-start"
            >
                <ArrowLeft size={15} />
                <span>Return to Patient Portal</span>
            </button>

            {loading && doctors.length === 0 ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-[#173D39]" size={32} />
                </div>
            ) : (
                <PatientDashboard
                    doctors={doctors}
                    loading={loading}
                    onViewProfile={(doc) => setSelectedDoctor(mapDoctorToUi(doc))}
                />
            )}

            <DoctorProfileModal
                doctor={selectedDoctor}
                isOpen={!!selectedDoctor}
                onClose={() => setSelectedDoctor(null)}
                onBookAppointment={(doc) => {
                    setSelectedDoctor(null);
                    setBookingDoctor(doc);
                    setIsBookingModalOpen(true);
                }}
            />

            <InteractiveBookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                initialDoctor={bookingDoctor}
            />
        </div>
    );
};

export default PatientDoctorsPage;
