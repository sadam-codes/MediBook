import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import BookingFlow from '../components/home/BookingFlow';
import api from '../services/api';
import toast from 'react-hot-toast';
import { findActiveDoctorBooking } from '../utils/appointmentUtils';

export const BookingPage: React.FC = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [doctor, setDoctor] = useState<any>(null);
    const [existingAppointment, setExistingAppointment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [paymentStep, setPaymentStep] = useState<number | null>(null);
    const [verifyingPayment, setVerifyingPayment] = useState(false);

    useEffect(() => {
        if (doctorId) {
            fetchDoctor();
        }
    }, [doctorId]);

    useEffect(() => {
        const paymentStatus = searchParams.get('payment');
        const sessionId = searchParams.get('session_id');
        const appointmentId = searchParams.get('appointment_id');

        if (paymentStatus === 'success' && sessionId) {
            verifyPayment(sessionId);
        } else if (paymentStatus === 'cancelled' && appointmentId) {
            cancelPendingPayment(appointmentId);
        }
    }, [searchParams]);

    const verifyPayment = async (sessionId: string) => {
        setVerifyingPayment(true);
        try {
            const res = await api.get(`/payments/verify?session_id=${sessionId}`);
            if (res.data.paid) {
                setPaymentStep(4);
                toast.success('Payment successful! Appointment confirmed.');
            } else {
                toast.error('Payment was not completed.');
            }
        } catch (err) {
            toast.error('Could not verify payment.');
        } finally {
            setVerifyingPayment(false);
            setSearchParams({});
        }
    };

    const cancelPendingPayment = async (appointmentId: string) => {
        try {
            await api.post(`/payments/cancel/${appointmentId}`);
            toast.error('Payment cancelled. Your slot was not reserved.');
        } catch {
            // Non-blocking cleanup
        } finally {
            setSearchParams({});
        }
    };

    const fetchDoctor = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/doctors/${doctorId}`);
            if (res.data) {
                const doc = {
                    ...res.data,
                    name: res.data.user?.fullName,
                    spec: res.data.specialization,
                    img: res.data.user?.profileImage ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${res.data.user.profileImage}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(res.data.user?.fullName || 'D')}&background=0f172a&color=fff&bold=true`
                };
                setDoctor(doc);

                // Check for existing appointment
                const apptsRes = await api.get('/appointments/my');
                const existing = findActiveDoctorBooking(apptsRes.data, doc.userId);
                if (existing) {
                    setExistingAppointment(existing);
                } else {
                    setExistingAppointment(null);
                }
            } else {
                toast.error("Doctor not found");
                navigate('/patient/doctors');
            }
        } catch (err) {
            console.error("Failed to fetch doctor:", err);
            toast.error("Failed to load doctor details");
            navigate('/patient/doctors');
        } finally {
            setLoading(false);
        }
    };

    if (loading || verifyingPayment) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 size={48} className="animate-spin text-sky-600 mb-4 opacity-20" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                    {verifyingPayment ? 'Confirming Payment...' : 'Initializing Booking Engine...'}
                </p>
            </div>
        );
    }

    if (!doctor) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-0 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-3 text-slate-400 hover:text-slate-900 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-slate-100">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                    </button>


                </div>

                <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col md:flex-row">
                    {/* Doctor Mini Profile */}
                    <div className="md:w-80 bg-slate-900 p-10 text-left relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full -mr-32 -mt-32 blur-[80px]" />

                        <div className="relative z-10">
                            <div className="w-32 h-32 rounded-[32px] overflow-hidden border-4 border-white/10 shadow-2xl mb-8">
                                <img src={doctor.img} alt={doctor.name} className="w-full h-full object-cover" />
                            </div>

                            <h2 className="text-3xl font-black text-white italic tracking-tight mb-2 uppercase leading-none">{doctor.name}</h2>
                            <p className="text-sky-500 font-black text-[10px] uppercase tracking-[0.2em] mb-8">{doctor.spec}</p>

                            <div className="space-y-6 pt-8 border-t border-white/10">
                                <div>
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Practice Location</p>
                                    <p className="text-xs font-bold text-slate-300 leading-relaxed">{doctor.clinicName}</p>
                                    <p className="text-[10px] text-slate-500 mt-1">{doctor.clinicAddress}</p>
                                </div>

                                <div>
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Consultation Fee</p>
                                    <p className="text-2xl font-black text-white">PKR {doctor.consultationFee}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Flow Core */}
                    <div className="flex-1 p-4 md:p-6 relative">
                        {existingAppointment ? (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
                                <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mb-8 border border-sky-100 shadow-inner">
                                    <CheckCircle2 size={40} className="text-sky-500" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">Already <span className="text-sky-600">Booked</span></h3>
                                <p className="text-slate-400 font-medium text-sm leading-relaxed mb-10 max-w-sm mx-auto">
                                    You already have an active appointment with Dr. {doctor.name.split(' ')[1] || doctor.name} on <span className="text-slate-900 font-bold">{new Date(existingAppointment.date).toLocaleDateString()}</span> at <span className="text-slate-900 font-bold">{existingAppointment.time}</span>.
                                </p>
                                <button
                                    onClick={() => navigate('/bookings')}
                                    className="px-10 py-2 bg-slate-900 text-white font-black rounded-2xl hover:bg-sky-600 transition-all shadow-xl shadow-slate-900/10 uppercase tracking-widest text-[10px] active:scale-95"
                                >
                                    View My Appointments
                                </button>
                            </div>
                        ) : (
                            <BookingFlow doctor={doctor} initialStep={paymentStep ?? 1} />
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
