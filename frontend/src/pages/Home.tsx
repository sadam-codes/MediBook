import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import api from '../services/api';

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

import { ConfirmModal } from '../components/ui/ConfirmModal';



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
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        if (user) {
            const currentPath = window.location.pathname;
            if (currentPath === '/') {
                if (user.role === 'patient') navigate('/patient');
                else if (user.role === 'doctor') navigate('/doctor');
                else if (user.role === 'admin') navigate('/admin');
            } else if (currentPath === '/patient' && user.role !== 'patient') navigate('/');
            else if (currentPath === '/doctor' && user.role !== 'doctor') navigate('/');
            else if (currentPath === '/admin' && user.role !== 'admin') navigate('/');
        }
        fetchData();
    }, [user?.id, user?.role, window.location.pathname]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Always fetch available doctors to show on landing page / dashboard
            const doctsRes = await api.get('/doctors');
            setDoctors(doctsRes.data);

            if (user?.role === 'admin') {
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

    const handleDeleteUser = (userId: number) => {
        setUserToDelete(userId);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await api.delete(`/users/${userToDelete}`);
            toast.success('User deleted successfully');
            fetchData();
        } catch (err: any) {
            console.error('Failed to delete user:', err);
            toast.error(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setUserToDelete(null);
        }
    };

    const showLanding = !user;

    const mapDoctorToUi = (d: any) => {
        if (!d) return null;
        if (d.name && d.spec) return d; // Already mapped (mock data)
        return {
            name: `Dr. ${d.user?.fullName}`,
            spec: d.specialization,
            exp: `${d.experience} Years Exp.`,
            rating: "4.9",
            reviews: "120+",
            img: d.user?.profileImage ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${d.user.profileImage}` : "/default-doc.png",
            bio: d.bio || "Leading specialist in medical care.",
            originalData: d
        };
    };

    return (
        <React.Fragment>
            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={confirmDeleteUser}
                title="Delete User"
                message="Are you sure you want to permanently delete this user? This action is irreversible."
                confirmText="Delete Now"
                type="danger"
            />
            <DoctorProfileModal
                doctor={selectedDoctor}
                isOpen={!!selectedDoctor}
                onClose={() => setSelectedDoctor(null)}
            />

            {showLanding ? (
                <div className="flex-1 flex flex-col pt-2 pb-12">
                    <HeroSection onBookClick={() => navigate('/complete-profile')} />
                    <DoctorsSpecialistsSection
                        doctors={[]}
                        onViewProfile={() => {
                            sessionStorage.setItem('showLogin', 'true');
                            window.location.reload();
                        }}
                    />
                    <DoctorJoinSection />
                    <ReviewsSection />
                    <FAQSection />
                    <HomeFooter />
                </div>
            ) : (
                <div className="flex-1 flex flex-col h-full">
                    {user?.role === 'patient' && (
                        <PatientDashboard
                            doctors={doctors}
                            loading={loading}
                            onViewProfile={(doc) => setSelectedDoctor(mapDoctorToUi(doc))}
                        />
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
