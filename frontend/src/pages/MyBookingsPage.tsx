import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, Loader2, ArrowLeft, CheckCircle2, Phone,
    XCircle, RefreshCw, Star, AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
    canPatientModifyAppointment,
    getStatusLabel,
    isReviewEligible,
    isUpcomingAppointment,
} from '../utils/appointmentUtils';
import { RescheduleModal } from '../components/bookings/RescheduleModal';
import { ReviewForm } from '../components/home/ReviewForm';

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    confirmed: { bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-600', icon: 'text-sky-500' },
    pending: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', icon: 'text-amber-500' },
    completed: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', icon: 'text-emerald-500' },
    no_show: { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600', icon: 'text-rose-500' },
    cancelled: { bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-500', icon: 'text-slate-400' },
};

export const MyBookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [rescheduleTarget, setRescheduleTarget] = useState<any | null>(null);
    const [cancelTarget, setCancelTarget] = useState<any | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [reviewTarget, setReviewTarget] = useState<any | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/appointments/my');
            setBookings(res.data);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!cancelTarget) return;
        setActionLoading(true);
        try {
            await api.patch(`/appointments/${cancelTarget.id}/cancel`, {
                reason: cancelReason.trim() || undefined,
            });
            toast.success('Appointment cancelled');
            setCancelTarget(null);
            setCancelReason('');
            fetchBookings();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to cancel');
        } finally {
            setActionLoading(false);
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

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 size={48} className="animate-spin text-sky-600 mb-4 opacity-20" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Retrieving Your Schedule...</p>
            </div>
        );
    }

    const upcomingCount = bookings.filter(isUpcomingAppointment).length;

    return (
        <div className="min-h-screen bg-slate-50 py-4">
            {rescheduleTarget && (
                <RescheduleModal
                    appointment={rescheduleTarget}
                    onClose={() => setRescheduleTarget(null)}
                    onRescheduled={fetchBookings}
                />
            )}

            {cancelTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                                <XCircle size={20} className="text-rose-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Cancel Appointment</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            Cancel your visit with Dr. {cancelTarget.doctorUser?.fullName} on{' '}
                            {format(new Date(cancelTarget.date), 'MMMM d, yyyy')} at {formatTime(cancelTarget.time)}?
                        </p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Optional reason..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm mb-6 resize-none outline-none focus:border-rose-300"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setCancelTarget(null); setCancelReason(''); }}
                                className="flex-1 py-3 rounded-xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400"
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={actionLoading}
                                className="flex-1 py-3 rounded-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {reviewTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8">
                        <ReviewForm
                            appointmentId={reviewTarget.id}
                            doctorName={reviewTarget.doctorUser?.fullName}
                            compact
                            onSubmitted={() => { setReviewTarget(null); fetchBookings(); }}
                            onSkip={() => setReviewTarget(null)}
                        />
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="text-left">
                        <button
                            onClick={() => navigate('/patient')}
                            className="flex items-center space-x-2 text-slate-400 hover:text-sky-600 mb-4 transition-colors group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Back</span>
                        </button>
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">
                            Booking <span className="text-sky-600">History</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-xs mt-2 max-w-md">
                            Complete appointment lifecycle management — hospital-grade workflow.
                        </p>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1 opacity-60">
                            Cancel, reschedule, reminders & reviews
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center space-x-6">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-1">Total</span>
                            <span className="text-2xl font-black text-slate-900">{bookings.length}</span>
                        </div>
                        <div className="w-px h-10 bg-slate-100" />
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-1">Upcoming</span>
                            <span className="text-2xl font-black text-slate-900">{upcomingCount}</span>
                        </div>
                    </div>
                </div>

                {bookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        {bookings.map((appt) => {
                            const style = STATUS_STYLES[appt.status] ?? STATUS_STYLES.cancelled;
                            const canModify = canPatientModifyAppointment(appt);
                            const showReview = isReviewEligible(appt);

                            return (
                                <div
                                    key={appt.id}
                                    className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-sky-500/5 transition-all duration-500 group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-sky-500/10 transition-colors" />

                                    <div className="flex items-start justify-between mb-8 relative z-10">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-sky-600 border border-slate-100">
                                                <Calendar size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none mb-1 capitalize">
                                                    Dr. {appt.doctorUser?.fullName}
                                                </h3>
                                                <p className="text-sky-500 text-[10px] font-black uppercase tracking-widest">
                                                    {appt.doctorUser?.doctor?.specialization || 'Specialist'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${style.bg} ${style.border}`}>
                                            <CheckCircle2 size={12} className={style.icon} />
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${style.text}`}>
                                                {getStatusLabel(appt.status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 transition-colors">
                                            <div className="flex items-center space-x-2 text-slate-400 mb-2">
                                                <Calendar size={12} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Scheduled Date</span>
                                            </div>
                                            <p className="text-xs font-black text-slate-700">{format(new Date(appt.date), 'MMMM d, yyyy')}</p>
                                        </div>
                                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 transition-colors">
                                            <div className="flex items-center space-x-2 text-slate-400 mb-2">
                                                <Clock size={12} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Arrival Time</span>
                                            </div>
                                            <p className="text-xs font-black text-slate-700">{formatTime(appt.time)}</p>
                                        </div>
                                    </div>

                                    {appt.status === 'confirmed' && !canModify && isUpcomingAppointment(appt) && (
                                        <div className="flex items-start gap-2 mb-6 p-3 rounded-xl bg-amber-50 border border-amber-100 relative z-10">
                                            <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                            <p className="text-[10px] font-bold text-amber-700">
                                                Changes allowed up to 24 hours before your appointment. Reminder sent 24h prior.
                                            </p>
                                        </div>
                                    )}

                                    {showReview && (
                                        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-100 relative z-10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Star size={14} className="text-amber-500" />
                                                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
                                                        Review eligible
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => setReviewTarget(appt)}
                                                    className="px-4 py-2 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-amber-600"
                                                >
                                                    Rate Visit
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {appt.review && (
                                        <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-100 relative z-10">
                                            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                                                Review submitted · {appt.review.rating}/5 stars
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-50 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col text-left">
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Consultation Fee</span>
                                                <p className="text-lg font-black text-slate-900">PKR {appt.fee}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const phone = appt.doctorUser?.doctor?.phoneNumber;
                                                    if (phone) {
                                                        window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
                                                    } else {
                                                        toast.error('Contact information not available for this doctor.');
                                                    }
                                                }}
                                                className="flex items-center space-x-2 px-5 py-3 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-sky-600 transition-all"
                                            >
                                                <Phone size={12} />
                                                <span>Contact</span>
                                            </button>
                                        </div>

                                        {canModify && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setRescheduleTarget(appt)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-sky-100 bg-sky-50 text-sky-600 text-[9px] font-black uppercase tracking-widest hover:bg-sky-100"
                                                >
                                                    <RefreshCw size={12} />
                                                    Reschedule
                                                </button>
                                                <button
                                                    onClick={() => setCancelTarget(appt)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-widest hover:bg-rose-100"
                                                >
                                                    <XCircle size={12} />
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-[64px] p-20 text-center border-2 border-dashed border-slate-100 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                            <Calendar size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-none">No active bookings</h3>
                        <p className="text-slate-400 font-bold text-sm mb-12 max-w-xs mx-auto">
                            You haven&apos;t scheduled any consultations yet. Explore our directory to find experts.
                        </p>
                        <button
                            onClick={() => navigate('/patient')}
                            className="bg-sky-600 text-white px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-sky-700 transition-all shadow-2xl shadow-sky-500/20 active:scale-95"
                        >
                            Explore Specialists
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
