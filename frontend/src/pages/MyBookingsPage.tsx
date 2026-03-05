import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Loader2, ArrowLeft, CheckCircle2, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import api from '../services/api';

export const MyBookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 size={48} className="animate-spin text-emerald-600 mb-4 opacity-20" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Retrieving Your Schedule...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-6 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="text-left">
                        <button
                            onClick={() => navigate('/patient')}
                            className="flex items-center space-x-2 text-slate-400 hover:text-emerald-600 mb-4 transition-colors group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Back</span>
                        </button>
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight italic">Booking <span className="text-emerald-600">History</span></h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic opacity-60">Manage your medical consultations</p>
                    </div>

                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center space-x-6">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total</span>
                            <span className="text-2xl font-black text-slate-900">{bookings.length}</span>
                        </div>
                        <div className="w-px h-10 bg-slate-100" />
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Upcoming</span>
                            <span className="text-2xl font-black text-slate-900">{bookings.filter(b => new Date(b.date) >= new Date()).length}</span>
                        </div>
                    </div>
                </div>

                {bookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        {bookings.map((appt, i) => (
                            <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />

                                <div className="flex items-start justify-between mb-8 relative z-10">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-slate-100">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none mb-1 capitalize">Dr. {appt.doctorUser?.fullName}</h3>
                                            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest italic">{appt.doctorUser?.specialization || 'Specialist'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Confirmed</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
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
                                        <p className="text-xs font-black text-slate-700">
                                            {(() => {
                                                try {
                                                    const parsed = parse(appt.time, 'HH:mm', new Date());
                                                    return isNaN(parsed.getTime()) ? appt.time : format(parsed, 'h:mm a');
                                                } catch {
                                                    return appt.time;
                                                }
                                            })()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50 relative z-10">
                                    <div className="flex flex-col text-left">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic leading-none">Consultation Fee</span>
                                        <p className="text-lg font-black text-slate-900 italic">PKR {appt.fee}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const phone = appt.doctorUser?.doctor?.phoneNumber;
                                            if (phone) {
                                                const cleanPhone = phone.replace(/\D/g, '');
                                                window.open(`https://wa.me/${cleanPhone}`, '_blank');
                                            } else {
                                                alert("Contact information not available for this doctor.");
                                            }
                                        }}
                                        className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10 hover:shadow-emerald-600/20"
                                    >
                                        <Phone size={12} />
                                        <span>Contact Clinic</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[64px] p-20 text-center border-2 border-dashed border-slate-100 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                            <Calendar size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-none">No active bookings</h3>
                        <p className="text-slate-400 font-bold italic text-sm mb-12 max-w-xs mx-auto">You haven't scheduled any consultations yet. Explore our directory to find experts.</p>
                        <button
                            onClick={() => navigate('/patient')}
                            className="bg-emerald-600 text-white px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95"
                        >
                            Explore Specialists
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
