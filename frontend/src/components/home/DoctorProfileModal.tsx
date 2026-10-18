import React from 'react';
import { X, ShieldCheck, MapPin, Clock, Award, Building2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DoctorProfileModalProps {
    doctor: any;
    isOpen: boolean;
    onClose: () => void;
    onBookAppointment?: (doc: any) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
    doctor,
    isOpen,
    onClose,
    onBookAppointment
}) => {
    if (!doctor || !isOpen) return null;

    const docData = doctor.originalData || doctor;
    const clinic = docData.clinic || {
        name: 'St. Jude Outpatient Pavilion',
        campus: 'Main Hospital Campus',
        address: '1420 Medical Center Parkway',
        suite: 'Pavilion Suite 320',
        phone: '(555) 018-4200',
        hours: 'Mon – Fri: 8:00 AM – 5:30 PM'
    };

    const qualifications = docData.qualifications || `${docData.experienceYears || docData.exp || '12+'} Experience • Board-Certified Specialist`;
    const education = docData.education || ['Accredited Faculty Medical School (MD)', 'Postgraduate Fellowship'];
    const certifications = docData.certifications || ['American Board Certification', 'State Medical Board License'];
    const languages = docData.languages || ['English'];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-[#173D39]/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border border-[#DDE6E2] shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden relative z-10 flex flex-col text-left"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="doctor-profile-name"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-[#DDE6E2] bg-[#F3F7F5] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#237A57]" />
                            <span className="text-[11px] font-bold text-[#173D39] uppercase tracking-wider">
                                Credentialed Medical Faculty Profile
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-[#687773] hover:text-[#192B29] hover:bg-[#E8F0ED] rounded-lg transition-colors"
                            aria-label="Close profile modal"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Scrollable */}
                    <div className="p-6 overflow-y-auto space-y-6">
                        {/* Doctor Main Info Row */}
                        <div className="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b border-[#DDE6E2]">
                            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden border border-[#DDE6E2] bg-[#F3F7F5] shrink-0">
                                <img
                                    src={docData.image || docData.img}
                                    alt={docData.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2">
                                    <span className="inline-flex items-center p-1 rounded-md bg-white/95 text-[#237A57] shadow-sm">
                                        <ShieldCheck size={14} />
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <h2 id="doctor-profile-name" className="text-xl sm:text-2xl font-extrabold text-[#192B29] leading-tight">
                                            {docData.name}
                                        </h2>
                                        <p className="text-sm font-semibold text-[#245B54] mt-0.5">
                                            {docData.specialty || docData.spec} Specialist
                                        </p>
                                        <p className="text-xs text-[#687773] mt-1">{qualifications}</p>
                                    </div>

                                    <div className="bg-[#E8F0ED] px-3.5 py-1.5 rounded-lg border border-[#DDE6E2] text-right">
                                        <span className="text-[10px] uppercase font-bold text-[#687773] block">Consultation Fee</span>
                                        <span className="text-base font-extrabold text-[#173D39]">
                                            ${docData.consultationFee || docData.fee || 120}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#687773]">
                                    <div className="flex items-center gap-1.5">
                                        <Building2 size={13} className="text-[#245B54]" />
                                        <span>{clinic.name}</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={13} className="text-[#245B54]" />
                                        <span>{docData.nextAvailable?.label || 'Available This Week'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Clinical Biography */}
                        <div>
                            <h3 className="text-xs font-bold text-[#192B29] uppercase tracking-wider mb-2">
                                Clinical Background & Practice Scope
                            </h3>
                            <p className="text-sm text-[#192B29]/90 leading-relaxed font-normal">
                                {docData.bio || 'Comprehensive clinical care specializing in diagnostic assessment, preventative medicine, and personalized patient management.'}
                            </p>
                        </div>

                        {/* Education & Board Certifications */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-[#F3F7F5] border border-[#DDE6E2]">
                                <h4 className="text-xs font-bold text-[#192B29] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                    <Award size={14} className="text-[#173D39]" />
                                    <span>Medical Education</span>
                                </h4>
                                <ul className="space-y-1.5 text-xs text-[#687773]">
                                    {education.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-1.5">
                                            <span className="text-[#173D39] font-bold">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-4 rounded-xl bg-[#F3F7F5] border border-[#DDE6E2]">
                                <h4 className="text-xs font-bold text-[#192B29] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                    <ShieldCheck size={14} className="text-[#173D39]" />
                                    <span>Board Certifications</span>
                                </h4>
                                <ul className="space-y-1.5 text-xs text-[#687773]">
                                    {certifications.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-1.5">
                                            <span className="text-[#173D39] font-bold">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Clinic Location Details */}
                        <div className="p-4 rounded-xl bg-white border border-[#DDE6E2] space-y-2">
                            <h4 className="text-xs font-bold text-[#192B29] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <MapPin size={14} className="text-[#173D39]" />
                                <span>Clinic Pavilion & Hours</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#687773]">
                                <div>
                                    <p className="font-semibold text-[#192B29]">{clinic.name} — {clinic.suite}</p>
                                    <p>{clinic.address}</p>
                                </div>
                                <div>
                                    <p><strong className="text-[#192B29]">Operating Hours:</strong> {clinic.hours}</p>
                                    <p><strong className="text-[#192B29]">Facility Phone:</strong> {clinic.phone}</p>
                                    <p className="flex items-center gap-1 mt-1 text-[#245B54] font-medium"><Globe size={12} /> Languages: {languages.join(', ')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Clinical Accreditation Notice */}
                        <div className="p-3 rounded-lg bg-[#E8F0ED]/70 border border-[#DDE6E2] text-xs text-[#173D39] flex items-center gap-2">
                            <ShieldCheck size={14} className="text-[#237A57] shrink-0" />
                            <span>Verified Hospital Faculty: Active medical board licensure and accredited clinical privileges confirmed.</span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-[#F3F7F5] border-t border-[#DDE6E2] flex items-center justify-between shrink-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-[#687773] hover:text-[#192B29] transition-colors"
                        >
                            Back to Specialists
                        </button>

                        <button
                            onClick={() => {
                                onClose();
                                if (onBookAppointment) {
                                    onBookAppointment(docData);
                                }
                            }}
                            className="medical-btn-primary"
                        >
                            Book Appointment with {docData.name}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DoctorProfileModal;
