import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Award, Star, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { findActiveDoctorBooking } from '../../utils/appointmentUtils';

interface DoctorProfileModalProps {
    doctor: any;
    isOpen: boolean;
    onClose: () => void;
}

const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({ doctor, isOpen, onClose }) => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [patientBooking, setPatientBooking] = useState<any>(null);
    const [loadingAppts, setLoadingAppts] = useState(false);

    const docData = doctor?.originalData || doctor;

    useEffect(() => {
        if (isOpen && docData?.userId) {
            fetchDoctorAppointments();
            checkPatientBooking();
        }
    }, [doctor, isOpen]);

    const checkPatientBooking = async () => {
        try {
            const res = await api.get('/appointments/my');
            const doctorUserId = doctor.originalData?.userId || doctor.userId;
            setPatientBooking(findActiveDoctorBooking(res.data, doctorUserId));
        } catch (err) {
            console.error("Failed to check patient booking:", err);
        }
    };

    const fetchDoctorAppointments = async () => {
        setLoadingAppts(true);
        try {
            const res = await api.get(`/appointments/doctor/${docData.userId}`);
            setAppointments(res.data);
        } catch (err) {
            console.error("Failed to fetch doctor appointments:", err);
        } finally {
            setLoadingAppts(false);
        }
    };

    if (!doctor) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden relative z-10 flex flex-col sm:flex-row border border-slate-100"
                    >
                        {/* Profile Left Sidebar */}
                        <div className="w-full sm:w-80 bg-slate-50 p-6 sm:p-8 flex flex-col border-b sm:border-b-0 sm:border-r border-slate-100 shrink-0">
                            <div className="relative mb-6 sm:mb-8 group max-w-[200px] sm:max-w-none mx-auto sm:mx-0">
                                <div className="w-full aspect-square rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl border-4 border-white group-hover:scale-[1.02] transition-transform duration-500">
                                    <img src={doctor.img} alt={doctor.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-slate-50 flex items-center space-x-2 whitespace-nowrap">
                                    <ShieldCheck size={12} className="text-sky-600" />
                                    <span className="text-[8px] sm:text-[10px] font-black text-slate-900 uppercase tracking-widest">Verified Expert</span>
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1 sm:mb-2 uppercase">{doctor.name}</h2>
                                    <p className="text-sky-600 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">{doctor.spec}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <div className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-100 flex flex-col items-center">
                                        <Award size={14} className="text-slate-400 mb-1" />
                                        <span className="text-[10px] sm:text-xs font-black text-slate-900 leading-none">{doctor.exp}</span>
                                        <span className="text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Exp.</span>
                                    </div>
                                    <div className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-100 flex flex-col items-center">
                                        <Star size={14} className="text-amber-400 mb-1" />
                                        <span className="text-[10px] sm:text-xs font-black text-slate-900 leading-none">{doctor.rating}</span>
                                        <span className="text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rating</span>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4 border-t border-slate-200">
                                    <div className="flex items-center justify-center sm:justify-start text-slate-500 space-x-3 group cursor-pointer">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-sky-500 transition-colors">
                                            <CalendarIcon size={16} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {loadingAppts ? 'Checking...' : `${appointments.length} Consultations`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Right */}
                        <div className="flex-1 p-6 sm:p-10 overflow-y-auto custom-scrollbar flex flex-col bg-white">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 sm:p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl sm:rounded-2xl transition-all active:scale-95 z-30"
                            >
                                <X size={20} className="sm:w-6 sm:h-6" />
                            </button>

                            <div className="flex-1 flex flex-col items-center justify-center space-y-2 py-6">
                                <div className="text-center max-w-md">
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-4 leading-tight">Ready for your <span className="text-sky-600">Consultation?</span></h3>
                                    <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">Schedule your session with Dr. {doctor.name.split(' ')[1] || doctor.name} and receive professional medical guidance from the comfort of your home.</p>

                                    <button
                                        onClick={() => {
                                            onClose();
                                            if (patientBooking) {
                                                navigate('/bookings');
                                            } else {
                                                navigate(`/bookings/${docData.userId}`);
                                            }
                                        }}
                                        className={`w-full py-6 text-white font-black rounded-3xl transition-all duration-500 shadow-2xl text-xs uppercase tracking-[0.3em] active:scale-95 border border-white/5 flex items-center justify-center space-x-3 ${patientBooking
                                            ? 'bg-slate-900 shadow-slate-900/20 hover:bg-slate-800'
                                            : 'bg-sky-600 shadow-sky-500/20 hover:bg-sky-700 hover:shadow-sky-600/40'
                                            }`}
                                    >
                                        <CalendarIcon size={18} />
                                        <span>{patientBooking ? 'View Active Booking' : 'Initialize Booking'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 pt-8 border-t border-slate-100 text-left">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-2">
                                        <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Clinic Location</h5>
                                        <p className="text-xs font-bold text-slate-900">{docData.clinicName || 'City Medical Center'}</p>
                                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{docData.clinicAddress || 'Downtown Medical District, Suite 402'}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Consultation Fee</h5>
                                        <p className="text-2xl sm:text-3xl font-black text-slate-900">PKR {docData.consultationFee || '2500'}</p>
                                        <span className="text-[8px] font-black text-sky-500 bg-sky-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Secure Payment via App</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DoctorProfileModal;
