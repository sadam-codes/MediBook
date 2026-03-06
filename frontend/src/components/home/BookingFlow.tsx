import React, { useState, useEffect } from 'react';
import { format, addMinutes, parse, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface BookingFlowProps {
    doctor: any;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ doctor }) => {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const docData = doctor.originalData || doctor;

    // Step 1: Handle Date Selection
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setStep(2);
    };

    // Step 2: Generate & Fetch Slots
    useEffect(() => {
        if (step === 2 && selectedDate) {
            fetchAndGenerateSlots();
        }
    }, [step, selectedDate]);

    const fetchAndGenerateSlots = async () => {
        setLoading(true);
        try {
            // Fetch already booked slots for this date
            const dateStr = format(selectedDate!, 'yyyy-MM-dd');
            const res = await api.get(`/appointments/doctor/${docData.userId}?date=${dateStr}`);

            // Normalize booked slots to h:mm a for comparison
            const booked = res.data.map((a: any) => {
                try {
                    // Try parsing as HH:mm first (old format)
                    const parsed = parse(a.time, 'HH:mm', new Date());
                    return isNaN(parsed.getTime()) ? a.time : format(parsed, 'h:mm a');
                } catch {
                    return a.time;
                }
            });
            setBookedSlots(booked);

            // Generate all possible slots
            const slots = generateTimeSlots(
                docData.startTime || "09:00",
                docData.endTime || "17:00",
                docData.breakTime,
                docData.appointmentDuration || 30
            );
            setAvailableSlots(slots);
        } catch (err) {
            toast.error("Failed to load slots");
        } finally {
            setLoading(false);
        }
    };

    const generateTimeSlots = (start: string, end: string, breakTime: string | null, duration: number) => {
        const slots: string[] = [];
        let current = parse(start, 'HH:mm', new Date());
        const endTime = parse(end, 'HH:mm', new Date());

        const breakStart = breakTime ? parse(breakTime.split('-')[0] || "13:00", 'HH:mm', new Date()) : null;
        const breakEnd = breakTime ? parse(breakTime.split('-')[1] || "14:00", 'HH:mm', new Date()) : null;

        while (current < endTime) {
            const timeStr = format(current, 'h:mm a');

            // Check if within break
            const isBreak = breakStart && breakEnd && current >= breakStart && current < breakEnd;

            if (!isBreak) {
                slots.push(timeStr);
            }
            current = addMinutes(current, duration);
        }
        return slots;
    };

    const navigate = useNavigate();

    const handleConfirmBooking = async () => {
        setLoading(true);
        try {
            const finalDoctorId = docData.userId || docData.id;
            await api.post('/appointments', {
                doctorId: finalDoctorId,
                date: format(selectedDate!, 'yyyy-MM-dd'),
                time: selectedTime,
                fee: docData.consultationFee,
                notes: ""
            });
            setStep(4);
            toast.success("Appointment Booked!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    // Helper to check if day is available
    const isDayAvailable = (date: Date) => {
        if (date < startOfDay(new Date())) return false;
        const dayName = format(date, 'EEE'); // Mon, Tue...
        const allowedDays = docData.availableDays || ["Mon", "Tue", "Wed", "Thu", "Fri"];
        return allowedDays.includes(dayName);
    };

    return (
        <div className="flex flex-col h-full min-h-[400px]">
            {/* Steps Progress */}
            <div className="flex items-center justify-between mb-6 sm:mb-8 px-0 sm:px-2 overflow-x-auto custom-scrollbar-hide py-2">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center shrink-0">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black border-2 transition-all ${step >= s ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-500/20' : 'bg-white border-gray-100 text-gray-300'
                            }`}>
                            {step > s ? <CheckCircle2 size={14} className="sm:w-4 sm:h-4" /> : s}
                        </div>
                        {s < 4 && <div className={`w-6 sm:w-12 h-0.5 mx-1 sm:mx-2 ${step > s ? 'bg-sky-600' : 'bg-gray-100'}`} />}
                    </div>
                ))}
            </div>

            {/* Step 1: Calendar */}
            {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-4 sm:mb-6 uppercase tracking-tight flex items-center">
                        <CalendarIcon size={18} className="mr-2 text-sky-600" /> Select Date
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                        {/* Simplified mini calendar logic for demonstration */}
                        {Array.from({ length: 14 }).map((_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() + i);
                            const available = isDayAvailable(d);
                            return (
                                <button
                                    key={i}
                                    disabled={!available}
                                    onClick={() => handleDateSelect(d)}
                                    className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${available
                                        ? 'border-gray-50 hover:border-sky-500 hover:bg-sky-50 bg-gray-50'
                                        : 'border-transparent opacity-30 cursor-not-allowed'
                                        }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{format(d, 'EEE')}</span>
                                    <span className="font-black text-gray-900">{format(d, 'd')}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Step 2: Time Slots */}
            {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight flex items-center">
                            <Clock size={18} className="mr-2 text-sky-600" /> Select Time
                        </h3>
                        <button onClick={() => setStep(1)} className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-sky-600 hover:underline">Change Date</button>
                    </div>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-sky-600 mb-4" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Finding Slots...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
                            {availableSlots.map((time) => {
                                const isBooked = bookedSlots.includes(time);
                                return (
                                    <button
                                        key={time}
                                        disabled={isBooked}
                                        onClick={() => { setSelectedTime(time); setStep(3); }}
                                        className={`py-3 rounded-xl font-black text-xs border-2 transition-all ${isBooked
                                            ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed line-through'
                                            : 'bg-white border-gray-100 text-gray-900 hover:border-sky-500 hover:text-sky-600'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Confirmation Summary */}
            {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-4 sm:mb-6 uppercase tracking-tight">Confirm Details</h3>
                    <div className="bg-sky-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-sky-100 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center border-b border-sky-100/50 pb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-600/60">Doctor</span>
                            <span className="font-black text-gray-900">Dr. {docData.user?.fullName || docData.name || 'Specialist'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-sky-100/50 pb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-600/60">Specialization</span>
                            <span className="font-bold text-gray-900">{docData.specialization}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-sky-100/50 pb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-600/60">Clinic</span>
                            <span className="font-bold text-gray-900">{docData.clinicName}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-sky-100/50 pb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-600/60">Date & Time</span>
                            <span className="font-black text-sky-600">{format(selectedDate!, 'MMMM d, yyyy')} at {selectedTime}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 gap-1 uppercase font-bold">
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-sky-600/60">Consultation Fee</span>
                            <span className="text-lg sm:text-xl font-black text-gray-900">PKR {docData.consultationFee}</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button onClick={() => setStep(2)} className="w-full sm:w-1/3 py-4 sm:py-5 bg-white border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest text-[10px]">Back</button>
                        <button
                            onClick={handleConfirmBooking}
                            disabled={loading}
                            className="w-full sm:flex-1 py-4 sm:py-5 bg-sky-600 text-white font-black rounded-2xl hover:bg-sky-700 transition-all shadow-xl shadow-sky-500/20 uppercase tracking-widest text-[10px] flex items-center justify-center"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : "Confirm"}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Success Message */}
            {step === 4 && (
                <div className="animate-in zoom-in duration-500 flex flex-col items-center justify-center py-10 flex-1">
                    <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mb-8 relative">
                        <div className="absolute inset-0 bg-sky-400 rounded-full animate-ping opacity-20"></div>
                        <CheckCircle2 size={48} className="text-sky-600 relative z-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Booking Confirmed</h3>
                    <p className="text-gray-400 font-bold mb-10">Your appointment has been successfully scheduled.</p>
                    <button
                        onClick={() => navigate('/patient')}
                        className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-sky-600 transition-all shadow-xl shadow-slate-900/10 uppercase tracking-widest text-[10px]"
                    >
                        Return to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default BookingFlow;
