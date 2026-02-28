import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, UserPlus, Calendar } from 'lucide-react';

export const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (!user) {
        return null; // or a loading spinner, handled by ProtectedRoute anyway
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            <nav className="bg-white shadow-sm z-10 border-b border-gray-200 shrink-0 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={() => navigate('/home')}>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">M</div>
                        <div className="font-bold text-lg sm:text-xl tracking-tight text-gray-900">MediBook<span className="text-emerald-600">AI</span></div>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-6">
                        <div className="hidden sm:flex items-center mr-4 space-x-6">
                            {user.role === 'patient' && !user.hasDoctorProfile && (
                                <button onClick={() => navigate('/join-doctor')} className="text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors flex items-center">
                                    <UserPlus size={16} className="mr-2" /> Join as Doctor
                                </button>
                            )}
                            {user.role === 'patient' && !user.hasPatientProfile && (
                                <button onClick={() => navigate('/complete-profile')} className="text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors">
                                    Complete Profile
                                </button>
                            )}
                        </div>
                        <div className="hidden sm:flex items-center space-x-3 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200">
                            <span className="hidden md:block text-sm font-medium text-gray-700">{user.firstName}</span>
                            <button
                                onClick={handleLogout}
                                className="hidden sm:block px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-md text-xs hover:bg-gray-50 transition-colors ml-2"
                            >
                                Log Out
                            </button>
                        </div>

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

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div
                        className="sm:hidden fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
                <div
                    className={`sm:hidden absolute top-4 left-4 right-4 bg-white shadow-2xl z-50 rounded-3xl overflow-hidden transition-all duration-300 ease-out flex flex-col ${isMobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' : 'opacity-0 -translate-y-8 pointer-events-none scale-95'}`}
                >
                    <div className="p-6 flex flex-col space-y-5 relative">
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center space-x-4 pb-5 border-b border-gray-100">
                            <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md transform rotate-3">
                                {user.firstName?.[0] || 'U'}
                            </div>
                            <div>
                                <p className="font-extrabold text-gray-900 text-xl tracking-tight">{user.firstName} {user.lastName}</p>
                                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mt-0.5">{user.role}</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-1">
                            {user.role === 'patient' && !user.hasDoctorProfile && (
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
                            {user.role === 'patient' && !user.hasPatientProfile && (
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
                                <div className="p-2 bg-white rounded-xl shadow-sm mr-3 group-hover:bg-emerald-100 transition-colors">
                                    <div className="text-gray-500 group-hover:text-emerald-600 transition-colors font-bold text-center w-[18px]">H</div>
                                </div>
                                Dashboard Home
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full text-center px-5 py-4 mt-2 bg-white text-gray-600 font-bold rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all border border-gray-200 hover:border-red-200"
                        >
                            Secure Log Out
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content Area - Render child routes here */}
            <main className="flex-1 min-h-0 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
                    <Outlet />
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
};
