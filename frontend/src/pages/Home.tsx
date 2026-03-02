import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// Modular Home Components
import HeroSection from '../components/home/HeroSection';
import DoctorJoinSection from '../components/home/DoctorJoinSection';
import DoctorsSpecialistsSection from '../components/home/DoctorsSpecialistsSection';
import ReviewsSection from '../components/home/ReviewsSection';
import FAQSection from '../components/home/FAQSection';
import HomeFooter from '../components/home/HomeFooter';
import DoctorProfileModal from '../components/home/DoctorProfileModal';
import PatientDashboard from '../components/home/PatientDashboard';
import DoctorDashboard from '../components/home/DoctorDashboard';
import AdminDashboard from '../components/home/AdminDashboard';

const api = axios.create({ baseURL: 'http://localhost:5000' });

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const user = useMemo(() => {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString) : null;
    }, []);

    const [doctors, setDoctors] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user?.id, user?.role]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (user?.role === 'patient') {
                const res = await api.get('/doctors');
                setDoctors(res.data);
            } else if (user?.role === 'admin') {
                const res = await api.get('/users');
                setAllUsers(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId: number, newRole: string) => {
        try {
            await api.patch(`/users/${userId}/role`, { role: newRole });
            toast.success(`Role updated to ${newRole}`);
            fetchData();
        } catch (err: any) {
            console.error('Failed to update role:', err);
            toast.error(err.response?.data?.message || 'Failed to update role');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${userId}`);
            toast.success('User deleted successfully');
            fetchData();
        } catch (err: any) {
            console.error('Failed to delete user:', err);
            toast.error(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const showLanding = !user || (user.role === 'patient' && !user.hasPatientProfile);

    return (
        <React.Fragment>
            <DoctorProfileModal
                doctor={selectedDoctor}
                isOpen={!!selectedDoctor}
                onClose={() => setSelectedDoctor(null)}
                onBook={() => {
                    setSelectedDoctor(null);
                    navigate('/complete-profile');
                }}
            />

            {showLanding ? (
                <div className="flex-1 flex flex-col pt-2 pb-12">
                    <HeroSection onBookClick={() => navigate('/complete-profile')} />
                    <DoctorsSpecialistsSection onViewProfile={(doc) => setSelectedDoctor(doc)} />
                    <DoctorJoinSection />
                    <ReviewsSection />
                    <FAQSection />
                    <HomeFooter />
                </div>
            ) : (
                <div className="flex-1 flex flex-col h-full">
                    {user?.role === 'patient' && (
                        <PatientDashboard doctors={doctors} loading={loading} />
                    )}
                    {user?.role === 'doctor' && (
                        <DoctorDashboard user={user} />
                    )}
                    {user?.role === 'admin' && (
                        <AdminDashboard
                            allUsers={allUsers}
                            loading={loading}
                            onRoleUpdate={handleRoleUpdate}
                            onDeleteUser={handleDeleteUser}
                        />
                    )}
                </div>
            )}

            <style>{`
                input:focus, select:focus { outline: none; border-color: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
            `}</style>
        </React.Fragment>
    );
};
