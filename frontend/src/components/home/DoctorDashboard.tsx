import React, { useState, useEffect } from 'react';
import { Calendar, UserPlus, Clock, MoreVertical, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { format, parse } from 'date-fns';

interface DoctorDashboardProps {
    user: any;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchAppointments();
        }
    }, [user?.id]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/appointments/doctor/${user.id}`);
            setAppointments(res.data);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const todayDateStr = format(new Date(), 'yyyy-MM-dd');
    const todayPatients = appointments.filter(a => a.date === todayDateStr).length;

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-8">
            {/* Professional Stats Banner */}
            <div className="bg-slate-900 rounded-[32px] p-10 overflow-hidden relative shadow-2xl shrink-0 border border-white/5 group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -mr-40 -mt-40 blur-[120px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="text-left">
                        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 mb-6">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest text-[9px]">Operational Status: Active</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 italic uppercase leading-none">
                            Welcome, <span className="text-emerald-500">Dr. {user.fullName.split(' ')[0]}</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-0 flex items-center">
                            <span className="w-6 h-[1px] bg-slate-800 mr-3" />
                            Medical Console v2.4
                        </p>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-white/5 backdrop-blur-3xl px-10 py-6 rounded-3xl border border-white/10 shadow-inner flex flex-col items-center">
                            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">Today's Load</p>
                            <p className="text-4xl font-black text-white leading-none italic">{todayPatients}</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-2">Active Patients</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                {/* Appointment Queue - Professional Edition */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 text-left flex flex-col overflow-hidden relative">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex flex-col">
                            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center mb-1">
                                <Calendar size={14} className="mr-2 text-emerald-600" />
                                Appointment Queue
                            </h3>
                            <p className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Active Schedule</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-slate-900 text-[10px] font-black px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 uppercase tracking-widest">{appointments.length} Total</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar -mr-6 pr-6 relative z-10">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-4">
                                <Loader2 size={32} className="animate-spin text-emerald-600/20" />
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Synchronizing Queue...</span>
                            </div>
                        ) : appointments.length > 0 ? (
                            <div className="space-y-4">
                                {appointments.map((appt, i) => (
                                    <div key={i} className="group bg-slate-50/30 hover:bg-slate-50 p-5 rounded-2xl border border-transparent hover:border-slate-100 transition-all duration-300 flex items-center space-x-5">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200">
                                            <img
                                                src={appt.patient?.profileImage ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${appt.patient.profileImage}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.patient?.fullName || 'P')}&background=0f172a&color=fff&bold=true`}
                                                alt={appt.patient?.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-black text-slate-900 uppercase tracking-tight truncate text-xs">
                                                    {appt.patient?.fullName}
                                                </h4>
                                                <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-2 py-0.5 rounded-md">Validated</span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center text-slate-400 space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm">
                                                    <Clock size={10} className="text-emerald-500" />
                                                    <span className="text-[9px] font-black uppercase tracking-tight text-slate-600">
                                                        {(() => {
                                                            try {
                                                                const parsed = parse(appt.time, 'HH:mm', new Date());
                                                                return isNaN(parsed.getTime()) ? appt.time : format(parsed, 'h:mm a');
                                                            } catch {
                                                                return appt.time;
                                                            }
                                                        })()}
                                                    </span>
                                                </div>
                                                <span className="text-gray-300">|</span>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(appt.date), 'MMM d, yy')}</p>
                                            </div>
                                        </div>

                                        <button className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-slate-200">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[48px] bg-slate-50/30">
                                <div className="p-8 bg-white rounded-[32px] shadow-sm mb-6">
                                    <Calendar size={40} className="text-slate-200" />
                                </div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">No active appointments in queue</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Insights Section */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 text-left flex flex-col overflow-hidden">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center mb-1">
                        <UserPlus size={14} className="mr-2 text-emerald-600" />
                        Performance Insights
                    </h3>
                    <p className="text-xl font-black text-gray-900 uppercase italic tracking-tight mb-8">Clinical Analytics</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 font-bold">Completion Rate</p>
                            <p className="text-2xl font-black text-slate-900 italic">94%</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 font-bold">Patient Satisfaction</p>
                            <p className="text-2xl font-black text-emerald-600 italic">4.9/5</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 p-8 text-center">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                            <Clock size={20} className="text-slate-300" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Upcoming Performance Metrics</p>
                        <p className="text-[9px] font-medium text-slate-300 italic">Advanced analytics module integration in progress</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
