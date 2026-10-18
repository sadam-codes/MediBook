import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import BookingFlow from '../components/home/BookingFlow';
import api from '../services/api';
import toast from 'react-hot-toast';
import { findActiveDoctorBooking } from '../utils/appointmentUtils';

/** Prevents duplicate verify + toast (React StrictMode runs effects twice). */
const verifiedPaymentSessions = new Set<string>();

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
            if (verifiedPaymentSessions.has(sessionId)) {
                setPaymentStep(4);
                setSearchParams({}, { replace: true });
                return;
            }
            verifiedPaymentSessions.add(sessionId);
            verifyPayment(sessionId);
        } else if (paymentStatus === 'cancelled' && appointmentId) {
            cancelPendingPayment(appointmentId);
        }
    }, [searchParams]);

    const verifyPayment = async (sessionId: string) => {
        setVerifyingPayment(true);
        setSearchParams({}, { replace: true });

        try {
            const res = await api.get(`/payments/verify?session_id=${sessionId}`);
            if (res.data.paid) {
                setPaymentStep(4);
                toast.success('Payment confirmed. Appointment registered.');
            } else {
                verifiedPaymentSessions.delete(sessionId);
                toast.error('Payment was not completed.');
            }
        } catch (err) {
            verifiedPaymentSessions.delete(sessionId);
            toast.error('Could not verify payment.');
        } finally {
            setVerifyingPayment(false);
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
                    img: res.data.user?.profileImage
                        ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${res.data.user.profileImage}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(res.data.user?.fullName || 'D')}&background=173D39&color=fff&bold=true`
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
            <div className="min-h-[500px] flex flex-col items-center justify-center bg-white">
                <Loader2 size={36} className="animate-spin text-[#173D39] mb-3" />
                <p className="text-xs font-semibold text-[#687773] uppercase tracking-wider">
                    {verifyingPayment ? 'Confirming Appointment...' : 'Connecting to Clinic Calendar...'}
                </p>
            </div>
        );
    }

    if (!doctor) return null;

    return (
        <div className="w-full text-left">
            <div className="max-w-4xl mx-auto w-full">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#687773] hover:text-[#173D39] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Return to Previous Screen</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-[#DDE6E2] shadow-sm overflow-hidden flex flex-col md:flex-row">
                    {/* Doctor Mini Profile Sidebar */}
                    <div className="md:w-80 bg-[#173D39] text-white p-8 shrink-0 flex flex-col justify-between">
                        <div>
                            <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-[#245B54] mb-6 bg-[#245B54]">
                                <img src={doctor.img} alt={doctor.name} className="w-full h-full object-cover" />
                            </div>

                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#245B54] text-[#BDE8DA] uppercase tracking-wider mb-2">
                                <ShieldCheck size={11} /> Credentialed Faculty
                            </span>

                            <h2 className="text-xl font-bold text-white leading-tight mb-1">
                                {doctor.name}
                            </h2>
                            <p className="text-xs text-[#BDE8DA] font-medium mb-6">
                                {doctor.spec} Specialist
                            </p>

                            <div className="space-y-4 pt-6 border-t border-[#245B54] text-xs">
                                <div>
                                    <span className="text-[10px] text-[#E8F0ED]/60 uppercase font-semibold block mb-0.5">
                                        Clinical Location
                                    </span>
                                    <p className="font-semibold text-white">{doctor.clinicName || 'St. Jude Pavilion'}</p>
                                    <p className="text-[#E8F0ED]/70 text-[11px]">{doctor.clinicAddress || '1420 Medical Center Pkwy'}</p>
                                </div>

                                <div>
                                    <span className="text-[10px] text-[#E8F0ED]/60 uppercase font-semibold block mb-0.5">
                                        Consultation Fee
                                    </span>
                                    <p className="text-lg font-bold text-white">${doctor.consultationFee || 120}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-[#245B54] text-[11px] text-[#E8F0ED]/70">
                            Direct EMR appointment reservation. Protected consultation slots.
                        </div>
                    </div>

                    {/* Booking Flow Core */}
                    <div className="flex-1 p-6 md:p-8">
                        {existingAppointment ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-[#E8F0ED] rounded-full flex items-center justify-center mb-4 text-[#237A57]">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-[#192B29] mb-2">
                                    Active Appointment Exists
                                </h3>
                                <p className="text-xs text-[#687773] leading-relaxed mb-6 max-w-sm">
                                    You already have an active appointment with {doctor.name} on{' '}
                                    <strong className="text-[#192B29]">
                                        {new Date(existingAppointment.date).toLocaleDateString()}
                                    </strong>{' '}
                                    at <strong className="text-[#192B29]">{existingAppointment.time}</strong>.
                                </p>
                                <button
                                    onClick={() => navigate('/bookings')}
                                    className="px-6 py-2.5 bg-[#173D39] text-white text-xs font-semibold rounded-lg hover:bg-[#245B54] transition-colors"
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

export default BookingPage;
