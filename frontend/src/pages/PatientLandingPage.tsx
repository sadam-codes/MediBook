import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, CreditCard, Stethoscope, Clock, ChevronRight,
    Loader2, UserPlus, Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { isUpcomingAppointment } from '../utils/appointmentUtils';

export const PatientLandingPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useMemo(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    }, []);

    const [upcomingCount, setUpcomingCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role !== 'patient') {
            navigate('/');
            return;
        }
        fetchSummary();
    }, [user?.role]);

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const res = await api.get('/appointments/my');
            setUpcomingCount(res.data.filter(isUpcomingAppointment).length);
        } catch {
            setUpcomingCount(0);
        } finally {
            setLoading(false);
        }
    };

    const firstName = user?.fullName?.split(' ')[0] ?? 'Patient';

    const sections = [
        {
            title: 'Book Appointment',
            desc: 'Browse verified specialists and schedule your visit',
            icon: Stethoscope,
            color: 'from-sky-500 to-sky-600',
            shadow: 'shadow-sky-500/20',
            path: '/patient/doctors',
        },
        {
            title: 'My Bookings',
            desc: 'View, reschedule or cancel upcoming visits',
            icon: Calendar,
            color: 'from-emerald-500 to-emerald-600',
            shadow: 'shadow-emerald-500/20',
            path: '/bookings',
            badge: loading ? undefined : `${upcomingCount} upcoming`,
        },
        {
            title: 'Payments',
            desc: 'Consultation fees and transaction history',
            icon: CreditCard,
            color: 'from-violet-500 to-violet-600',
            shadow: 'shadow-violet-500/20',
            path: '/payments',
        },
        {
            title: 'Find Doctors',
            desc: 'Explore by specialty, experience and clinic',
            icon: Sparkles,
            color: 'from-amber-500 to-orange-500',
            shadow: 'shadow-amber-500/20',
            path: '/patient/doctors',
        },
    ];

    return (
        <div className="flex-1 pb-16">
            <div className="relative overflow-hidden rounded-[32px] bg-slate-900 p-8 md:p-12 mb-10 border border-white/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="text-left">
                        <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.4em] mb-3">
                            Patient Portal
                        </p>
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
                            Hello, <span className="text-sky-400">{firstName}</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-sm max-w-lg">
                            Complete appointment lifecycle management — hospital-grade workflow.
                            Book, pay, manage and review your care in one place.
                        </p>
                    </div>
                    <div className="flex gap-4 shrink-0">
                        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-6 py-5 text-center min-w-[120px]">
                            {loading ? (
                                <Loader2 size={20} className="animate-spin text-sky-400 mx-auto" />
                            ) : (
                                <>
                                    <p className="text-3xl font-black text-white">{upcomingCount}</p>
                                    <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest mt-1">Upcoming</p>
                                </>
                            )}
                        </div>
                        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-6 py-5 text-center min-w-[120px]">
                            <Clock size={22} className="text-emerald-400 mx-auto mb-1" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">24h Reminders</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8 text-left">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">What would you like to do?</h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1 opacity-70">
                    Choose a section to get started
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                {sections.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.title}
                            type="button"
                            onClick={() => navigate(item.path)}
                            className="group text-left bg-white rounded-[28px] border border-gray-100 p-7 hover:shadow-2xl hover:shadow-sky-500/5 transition-all duration-300 active:scale-[0.99]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} ${item.shadow} shadow-lg flex items-center justify-center shrink-0`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                                <ChevronRight size={18} className="text-gray-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mt-5 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm font-bold text-gray-400 leading-relaxed">{item.desc}</p>
                            {item.badge && (
                                <span className="inline-block mt-4 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {user && !user.hasDoctorProfile && (
                <button
                    type="button"
                    onClick={() => navigate('/join-doctor')}
                    className="w-full flex items-center justify-between gap-4 p-6 rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-sky-50 hover:border-sky-200 transition-all text-left group"
                >
                  
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-sky-500 transition-colors" />
                </button>
            )}
        </div>
    );
};

export default PatientLandingPage;
