import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, CreditCard, Stethoscope, Clock, ChevronRight,
    Loader2, ShieldCheck, Building2
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
            desc: 'Browse verified specialists and schedule an unhurried visit',
            icon: Stethoscope,
            path: '/patient/doctors',
        },
        {
            title: 'My Bookings',
            desc: 'View, reschedule or manage upcoming clinical consultations',
            icon: Calendar,
            path: '/bookings',
            badge: loading ? undefined : `${upcomingCount} upcoming`,
        },
        {
            title: 'Payment Records',
            desc: 'Transparent consultation fee summaries and receipts',
            icon: CreditCard,
            path: '/payments',
        },
        {
            title: 'Specialist Directory',
            desc: 'Explore physicians by medical discipline and outpatient campus',
            icon: Building2,
            path: '/patient/doctors',
        },
    ];

    return (
        <div className="flex-1 pb-16 text-left">
            {/* Patient Header Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-[#173D39] text-white p-8 sm:p-10 mb-8 border border-[#245B54] shadow-sm">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#245B54] border border-[#3E857B] text-[#BDE8DA] text-xs font-semibold mb-3">
                            <ShieldCheck size={13} />
                            <span>Patient Outpatient Portal</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                            Hello, {firstName}
                        </h1>
                        <p className="text-[#E8F0ED]/80 text-sm max-w-lg leading-relaxed">
                            Manage your outpatient consultations, review clinic arrival guidance, and access verified specialist schedules.
                        </p>
                    </div>

                    <div className="flex gap-3 shrink-0">
                        <div className="bg-[#245B54]/70 border border-[#3E857B] rounded-xl px-5 py-4 text-center min-w-[120px]">
                            {loading ? (
                                <Loader2 size={20} className="animate-spin text-[#BDE8DA] mx-auto" />
                            ) : (
                                <>
                                    <p className="text-2xl font-extrabold text-white">{upcomingCount}</p>
                                    <p className="text-[10px] font-bold text-[#BDE8DA] uppercase tracking-wider mt-0.5">Upcoming Visits</p>
                                </>
                            )}
                        </div>
                        <div className="bg-[#245B54]/70 border border-[#3E857B] rounded-xl px-5 py-4 text-center min-w-[120px]">
                            <Clock size={20} className="text-[#BDE8DA] mx-auto mb-1" />
                            <p className="text-[10px] font-bold text-[#E8F0ED]/70 uppercase tracking-wider">Direct EMR Sync</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-[#192B29]">Care Management Options</h2>
                <p className="text-xs text-[#687773] mt-0.5">
                    Select a section to manage appointments or browse clinic providers
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {sections.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.title}
                            type="button"
                            onClick={() => navigate(item.path)}
                            className="group text-left bg-white rounded-xl border border-[#DDE6E2] p-6 hover:border-[#173D39] hover:shadow-md transition-all flex flex-col justify-between"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#E8F0ED] border border-[#DDE6E2] flex items-center justify-center text-[#173D39] group-hover:bg-[#BDE8DA] transition-colors shrink-0">
                                    <Icon size={22} className="stroke-[2.2]" />
                                </div>
                                <ChevronRight size={18} className="text-[#687773] group-hover:text-[#173D39] group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                            </div>

                            <div className="mt-4">
                                <h3 className="text-base font-bold text-[#192B29] group-hover:text-[#173D39] transition-colors mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-[#687773] leading-relaxed">{item.desc}</p>
                                {item.badge && (
                                    <span className="inline-block mt-3 text-[10px] font-bold text-[#237A57] bg-[#E8F0ED] border border-[#DDE6E2] px-2.5 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PatientLandingPage;
