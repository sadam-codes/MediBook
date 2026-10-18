import React, { useState, useEffect } from 'react';
import { 
    X, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, 
    Video, Building2
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import { DEMO_DOCTORS, type DoctorProfile } from '../../data/healthcareData';

interface InteractiveBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDoctor?: any;
    onBookingComplete?: (bookingDetails: any) => void;
}

export const InteractiveBookingModal: React.FC<InteractiveBookingModalProps> = ({
    isOpen,
    onClose,
    initialDoctor,
    onBookingComplete
}) => {
    // Current Step (1 to 4)
    const [step, setStep] = useState<number>(1);

    // Step 1: Doctor selection
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile>(
        initialDoctor?.originalData || initialDoctor || DEMO_DOCTORS[0]
    );

    // Step 2: Date & Slot selection
    const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
    const [consultationType, setConsultationType] = useState<'in-person' | 'telehealth'>('in-person');

    // Step 3: Patient Details
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [consultationReason, setConsultationReason] = useState('');
    const [patientNotes, setPatientNotes] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Step 4: Loading & Confirmation
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmedPass, setConfirmedPass] = useState<any>(null);

    // Sync initialDoctor when opened and enforce login
    useEffect(() => {
        if (isOpen) {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                toast('Please sign in or create an account to book an appointment.', {
                    icon: '🔒',
                    duration: 4000
                });
                if (initialDoctor) {
                    sessionStorage.setItem('pendingBookingDoctor', JSON.stringify(initialDoctor));
                }
                onClose();
                window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
                return;
            }

            if (initialDoctor) {
                const doc = initialDoctor.originalData || initialDoctor;
                setSelectedDoctor(doc);
                setStep(2); // If doctor already specified, jump directly to step 2 (Date/Slot)
            } else {
                setSelectedDoctor(DEMO_DOCTORS[0]);
                setStep(1);
            }
            // Auto fill logged in user if available
            try {
                const u = JSON.parse(storedUser);
                if (u.fullName) setPatientName(u.fullName);
                if (u.email) setPatientEmail(u.email);
            } catch {
                // ignore
            }
            setSelectedTimeSlot('');
            setConfirmedPass(null);
        }
    }, [isOpen, initialDoctor]);

    if (!isOpen) return null;

    // Generate date options (next 5 days)
    const availableDates = Array.from({ length: 5 }).map((_, i) => addDays(new Date(), i + 1));

    // Slots for selected doctor
    const scheduleSlots = selectedDoctor.availableSchedule?.slots || [
        '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '02:00 PM', '02:45 PM', '03:30 PM'
    ];
    // Mark slot 2 as booked for demo realism
    const bookedSlot = scheduleSlots[1];

    const validateStep3 = () => {
        const errors: Record<string, string> = {};
        if (!patientName.trim()) errors.name = 'Patient full name is required';
        if (!patientEmail.trim() || !/^\S+@\S+\.\S+$/.test(patientEmail)) {
            errors.email = 'Valid email is required for appointment confirmation';
        }
        if (!patientPhone.trim()) errors.phone = 'Contact phone number is required';
        if (!consultationReason.trim()) errors.reason = 'Please indicate the primary clinical reason for this visit';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleConfirmBooking = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            toast('Please sign in or create an account to finalize your booking.', {
                icon: '🔒',
                duration: 4000
            });
            onClose();
            window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            const confirmation = {
                referenceCode: `MB-${format(new Date(), 'yyyy')}-${Math.floor(1000 + Math.random() * 9000)}`,
                doctor: selectedDoctor,
                date: format(selectedDate, 'EEEE, MMMM d, yyyy'),
                time: selectedTimeSlot,
                consultationType,
                patientName,
                patientEmail,
                patientPhone,
                consultationReason,
                clinic: selectedDoctor.clinic,
                fee: selectedDoctor.consultationFee,
                confirmedAt: new Date().toISOString()
            };
            setConfirmedPass(confirmation);
            if (onBookingComplete) onBookingComplete(confirmation);
        }, 900);
    };

    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-[#173D39]/50 backdrop-blur-sm animate-fade-in text-left">
            <div 
                className="bg-white rounded-2xl border border-[#DDE6E2] shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-modal-title"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#DDE6E2] bg-[#F3F7F5] flex items-center justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#237A57]" />
                            <span className="text-[11px] font-bold text-[#173D39] uppercase tracking-wider">
                                MediBook Outpatient Scheduling
                            </span>
                        </div>
                        <h2 id="booking-modal-title" className="text-lg font-bold text-[#192B29] mt-0.5">
                            {confirmedPass ? 'Appointment Confirmation Pass' : 'Schedule Clinical Consultation'}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-[#687773] hover:text-[#192B29] hover:bg-[#E8F0ED] rounded-lg transition-colors"
                        aria-label="Close booking modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Stepper Progress Bar (when not yet confirmed) */}
                {!confirmedPass && (
                    <div className="bg-white px-6 py-3 border-b border-[#DDE6E2] shrink-0">
                        <div className="grid grid-cols-4 gap-2 text-center">
                            {[
                                { num: 1, label: 'Specialist' },
                                { num: 2, label: 'Date & Slot' },
                                { num: 3, label: 'Patient Info' },
                                { num: 4, label: 'Review & Confirm' }
                            ].map((s) => (
                                <div key={s.num} className="flex flex-col items-center">
                                    <div className="flex items-center w-full">
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mx-auto transition-colors ${
                                                step >= s.num
                                                    ? 'bg-[#173D39] text-white'
                                                    : 'bg-[#E8F0ED] text-[#687773]'
                                            }`}
                                        >
                                            {step > s.num ? <CheckCircle2 size={14} /> : s.num}
                                        </div>
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold mt-1 truncate ${
                                            step >= s.num ? 'text-[#173D39]' : 'text-[#687773]'
                                        }`}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Confirmation Pass Screen */}
                    {confirmedPass ? (
                        <div className="space-y-6 animate-fade-in">
                            {/* Success Banner */}
                            <div className="p-4 rounded-xl bg-[#E8F0ED] border border-[#237A57]/30 flex items-start gap-3">
                                <CheckCircle2 size={22} className="text-[#237A57] shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-sm font-bold text-[#173D39]">
                                        Appointment Successfully Reserved
                                    </h3>
                                    <p className="text-xs text-[#687773] mt-0.5">
                                        A digital confirmation pass has been registered for this demonstration consultation.
                                    </p>
                                </div>
                            </div>

                            {/* Digital Clinical Pass Card */}
                            <div className="rounded-xl border-2 border-[#173D39] bg-[#F3F7F5] overflow-hidden shadow-sm">
                                <div className="bg-[#173D39] text-white p-4 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-[#BDE8DA] uppercase tracking-wider block">
                                            Outpatient Pass
                                        </span>
                                        <span className="text-base font-extrabold">{confirmedPass.referenceCode}</span>
                                    </div>
                                    <span className="text-xs bg-[#245B54] px-2.5 py-1 rounded text-[#E8F0ED] font-semibold">
                                        Simulated Booking
                                    </span>
                                </div>

                                <div className="p-5 space-y-4 bg-white">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#DDE6E2]">
                                        <div>
                                            <span className="text-[10px] font-semibold text-[#687773] uppercase tracking-wider block">
                                                Consulting Physician
                                            </span>
                                            <p className="text-sm font-bold text-[#192B29]">{confirmedPass.doctor.name}</p>
                                            <p className="text-xs text-[#245B54]">{confirmedPass.doctor.specialty} Specialist</p>
                                        </div>

                                        <div>
                                            <span className="text-[10px] font-semibold text-[#687773] uppercase tracking-wider block">
                                                Appointment Schedule
                                            </span>
                                            <p className="text-sm font-bold text-[#192B29]">{confirmedPass.time}</p>
                                            <p className="text-xs text-[#687773]">{confirmedPass.date}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#DDE6E2]">
                                        <div>
                                            <span className="text-[10px] font-semibold text-[#687773] uppercase tracking-wider block">
                                                Clinic Location
                                            </span>
                                            <p className="text-xs font-bold text-[#192B29]">{confirmedPass.clinic.name}</p>
                                            <p className="text-xs text-[#687773]">{confirmedPass.clinic.address}</p>
                                            <p className="text-[11px] text-[#245B54]">{confirmedPass.clinic.suite}</p>
                                        </div>

                                        <div>
                                            <span className="text-[10px] font-semibold text-[#687773] uppercase tracking-wider block">
                                                Patient Details
                                            </span>
                                            <p className="text-xs font-bold text-[#192B29]">{confirmedPass.patientName}</p>
                                            <p className="text-xs text-[#687773]">{confirmedPass.patientEmail}</p>
                                            <p className="text-xs text-[#687773]">{confirmedPass.patientPhone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs pt-1">
                                        <span className="text-[#687773]">Consultation Fee (Due at Reception):</span>
                                        <span className="font-bold text-[#173D39] text-sm">${confirmedPass.fee}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Clinical Arrival Guidance */}
                            <div className="p-3 rounded-lg bg-[#E8F0ED] border border-[#DDE6E2] text-xs text-[#173D39] flex items-center gap-2">
                                <ShieldCheck size={14} className="text-[#237A57] shrink-0" />
                                <span>Clinical Confirmation: Please present this pass or appointment code at reception upon pavilion arrival.</span>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 rounded-lg bg-[#173D39] text-white text-xs font-semibold hover:bg-[#245B54] transition-colors"
                                >
                                    Done & Return to Site
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Step 1: Doctor Selection */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="text-left mb-2">
                                        <h3 className="text-base font-bold text-[#192B29]">Select a Clinical Specialist</h3>
                                        <p className="text-xs text-[#687773]">Choose from our credentialed medical faculty across clinical departments.</p>
                                    </div>

                                    <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 no-scrollbar hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        {DEMO_DOCTORS.map((doc) => (
                                            <div
                                                key={doc.id}
                                                onClick={() => setSelectedDoctor(doc)}
                                                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                                    selectedDoctor.id === doc.id
                                                        ? 'bg-[#E8F0ED] border-[#173D39] shadow-sm'
                                                        : 'bg-white border-[#DDE6E2] hover:bg-[#F3F7F5]'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={doc.image}
                                                        alt={doc.name}
                                                        className="w-12 h-12 rounded-lg object-cover border border-[#DDE6E2]"
                                                    />
                                                    <div>
                                                        <h4 className="text-sm font-bold text-[#192B29]">{doc.name}</h4>
                                                        <p className="text-xs text-[#245B54] font-medium">{doc.specialty} Specialist</p>
                                                        <p className="text-[11px] text-[#687773]">{doc.clinic.name}</p>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-[#173D39]">${doc.consultationFee}</span>
                                                    <span className="text-[10px] text-[#687773] block">{doc.nextAvailable.label}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Date & Available Slot Selection */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    {/* Active Doctor Header Card */}
                                    <div className="p-3.5 rounded-xl bg-[#F3F7F5] border border-[#DDE6E2] flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={selectedDoctor.image}
                                                alt={selectedDoctor.name}
                                                className="w-11 h-11 rounded-lg object-cover border border-[#DDE6E2]"
                                            />
                                            <div>
                                                <h4 className="text-sm font-bold text-[#192B29]">{selectedDoctor.name}</h4>
                                                <p className="text-xs text-[#245B54]">{selectedDoctor.specialty} • ${selectedDoctor.consultationFee} Consult</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-xs text-[#173D39] font-semibold hover:underline"
                                        >
                                            Change Doctor
                                        </button>
                                    </div>

                                    {/* Consultation Modality Selection */}
                                    <div>
                                        <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider mb-2 block">
                                            Consultation Format
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setConsultationType('in-person')}
                                                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-colors ${
                                                    consultationType === 'in-person'
                                                        ? 'bg-[#E8F0ED] border-[#173D39] text-[#173D39]'
                                                        : 'bg-white border-[#DDE6E2] text-[#687773] hover:bg-[#F3F7F5]'
                                                }`}
                                            >
                                                <Building2 size={16} />
                                                <div>
                                                    <span className="text-xs font-bold block text-[#192B29]">In-Person Clinic Visit</span>
                                                    <span className="text-[10px] text-[#687773]">{selectedDoctor.clinic.name}</span>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setConsultationType('telehealth')}
                                                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-colors ${
                                                    consultationType === 'telehealth'
                                                        ? 'bg-[#E8F0ED] border-[#173D39] text-[#173D39]'
                                                        : 'bg-white border-[#DDE6E2] text-[#687773] hover:bg-[#F3F7F5]'
                                                }`}
                                            >
                                                <Video size={16} />
                                                <div>
                                                    <span className="text-xs font-bold block text-[#192B29]">Encrypted Telehealth</span>
                                                    <span className="text-[10px] text-[#687773]">Secure Video Portal</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Date Selection */}
                                    <div>
                                        <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider mb-2 block">
                                            Select Consultation Date
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                            {availableDates.map((date, idx) => {
                                                const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
                                                return (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => setSelectedDate(date)}
                                                        className={`p-2.5 rounded-lg border text-center transition-all ${
                                                            isSelected
                                                                ? 'bg-[#173D39] text-white border-[#173D39] shadow-sm'
                                                                : 'bg-white text-[#192B29] border-[#DDE6E2] hover:bg-[#F3F7F5]'
                                                        }`}
                                                    >
                                                        <span className="text-[10px] uppercase font-semibold opacity-80 block">
                                                            {format(date, 'EEE')}
                                                        </span>
                                                        <span className="text-sm font-bold block">
                                                            {format(date, 'MMM d')}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Available Time Slots Selection */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider">
                                                Available Time Slots ({format(selectedDate, 'MMM d')})
                                            </label>
                                            <span className="text-[11px] text-[#687773]">30-minute consultation</span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {scheduleSlots.map((slot, idx) => {
                                                const isBooked = slot === bookedSlot;
                                                const isSelected = selectedTimeSlot === slot;

                                                return (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        disabled={isBooked}
                                                        onClick={() => setSelectedTimeSlot(slot)}
                                                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                                                            isBooked
                                                                ? 'bg-[#F3F7F5] text-[#687773]/50 border-[#DDE6E2] cursor-not-allowed line-through'
                                                                : isSelected
                                                                ? 'bg-[#173D39] text-white border-[#173D39] shadow-sm'
                                                                : 'bg-white text-[#192B29] border-[#DDE6E2] hover:bg-[#E8F0ED] hover:border-[#173D39]'
                                                        }`}
                                                    >
                                                        {slot}
                                                        {isBooked && <span className="text-[9px] block no-underline font-normal">Reserved</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Patient Information Form */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="text-left mb-2">
                                        <h3 className="text-base font-bold text-[#192B29]">Patient Consultation Information</h3>
                                        <p className="text-xs text-[#687773]">Please provide the patient details for clinic check-in and preparation.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-[#192B29] mb-1 block">
                                                Patient Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={patientName}
                                                onChange={(e) => setPatientName(e.target.value)}
                                                placeholder="e.g. Johnathan Doe"
                                                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs sm:text-sm font-medium ${
                                                    formErrors.name ? 'border-[#B42318]' : 'border-[#DDE6E2]'
                                                }`}
                                            />
                                            {formErrors.name && (
                                                <span className="text-[11px] text-[#B42318] mt-1 block">{formErrors.name}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-[#192B29] mb-1 block">
                                                Contact Email *
                                            </label>
                                            <input
                                                type="email"
                                                value={patientEmail}
                                                onChange={(e) => setPatientEmail(e.target.value)}
                                                placeholder="e.g. patient@example.com"
                                                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs sm:text-sm font-medium ${
                                                    formErrors.email ? 'border-[#B42318]' : 'border-[#DDE6E2]'
                                                }`}
                                            />
                                            {formErrors.email && (
                                                <span className="text-[11px] text-[#B42318] mt-1 block">{formErrors.email}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-[#192B29] mb-1 block">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                value={patientPhone}
                                                onChange={(e) => setPatientPhone(e.target.value)}
                                                placeholder="e.g. (555) 012-3456"
                                                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs sm:text-sm font-medium ${
                                                    formErrors.phone ? 'border-[#B42318]' : 'border-[#DDE6E2]'
                                                }`}
                                            />
                                            {formErrors.phone && (
                                                <span className="text-[11px] text-[#B42318] mt-1 block">{formErrors.phone}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-[#192B29] mb-1 block">
                                                Primary Reason for Consultation *
                                            </label>
                                            <input
                                                type="text"
                                                value={consultationReason}
                                                onChange={(e) => setConsultationReason(e.target.value)}
                                                placeholder="e.g. Annual cardiac review, rash check"
                                                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs sm:text-sm font-medium ${
                                                    formErrors.reason ? 'border-[#B42318]' : 'border-[#DDE6E2]'
                                                }`}
                                            />
                                            {formErrors.reason && (
                                                <span className="text-[11px] text-[#B42318] mt-1 block">{formErrors.reason}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-[#192B29] mb-1 block">
                                            Additional Clinical Notes (Optional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={patientNotes}
                                            onChange={(e) => setPatientNotes(e.target.value)}
                                            placeholder="Mention current medications, prior diagnostic tests, or specific accommodations..."
                                            className="w-full bg-white border border-[#DDE6E2] rounded-lg p-2.5 text-xs sm:text-sm font-medium"
                                        />
                                    </div>

                                    <div className="p-3 rounded-lg bg-[#F3F7F5] border border-[#DDE6E2] flex items-center gap-2 text-xs text-[#687773]">
                                        <ShieldCheck size={16} className="text-[#237A57] shrink-0" />
                                        <span>Your clinical intake information is transmitted over encrypted channels directly to the clinic reception.</span>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Review and Confirm */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div className="text-left mb-2">
                                        <h3 className="text-base font-bold text-[#192B29]">Review Consultation Details</h3>
                                        <p className="text-xs text-[#687773]">Confirm appointment parameters before simulated reservation.</p>
                                    </div>

                                    {/* Summary Card */}
                                    <div className="rounded-xl border border-[#DDE6E2] bg-[#F3F7F5] p-5 space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-[#DDE6E2]">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={selectedDoctor.image}
                                                    alt={selectedDoctor.name}
                                                    className="w-12 h-12 rounded-lg object-cover border border-[#DDE6E2]"
                                                />
                                                <div>
                                                    <h4 className="text-sm font-bold text-[#192B29]">{selectedDoctor.name}</h4>
                                                    <p className="text-xs text-[#245B54]">{selectedDoctor.specialty} Department</p>
                                                    <p className="text-[11px] text-[#687773]">{selectedDoctor.clinic.name}</p>
                                                </div>
                                            </div>

                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F0ED] text-[#173D39] border border-[#DDE6E2]">
                                                {consultationType === 'in-person' ? 'Clinic Visit' : 'Telehealth Video'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-xs text-[#192B29]">
                                            <div>
                                                <span className="text-[10px] text-[#687773] uppercase font-semibold block">Date & Time</span>
                                                <span className="font-bold">{format(selectedDate, 'EEEE, MMM d, yyyy')}</span>
                                                <span className="block text-[#173D39] font-semibold">{selectedTimeSlot}</span>
                                            </div>

                                            <div>
                                                <span className="text-[10px] text-[#687773] uppercase font-semibold block">Patient</span>
                                                <span className="font-bold">{patientName}</span>
                                                <span className="block text-[#687773]">{patientPhone}</span>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-[#DDE6E2] text-xs">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#687773]">Specialist Consultation Fee:</span>
                                                <span className="font-semibold">${selectedDoctor.consultationFee}.00</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[#687773]">Facility & Scheduling Fee:</span>
                                                <span className="font-semibold text-[#237A57]">$0.00 (Zero Surcharge)</span>
                                            </div>
                                            <div className="flex items-center justify-between font-bold text-sm pt-2 border-t border-[#DDE6E2] text-[#173D39]">
                                                <span>Total Consultation Due at Visit:</span>
                                                <span>${selectedDoctor.consultationFee}.00</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Simulation Notice Banner */}
                                    <div className="p-3.5 rounded-xl bg-[#E8F0ED] border border-[#DDE6E2] text-xs text-[#173D39] flex items-start gap-2.5">
                                        <AlertCircle size={16} className="text-[#245B54] shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold block">Development Simulation:</span>
                                            <span>
                                                Clicking "Confirm & Generate Pass" simulates the clinic calendar booking. No real credit card charge will be made.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Navigation Controls (when not yet confirmed) */}
                {!confirmedPass && (
                    <div className="px-6 py-4 bg-[#F3F7F5] border-t border-[#DDE6E2] flex items-center justify-between shrink-0">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#DDE6E2] bg-white text-xs font-semibold text-[#192B29] hover:bg-[#F3F7F5] transition-colors"
                            >
                                <ArrowLeft size={14} />
                                <span>Back</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-semibold text-[#687773] hover:text-[#192B29]"
                            >
                                Cancel
                            </button>
                        )}

                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={() => {
                                    if (step === 2) {
                                        if (!selectedTimeSlot) {
                                            alert('Please select an available time slot.');
                                            return;
                                        }
                                    }
                                    if (step === 3) {
                                        if (!validateStep3()) return;
                                    }
                                    setStep(step + 1);
                                }}
                                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-[#173D39] text-white text-xs font-semibold hover:bg-[#245B54] transition-colors shadow-sm"
                            >
                                <span>Continue to {step === 1 ? 'Date & Time' : step === 2 ? 'Patient Info' : 'Review'}</span>
                                <ArrowRight size={14} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleConfirmBooking}
                                className="inline-flex items-center gap-1.5 px-7 py-2.5 rounded-lg bg-[#173D39] text-white text-xs font-bold hover:bg-[#245B54] transition-colors shadow-sm disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span>Syncing with Clinic...</span>
                                ) : (
                                    <>
                                        <span>Confirm & Generate Pass</span>
                                        <CheckCircle2 size={15} />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractiveBookingModal;
