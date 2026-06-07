import React, { useState, useEffect } from 'react';
import { format, addMinutes, parse, startOfDay, addDays } from 'date-fns';
import { X, Loader2, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface RescheduleModalProps {
    appointment: any;
    onClose: () => void;
    onRescheduled: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
    appointment,
    onClose,
    onRescheduled,
}) => {
    const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const doctor = appointment.doctorUser?.doctor;

    useEffect(() => {
        fetchSlots();
    }, [selectedDate]);

    const fetchSlots = async () => {
        setLoading(true);
        setSelectedTime(null);
        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const res = await api.get(
                `/appointments/doctor/${appointment.doctorUserId}?date=${dateStr}`,
            );

            const booked = res.data
                .filter((a: any) => a.id !== appointment.id)
                .map((a: any) => {
                    try {
                        const parsed = parse(a.time, 'HH:mm', new Date());
                        return isNaN(parsed.getTime()) ? a.time : format(parsed, 'h:mm a');
                    } catch {
                        return a.time;
                    }
                });
            setBookedSlots(booked);
            setAvailableSlots(generateTimeSlots(
                doctor?.startTime || '09:00',
                doctor?.endTime || '17:00',
                doctor?.breakTime,
                doctor?.appointmentDuration || 30,
            ));
        } catch {
            toast.error('Failed to load available slots');
        } finally {
            setLoading(false);
        }
    };

    const generateTimeSlots = (
        start: string,
        end: string,
        breakTime: string | null,
        duration: number,
    ) => {
        const slots: string[] = [];
        let current = parse(start, 'HH:mm', new Date());
        const endTime = parse(end, 'HH:mm', new Date());

        while (current < endTime) {
            const slotStr = format(current, 'h:mm a');
            if (breakTime) {
                const breakStart = parse(breakTime.split('-')[0]?.trim() || '13:00', 'HH:mm', new Date());
                const breakEnd = parse(breakTime.split('-')[1]?.trim() || '14:00', 'HH:mm', new Date());
                if (current >= breakStart && current < breakEnd) {
                    current = addMinutes(current, duration);
                    continue;
                }
            }
            slots.push(slotStr);
            current = addMinutes(current, duration);
        }
        return slots;
    };

    const handleSubmit = async () => {
        if (!selectedTime) {
            toast.error('Please select a time slot');
            return;
        }

        setSubmitting(true);
        try {
            await api.patch(`/appointments/${appointment.id}/reschedule`, {
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: selectedTime,
            });
            toast.success('Appointment rescheduled successfully');
            onRescheduled();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to reschedule');
        } finally {
            setSubmitting(false);
        }
    };

    const minDate = startOfDay(addDays(new Date(), 1));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Reschedule</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Dr. {appointment.doctorUser?.fullName}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            <Calendar size={12} /> New Date
                        </label>
                        <input
                            type="date"
                            min={format(minDate, 'yyyy-MM-dd')}
                            value={format(selectedDate, 'yyyy-MM-dd')}
                            onChange={(e) => setSelectedDate(new Date(e.target.value + 'T12:00:00'))}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-sky-500"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            <Clock size={12} /> Available Slots
                        </label>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 size={24} className="animate-spin text-sky-600/30" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                                {availableSlots.map((slot) => {
                                    const taken = bookedSlots.includes(slot);
                                    const selected = selectedTime === slot;
                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            disabled={taken}
                                            onClick={() => setSelectedTime(slot)}
                                            className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${
                                                taken
                                                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                                                    : selected
                                                        ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                                                        : 'bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-600'
                                            }`}
                                        >
                                            {slot}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || !selectedTime}
                        className="flex-1 py-3 rounded-xl bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-sky-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? <Loader2 size={14} className="animate-spin" /> : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleModal;
