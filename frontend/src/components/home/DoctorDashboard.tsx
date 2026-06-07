import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Loader2, CheckCircle2, UserX, CreditCard } from 'lucide-react';
import api from '../../services/api';
import { format, parse } from 'date-fns';
import toast from 'react-hot-toast';
import { getStatusLabel, isPastAppointment } from '../../utils/appointmentUtils';
import PaymentsSection from './PaymentsSection';

interface DoctorDashboardProps {
    user: any;
}

type DoctorTab = 'appointments' | 'payments';

const STATUS_BADGE: Record<string, string> = {
    confirmed: 'bg-sky-50 text-sky-600 border-sky-100',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    no_show: 'bg-rose-50 text-rose-600 border-rose-100',
};

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<DoctorTab>('appointments');
    const [appointments, setAppointments] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [actionId, setActionId] = useState<number | null>(null);

    useEffect(() => {
        if (user?.id) {
            fetchAppointments();
            fetchPayments();
        }
    }, [user?.id]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/appointments/doctor/${user.id}/manage`);
            setAppointments(res.data);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPayments = async () => {
        setPaymentsLoading(true);
        try {
            const res = await api.get('/payments/doctor');
            setPayments(res.data);
        } catch (err) {
            console.error('Failed to fetch payments:', err);
        } finally {
            setPaymentsLoading(false);
        }
    };

    const handleComplete = async (id: number) => {
        setActionId(id);
        try {
            await api.patch(`/appointments/${id}/complete`);
            toast.success('Appointment marked complete');
            fetchAppointments();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update');
        } finally {
            setActionId(null);
        }
    };

    const handleNoShow = async (id: number) => {
        setActionId(id);
        try {
            await api.patch(`/appointments/${id}/no-show`);
            toast.success('Marked as no-show');
            fetchAppointments();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update');
        } finally {
            setActionId(null);
        }
    };

    const formatTime = (time: string) => {
        try {
            const parsed = parse(time, 'HH:mm', new Date());
            return isNaN(parsed.getTime()) ? time : format(parsed, 'h:mm a');
        } catch {
            return time;
        }
    };

    const todayDateStr = format(new Date(), 'yyyy-MM-dd');
    const todayPatients = appointments.filter(
        (a) => a.date === todayDateStr && a.status === 'confirmed',
    ).length;
    const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-8">
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('appointments')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all
                        ${activeTab === 'appointments' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Calendar size={14} />
                    Appointments ({appointments.length})
                </button>
                <button
                    onClick={() => setActiveTab('payments')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all
                        ${activeTab === 'payments' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <CreditCard size={14} />
                    Payments ({payments.length})
                </button>
            </div>

            {activeTab === 'payments' ? (
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="mb-5">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Received Payments</h2>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">
                            Payments received from your booked patients
                        </p>
                    </div>
                    {paymentsLoading && payments.length === 0 ? (
                        <div className="flex-1 flex justify-center items-center">
                            <Loader2 className="animate-spin text-sky-600" size={48} />
                        </div>
                    ) : (
                        <PaymentsSection
                            payments={payments}
                            loading={paymentsLoading}
                            role="doctor"
                            showHeader={false}
                        />
                    )}
                </div>
            ) : (
            <>
            <div className="bg-slate-900 rounded-[32px] p-10 overflow-hidden relative shadow-2xl shrink-0 border border-white/5 group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full -mr-40 -mt-40 blur-[120px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="text-left">
                        <div className="inline-flex items-center space-x-2 bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/20 mb-6">
                            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                            <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Lifecycle Management Active</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 uppercase leading-none">
                            Welcome, <span className="text-sky-500">Dr. {user.fullName.split(' ')[0]}</span>
                        </h2>
                        <p className="text-slate-400 font-bold text-xs max-w-md">
                            Complete appointment lifecycle — confirm, complete, no-show & auto-reminders.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/5 backdrop-blur-3xl px-8 py-6 rounded-3xl border border-white/10 shadow-inner flex flex-col items-center">
                            <p className="text-[8px] font-black text-sky-500 uppercase tracking-[0.3em] mb-2">Today</p>
                            <p className="text-4xl font-black text-white leading-none">{todayPatients}</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-2">Confirmed</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-3xl px-8 py-6 rounded-3xl border border-white/10 shadow-inner flex flex-col items-center">
                            <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Queue</p>
                            <p className="text-4xl font-black text-white leading-none">{confirmedCount}</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-2">Upcoming</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 text-left flex flex-col overflow-hidden relative lg:col-span-2">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex flex-col">
                            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center mb-1">
                                <Calendar size={14} className="mr-2 text-sky-600" />
                                Appointment Lifecycle
                            </h3>
                            <p className="text-xl font-black text-gray-900 uppercase tracking-tight">Manage Visits</p>
                        </div>
                        <span className="text-slate-900 text-[10px] font-black px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 uppercase tracking-widest">
                            {appointments.length} Total
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar -mr-6 pr-6 relative z-10 max-h-[520px]">
                        {loading ? (
                            <div className="h-48 flex flex-col items-center justify-center space-y-4">
                                <Loader2 size={32} className="animate-spin text-sky-600/20" />
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Synchronizing Queue...</span>
                            </div>
                        ) : appointments.length > 0 ? (
                            <div className="space-y-4">
                                {appointments.map((appt) => {
                                    const isConfirmed = appt.status === 'confirmed';
                                    const isPast = isPastAppointment(appt);
                                    const badgeClass = STATUS_BADGE[appt.status] ?? 'bg-slate-50 text-slate-500 border-slate-100';
                                    const busy = actionId === appt.id;

                                    return (
                                        <div
                                            key={appt.id}
                                            className="group bg-slate-50/30 hover:bg-slate-50 p-5 rounded-2xl border border-transparent hover:border-slate-100 transition-all duration-300"
                                        >
                                            <div className="flex items-center space-x-5">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                                                    <img
                                                        src={
                                                            appt.patient?.profileImage
                                                                ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${appt.patient.profileImage}`
                                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.patient?.fullName || 'P')}&background=0f172a&color=fff&bold=true`
                                                        }
                                                        alt={appt.patient?.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-2 gap-2">
                                                        <h4 className="font-black text-slate-900 uppercase tracking-tight truncate text-xs">
                                                            {appt.patient?.fullName}
                                                        </h4>
                                                        <span className={`text-[7px] font-black uppercase tracking-widest border px-2 py-0.5 rounded-md shrink-0 ${badgeClass}`}>
                                                            {getStatusLabel(appt.status)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-4 flex-wrap gap-y-1">
                                                        <div className="flex items-center text-slate-400 space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm">
                                                            <Clock size={10} className="text-sky-500" />
                                                            <span className="text-[9px] font-black uppercase tracking-tight text-slate-600">
                                                                {formatTime(appt.time)}
                                                            </span>
                                                        </div>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {format(new Date(appt.date), 'MMM d, yyyy')}
                                                        </p>
                                                    </div>
                                                </div>

                                                {isConfirmed && (
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <button
                                                            type="button"
                                                            disabled={busy}
                                                            onClick={() => handleComplete(appt.id)}
                                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-[8px] font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-50"
                                                        >
                                                            {busy ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                                            Complete
                                                        </button>
                                                        {isPast && (
                                                            <button
                                                                type="button"
                                                                disabled={busy}
                                                                onClick={() => handleNoShow(appt.id)}
                                                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-[8px] font-black uppercase tracking-widest hover:bg-rose-100 disabled:opacity-50"
                                                            >
                                                                <UserX size={12} />
                                                                No Show
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[48px] bg-slate-50/30">
                                <Calendar size={40} className="text-slate-200 mb-4" />
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">No appointments in queue</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </>
            )}
        </div>
    );
};

export default DoctorDashboard;
