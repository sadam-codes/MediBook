import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../services/api';
import PatientDashboard from '../components/home/PatientDashboard';
import DoctorProfileModal from '../components/home/DoctorProfileModal';

export const PatientDoctorsPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useMemo(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    }, []);

    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

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
            setDoctors(res.data);
        } catch (err) {
            console.error('Failed to fetch doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    const mapDoctorToUi = (d: any) => ({
        name: `Dr. ${d.user?.fullName}`,
        spec: d.specialization,
        exp: `${d.experience} Years Exp.`,
        rating: d.averageRating ? String(Number(d.averageRating).toFixed(1)) : null,
        reviews: d.reviewCount ? `${d.reviewCount}+` : null,
        img: d.user?.profileImage
            ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${d.user.profileImage}`
            : '/default-doc.png',
        bio: d.bio || 'Leading specialist in medical care.',
        originalData: d,
    });

    return (
        <div className="flex-1 flex flex-col">
            <button
                type="button"
                onClick={() => navigate('/patient')}
                className="flex items-center space-x-2 text-slate-400 hover:text-sky-600 mb-6 transition-colors group self-start"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Back to Portal</span>
            </button>

            {loading && doctors.length === 0 ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-sky-600" size={32} />
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
            />
        </div>
    );
};

export default PatientDoctorsPage;
