import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, LogOut, ChevronDown, Stethoscope, Building2, ShieldCheck, HeartPulse } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { Chatbot } from '../components/chatbot/Chatbot';
import { ProfilePhotoButton, type LayoutUser } from '../components/ProfilePhotoButton';
import { ClinicsModal } from '../components/home/ClinicsModal';

function readUserFromStorage(): LayoutUser | null {
    try {
        const s = localStorage.getItem('user');
        return s ? JSON.parse(s) : null;
    } catch {
        return null;
    }
}

export const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<LayoutUser | null>(readUserFromStorage);
    const [avatarKey, setAvatarKey] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isClinicsModalOpen, setIsClinicsModalOpen] = useState(false);

    const patchUser = (patch: Partial<LayoutUser>) => {
        setUser((prev) => {
            if (!prev) return prev;
            const next = { ...prev, ...patch };
            localStorage.setItem('user', JSON.stringify(next));
            return next;
        });
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.setItem('showLogin', 'true');
        navigate('/');
        window.location.reload();
    };

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [signupInitRole, setSignupInitRole] = useState<'patient' | 'doctor'>('patient');

    const openAuthModal = (mode: 'login' | 'signup', role?: 'patient' | 'doctor') => {
        setAuthMode(mode);
        if (role) setSignupInitRole(role);
        setIsAuthModalOpen(true);
    };

    React.useEffect(() => {
        const showLogin = sessionStorage.getItem('showLogin');
        const showSignup = sessionStorage.getItem('showSignup');
        const signupRole = sessionStorage.getItem('signupRole') as 'patient' | 'doctor';

        if (showLogin === 'true') {
            sessionStorage.removeItem('showLogin');
            openAuthModal('login');
        } else if (showSignup === 'true') {
            sessionStorage.removeItem('showSignup');
            if (signupRole) sessionStorage.removeItem('signupRole');
            openAuthModal('signup', signupRole || 'patient');
        }
    }, []);

    React.useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const scrollToSection = (id: string) => {
        setIsMobileMenuOpen(false);
        if (location.pathname !== '/') {
            navigate(`/#${id}`);
            return;
        }
        const elem = document.getElementById(id);
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleMyAppointmentsClick = () => {
        setIsMobileMenuOpen(false);
        if (user) {
            navigate('/bookings');
        } else {
            openAuthModal('login');
        }
    };

    const handleBookAppointmentClick = () => {
        setIsMobileMenuOpen(false);
        if (location.pathname === '/') {
            const elem = document.getElementById('doctors-list');
            if (elem) {
                elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
        }
        if (user?.role === 'patient') {
            navigate('/patient/doctors');
        } else {
            navigate('/');
            setTimeout(() => {
                const elem = document.getElementById('doctors-list');
                if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#192B29]">
            {/* Top clinical announcement bar */}
            <div className="bg-[#173D39] text-[#E8F0ED] text-[12px] font-medium py-1.5 px-4 text-center border-b border-[#245B54]">
                <div className="site-container flex items-center justify-between">
                    <div className="flex items-center gap-2 mx-auto sm:mx-0">
                        <span className="w-2 h-2 rounded-full bg-[#BDE8DA] inline-block animate-pulse" />
                        <span>Verified Clinical Calendar: Real-time appointment slots open across all outpatient centers.</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs opacity-90">
                        <span className="flex items-center gap-1">
                            <ShieldCheck size={13} className="text-[#BDE8DA]" /> Hospital-Grade Data Security
                        </span>
                        <span>•</span>
                        <span>Patient Inquiries: (555) 018-4200</span>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <nav className={`bg-white border-b border-[#DDE6E2] sticky top-0 z-50 transition-all duration-200 ${isMobileMenuOpen ? 'z-[200]' : 'z-50'}`}>
                <div className="site-container h-18 sm:h-20 flex items-center justify-between">
                    {/* Brand Identity */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => {
                            if (user?.role === 'patient') navigate('/patient');
                            else if (user?.role === 'doctor') navigate('/doctor');
                            else if (user?.role === 'admin') navigate('/admin');
                            else navigate('/');
                        }}
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#173D39] flex items-center justify-center text-[#BDE8DA] border border-[#245B54] group-hover:bg-[#245B54] transition-colors shadow-sm">
                            <HeartPulse size={22} className="stroke-[2.2]" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xl sm:text-2xl text-[#173D39] tracking-tight leading-none">
                                    MediBook
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E8F0ED] text-[#173D39] uppercase tracking-wider">
                                    Health
                                </span>
                            </div>
                            <span className="text-[11px] font-medium text-[#687773] tracking-wide mt-0.5 hidden xs:block">
                                Clinical Specialist Network
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-8 text-[14px] font-semibold text-[#192B29]">
                        <button
                            onClick={() => scrollToSection('doctors-list')}
                            className="hover:text-[#173D39] transition-colors focus-visible:outline-none focus-visible:underline"
                        >
                            Find a Doctor
                        </button>
                        <button
                            onClick={() => scrollToSection('specialties')}
                            className="hover:text-[#173D39] transition-colors focus-visible:outline-none focus-visible:underline"
                        >
                            Specialties
                        </button>
                        <button
                            onClick={() => setIsClinicsModalOpen(true)}
                            className="hover:text-[#173D39] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:underline"
                        >
                            <Building2 size={15} className="text-[#245B54]" />
                            <span>Hospitals & Clinics</span>
                        </button>
                        <button
                            onClick={handleMyAppointmentsClick}
                            className="hover:text-[#173D39] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:underline"
                        >
                            <Calendar size={15} className="text-[#245B54]" />
                            <span>My Appointments</span>
                        </button>
                    </div>

                    {/* Actions / Auth / Profile */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {user ? (
                            <div className="hidden sm:flex items-center gap-3">
                                <div className="flex items-center gap-3 px-3.5 py-2 bg-[#F3F7F5] rounded-xl border border-[#DDE6E2] group">
                                    <div className="relative shrink-0">
                                        <ProfilePhotoButton
                                            user={user}
                                            cacheKey={avatarKey}
                                            onUpdated={(p) => patchUser(p)}
                                            onCacheBust={() => setAvatarKey((k) => k + 1)}
                                            size="sm"
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#237A57] border-2 border-white rounded-full shadow-sm" />
                                    </div>
                                    <div className="flex flex-col items-start pr-1">
                                        <span className="text-xs font-bold text-[#192B29] leading-tight">{user.fullName}</span>
                                        <span className="text-[10px] font-semibold text-[#173D39] uppercase tracking-wide">{user.role}</span>
                                    </div>
                                    <ChevronDown size={14} className="text-[#687773] group-hover:text-[#192B29] transition-colors" />
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 text-[#687773] hover:text-[#B42318] hover:bg-[#F3F7F5] rounded-xl transition-all border border-transparent hover:border-[#DDE6E2]"
                                    title="Logout"
                                    aria-label="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-3">
                                <button
                                    onClick={() => openAuthModal('login')}
                                    className="px-4 py-2 text-sm font-semibold text-[#173D39] hover:bg-[#F3F7F5] rounded-lg transition-colors border border-transparent hover:border-[#DDE6E2]"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={handleBookAppointmentClick}
                                    className="medical-btn-primary"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Toggle Button */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2.5 text-[#192B29] hover:text-[#173D39] bg-[#F3F7F5] border border-[#DDE6E2] rounded-xl transition-colors"
                                aria-label="Toggle Navigation Menu"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer Menu */}
                <div
                    className={`lg:hidden fixed inset-0 top-[110px] bg-white z-[100] transition-transform duration-300 ease-in-out flex flex-col border-t border-[#DDE6E2] ${
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
                    }`}
                >
                    <div className="p-6 flex flex-col h-full overflow-y-auto space-y-6">
                        {user ? (
                            <div className="flex items-center gap-4 p-4 bg-[#F3F7F5] rounded-xl border border-[#DDE6E2]">
                                <ProfilePhotoButton
                                    user={user}
                                    cacheKey={avatarKey}
                                    onUpdated={(p) => patchUser(p)}
                                    onCacheBust={() => setAvatarKey((k) => k + 1)}
                                    size="md"
                                />
                                <div>
                                    <p className="font-bold text-[#192B29] text-base">{user.fullName}</p>
                                    <p className="text-xs font-semibold text-[#173D39] uppercase tracking-wide">{user.role} Account</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-[#F3F7F5] rounded-xl border border-[#DDE6E2]">
                                <h3 className="font-bold text-[#192B29] text-base">MediBook Clinical Access</h3>
                                <p className="text-xs text-[#687773] mt-1">Book consultations with board-certified hospital specialists</p>
                            </div>
                        )}

                        {/* Mobile Nav Links */}
                        <div className="space-y-2">
                            <button
                                onClick={() => scrollToSection('doctors-list')}
                                className="w-full text-left px-4 py-3 rounded-lg font-semibold text-[#192B29] hover:bg-[#F3F7F5] hover:text-[#173D39] transition-colors flex items-center justify-between"
                            >
                                <span>Find a Doctor</span>
                                <Stethoscope size={18} className="text-[#245B54]" />
                            </button>
                            <button
                                onClick={() => scrollToSection('specialties')}
                                className="w-full text-left px-4 py-3 rounded-lg font-semibold text-[#192B29] hover:bg-[#F3F7F5] hover:text-[#173D39] transition-colors flex items-center justify-between"
                            >
                                <span>Clinical Specialties</span>
                                <HeartPulse size={18} className="text-[#245B54]" />
                            </button>
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsClinicsModalOpen(true);
                                }}
                                className="w-full text-left px-4 py-3 rounded-lg font-semibold text-[#192B29] hover:bg-[#F3F7F5] hover:text-[#173D39] transition-colors flex items-center justify-between"
                            >
                                <span>Hospitals & Clinics</span>
                                <Building2 size={18} className="text-[#245B54]" />
                            </button>
                            <button
                                onClick={handleMyAppointmentsClick}
                                className="w-full text-left px-4 py-3 rounded-lg font-semibold text-[#192B29] hover:bg-[#F3F7F5] hover:text-[#173D39] transition-colors flex items-center justify-between"
                            >
                                <span>My Appointments</span>
                                <Calendar size={18} className="text-[#245B54]" />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-[#DDE6E2] space-y-3 mt-auto">
                            <button
                                onClick={handleBookAppointmentClick}
                                className="w-full py-3.5 rounded-xl bg-[#173D39] text-white font-bold text-sm hover:bg-[#245B54] transition-colors shadow-sm text-center"
                            >
                                Book Specialist Appointment
                            </button>

                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-3 rounded-xl border border-[#DDE6E2] font-semibold text-[#B42318] hover:bg-[#F3F7F5] transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            openAuthModal('login');
                                        }}
                                        className="py-2.5 rounded-lg border border-[#DDE6E2] text-[#192B29] font-semibold text-sm hover:bg-[#F3F7F5] transition-colors text-center"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            openAuthModal('signup');
                                        }}
                                        className="py-2.5 rounded-lg bg-[#E8F0ED] text-[#173D39] font-semibold text-sm hover:bg-[#BDE8DA] transition-colors text-center border border-[#DDE6E2]"
                                    >
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1">
                <Outlet />
            </main>

            {user?.role === 'patient' && <Chatbot />}

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => {
                    setIsAuthModalOpen(false);
                    setUser(readUserFromStorage());
                }}
                initialMode={authMode}
                initialRole={signupInitRole}
            />

            <ClinicsModal
                isOpen={isClinicsModalOpen}
                onClose={() => setIsClinicsModalOpen(false)}
                onSelectClinic={() => {
                    scrollToSection('doctors-list');
                }}
            />
        </div>
    );
};
