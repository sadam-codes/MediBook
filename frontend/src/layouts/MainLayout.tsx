import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, UserPlus, Calendar } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

export const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            <nav className={`bg-white shadow-sm border-b border-gray-200 shrink-0 relative transition-all duration-300 ${isMobileMenuOpen ? 'z-[200]' : 'z-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={() => navigate('/home')}>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">M</div>
                        <div className="font-bold text-lg sm:text-xl tracking-tight text-gray-900">MediBook<span className="text-emerald-600">AI</span></div>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-6">
                        <div className="hidden sm:flex items-center mr-4 space-x-6">
                            {user?.role === 'patient' && !user.hasDoctorProfile && (
                                <button onClick={() => navigate('/join-doctor')} className="text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors flex items-center">
                                    <UserPlus size={16} className="mr-2" /> Join as Doctor
                                </button>
                            )}
                            {user?.role === 'patient' && !user.hasPatientProfile && (
                                <button onClick={() => navigate('/complete-profile')} className="text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors">
                                    Complete Profile
                                </button>
                            )}
                        </div>
                        {user ? (
                            <div className="hidden sm:flex items-center space-x-3 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200">
                                <span className="hidden md:block text-sm font-medium text-gray-700">{user.firstName}</span>
                                <button
                                    onClick={handleLogout}
                                    className="hidden sm:block px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-md text-xs hover:bg-gray-50 transition-colors ml-2"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center space-x-3">
                                <button
                                    onClick={() => openAuthModal('login')}
                                    className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-emerald-600 transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => openAuthModal('signup')}
                                    className="px-5 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <div className="sm:hidden flex items-center ml-2">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-gray-700 hover:text-emerald-600 active:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm"
                            >
                                <Menu size={22} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown Menu - Full Screen Opaque */}
                <div
                    className={`sm:hidden fixed inset-0 bg-white z-[100] duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}
                >
                    <div className="p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-12 shrink-0">
                            <div className="flex items-center space-x-1">
                                <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-lg">M</div>
                                <div className="font-bold text-2xl tracking-tighter text-gray-900">MediBook<span className="text-emerald-600">AI</span></div>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-3 text-gray-400 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 rounded-2xl transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {user ? (
                            <div className="flex items-center space-x-4 pb-5 border-b border-gray-100">
                                <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md transform rotate-3">
                                    {user.firstName?.[0] || 'U'}
                                </div>
                                <div>
                                    <p className="font-extrabold text-gray-900 text-xl tracking-tight">{user.firstName} {user.lastName}</p>
                                    <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mt-0.5">{user.role}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="pb-5 border-b border-gray-100">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Welcome</h3>
                                <p className="text-sm font-bold text-gray-400">Join MediBookAI today</p>
                            </div>
                        )}

                        <div className="space-y-3 pt-1">
                            {user?.role === 'patient' && !user?.hasDoctorProfile && (
                                <button
                                    onClick={() => { navigate('/join-doctor'); setIsMobileMenuOpen(false); }}
                                    className="w-full text-left px-5 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 flex items-center transition-all group"
                                >
                                    <div className="p-2 bg-white rounded-xl shadow-sm mr-3 group-hover:bg-emerald-100 transition-colors">
                                        <UserPlus size={18} className="text-gray-500 group-hover:text-emerald-600 transition-colors" />
                                    </div>
                                    Join as Doctor
                                </button>
                            )}
                            {user?.role === 'patient' && !user?.hasPatientProfile && (
                                <button
                                    onClick={() => { navigate('/complete-profile'); setIsMobileMenuOpen(false); }}
                                    className="w-full text-left px-5 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 flex items-center transition-all group"
                                >
                                    <div className="p-2 bg-white rounded-xl shadow-sm mr-3 group-hover:bg-emerald-100 transition-colors">
                                        <Calendar size={18} className="text-gray-500 group-hover:text-emerald-600 transition-colors" />
                                    </div>
                                    Complete Profile
                                </button>
                            )}

                            {/* Always show home link in mobile menu for easy navigation */}
                            <button
                                onClick={() => { navigate('/home'); setIsMobileMenuOpen(false); }}
                                className="w-full text-left px-5 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 flex items-center transition-all group"
                            >

                                {user ? 'Dashboard Home' : 'Home'}
                            </button>
                        </div>

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-center px-5 py-4 mt-2 bg-white text-gray-600 font-bold rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all border border-gray-200 hover:border-red-200"
                            >
                                Secure Log Out
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <button
                                    onClick={() => { openAuthModal('login'); setIsMobileMenuOpen(false); }}
                                    className="text-center px-5 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-transparent"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => { openAuthModal('signup'); setIsMobileMenuOpen(false); }}
                                    className="text-center px-5 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content Area - Render child routes here */}
            <main className="flex-1 min-h-0 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
                    <Outlet />
                </div>
            </main>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
                initialRole={signupInitRole}
            />
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
};
