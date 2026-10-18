import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

// Redesigned Healthcare Home Components
import HeroSection from '../components/home/HeroSection';
import MedicalPhotographySection from '../components/home/MedicalPhotographySection';
import SpecialtiesSection from '../components/home/SpecialtiesSection';
import DoctorsSpecialistsSection from '../components/home/DoctorsSpecialistsSection';
import BookingExplanationSection from '../components/home/BookingExplanationSection';
import TrustSection from '../components/home/TrustSection';
import ReviewsSection from '../components/home/ReviewsSection';
import DoctorJoinSection from '../components/home/DoctorJoinSection';
import FAQSection from '../components/home/FAQSection';
import HomeFooter from '../components/home/HomeFooter';

// Modals
import DoctorProfileModal from '../components/home/DoctorProfileModal';
import InteractiveBookingModal from '../components/home/InteractiveBookingModal';
import DoctorDashboard from '../components/home/DoctorDashboard';
import AdminDashboard from '../components/home/AdminDashboard';
import { ConfirmModal } from '../components/ui/ConfirmModal';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const user = useMemo(() => {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString) : null;
    }, []);

    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [allBookings, setAllBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Selected doctor for Profile Modal
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

    // Selected doctor for Interactive Booking Modal
    const [bookingDoctor, setBookingDoctor] = useState<any>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Specialty filter state (can be set by Hero search or Specialties section)
    const [activeSpecialty, setActiveSpecialty] = useState<string>('All');

    // Admin state
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        if (user) {
            const currentPath = window.location.pathname;
            if (currentPath === '/') {
                if (user.role === 'patient') navigate('/patient');
                else if (user.role === 'doctor') navigate('/doctor');
                else if (user.role === 'admin') navigate('/admin');
            } else if (currentPath === '/doctor' && user.role !== 'doctor') navigate('/');
            else if (currentPath === '/admin' && user.role !== 'admin') navigate('/');
        }
        fetchData();
    }, [user?.id, user?.role, window.location.pathname]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (user?.role === 'admin') {
                const [usersRes, bookingsRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/appointments/admin'),
                ]);
                setAllUsers(usersRes.data);
                setAllBookings(bookingsRes.data);
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

    const handleHeroSearch = (params: { specialty: string; location: string; query: string }) => {
        if (params.specialty) {
            setActiveSpecialty(params.specialty);
        }
    };

    const handleSelectSpecialtyFromGrid = (specialtyName: string) => {
        setActiveSpecialty(specialtyName);
        const elem = document.getElementById('doctors-list');
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleOpenBooking = (doc?: any) => {
        setBookingDoctor(doc || null);
        setIsBookingModalOpen(true);
    };

    const showLanding = !user;

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

            {/* Doctor Profile View Modal */}
            <DoctorProfileModal
                doctor={selectedDoctor}
                isOpen={!!selectedDoctor}
                onClose={() => setSelectedDoctor(null)}
                onBookAppointment={(doc) => {
                    setSelectedDoctor(null);
                    handleOpenBooking(doc);
                }}
            />

            {/* 4-Step Interactive Appointment Booking Modal */}
            <InteractiveBookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                initialDoctor={bookingDoctor}
            />

            {showLanding ? (
                <div className="flex-1 flex flex-col">
                    {/* 1. Distinctive Hero Section with integrated doctor search */}
                    <HeroSection
                        onSearch={handleHeroSearch}
                        onBookClick={() => handleOpenBooking()}
                    />

                    {/* 2. Authentic Medical Facility & Consultation Photography Section */}
                    <MedicalPhotographySection />

                    {/* 3. Seven Clinical Specialties Section */}
                    <SpecialtiesSection
                        onSelectSpecialty={handleSelectSpecialtyFromGrid}
                    />

                    {/* 4. Featured Doctors & Restrained Doctor Cards */}
                    <DoctorsSpecialistsSection
                        onViewProfile={(doc) => setSelectedDoctor(doc)}
                        onBookDoctor={(doc) => handleOpenBooking(doc)}
                        activeSpecialtyFilter={activeSpecialty}
                        onClearSpecialtyFilter={() => setActiveSpecialty('All')}
                    />

                    {/* 5. Simple Three-Step Appointment Explanation */}
                    <BookingExplanationSection
                        onStartBooking={() => handleOpenBooking()}
                    />

                    {/* 6. Verifiable Healthcare Trust Standards */}
                    <TrustSection />

                    {/* 7. Patient Feedback (Clearly Labeled Demo Data) */}
                    <ReviewsSection />

                    {/* 8. Physician Network Registration */}
                    <DoctorJoinSection />

                    {/* 9. Frequently Asked Clinical Questions */}
                    <FAQSection />

                    {/* 10. Clean Hospital Network Footer */}
                    <HomeFooter />
                </div>
            ) : (
                <div className="flex-1 flex flex-col h-full">
                    {user?.role === 'doctor' && (
                        <DoctorDashboard user={user} />
                    )}
                    {user?.role === 'admin' && (
                        <AdminDashboard
                            allUsers={allUsers}
                            allBookings={allBookings}
                            loading={loading}
                            onRoleUpdate={handleRoleUpdate}
                            onDeleteUser={handleDeleteUser}
                        />
                    )}
                </div>
            )}
        </React.Fragment>
    );
};

export default Home;
