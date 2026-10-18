import React from 'react';
import { Stethoscope, ArrowRight, Check } from 'lucide-react';

export const DoctorJoinSection: React.FC = () => {
    const handleJoinClick = () => {
        sessionStorage.setItem('showSignup', 'true');
        sessionStorage.setItem('signupRole', 'doctor');
        window.location.reload();
    };

    return (
        <section className="py-16 sm:py-20 bg-white border-b border-[#DDE6E2]" aria-label="Physician Credentialing">
            <div className="site-container">
                <div className="bg-[#173D39] rounded-2xl p-8 sm:p-12 lg:p-16 text-white text-left relative overflow-hidden shadow-lg">
                    {/* Subtle aesthetic line details, no random neon blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#245B54] rounded-full -mr-28 -mt-28 opacity-40 blur-2xl pointer-events-none" />

                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#245B54] border border-[#3E857B] text-[#BDE8DA] text-xs font-semibold mb-5">
                            <Stethoscope size={13} />
                            <span>Medical Faculty Registration</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                            Are you a licensed physician or clinical subspecialist?
                        </h2>

                        <p className="text-[#E8F0ED] text-sm sm:text-base leading-relaxed mb-8 opacity-90 font-normal">
                            Join our vetted medical faculty network. Sync your clinic calendar, provide outpatient consultations, and connect with patients requiring specialist care across your clinical discipline.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-xs text-[#E8F0ED]">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-[#245B54] flex items-center justify-center text-[#BDE8DA] shrink-0">
                                    <Check size={12} className="stroke-[3]" />
                                </div>
                                <span>Verified Primary-Source Credentialing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-[#245B54] flex items-center justify-center text-[#BDE8DA] shrink-0">
                                    <Check size={12} className="stroke-[3]" />
                                </div>
                                <span>Autonomous Consultation Schedule Control</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-[#245B54] flex items-center justify-center text-[#BDE8DA] shrink-0">
                                    <Check size={12} className="stroke-[3]" />
                                </div>
                                <span>Transparent Direct Reimbursement</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-[#245B54] flex items-center justify-center text-[#BDE8DA] shrink-0">
                                    <Check size={12} className="stroke-[3]" />
                                </div>
                                <span>Encrypted Telehealth & EMR Integration</span>
                            </div>
                        </div>

                        <button
                            onClick={handleJoinClick}
                            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#BDE8DA] text-[#173D39] font-bold text-sm hover:bg-white transition-colors shadow-md"
                        >
                            <span>Apply to Join MediBook Faculty</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DoctorJoinSection;
