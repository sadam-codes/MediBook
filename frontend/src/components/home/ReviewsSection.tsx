import React from 'react';
import { MessageSquare, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { PATIENT_FEEDBACK_DEMO } from '../../data/healthcareData';

export const ReviewsSection: React.FC = () => {
    return (
        <section className="py-16 sm:py-24 bg-white border-b border-[#DDE6E2]" aria-label="Patient Experience Demonstration">
            <div className="site-container">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-semibold mb-3">
                            <MessageSquare size={13} className="text-[#245B54]" />
                            <span>Demonstration Feedback</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#192B29] tracking-tight">
                            Patient Consultation Experiences
                        </h2>
                        <p className="text-[#687773] text-sm sm:text-base mt-2 max-w-2xl font-normal">
                            Sample feedback records illustrating patient post-consultation evaluations during platform development.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs text-[#687773] bg-[#F3F7F5] px-3.5 py-2 rounded-lg border border-[#DDE6E2] self-start md:self-end">
                        <AlertCircle size={14} className="text-[#245B54]" />
                        <span>Development Demo Records</span>
                    </div>
                </div>

                {/* Feedback Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PATIENT_FEEDBACK_DEMO.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#F3F7F5] rounded-2xl border border-[#DDE6E2] p-6 sm:p-7 flex flex-col justify-between text-left group hover:bg-white hover:border-[#173D39] transition-all shadow-sm"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-[#173D39] border border-[#DDE6E2]">
                                        {item.visitType}
                                    </span>
                                    <span className="text-[10px] font-semibold text-[#687773] uppercase tracking-wide">
                                        Demo Record
                                    </span>
                                </div>

                                <p className="text-sm text-[#192B29] leading-relaxed mb-6 font-normal">
                                    "{item.feedback}"
                                </p>
                            </div>

                            <div className="pt-4 border-t border-[#DDE6E2]/70 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#192B29]">{item.author}</span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#237A57]">
                                        <CheckCircle2 size={11} /> Simulated Patient
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-[#687773]">
                                    <MapPin size={11} className="text-[#245B54] shrink-0" />
                                    <span className="truncate">{item.clinic}</span>
                                </div>
                                <p className="text-[10px] text-[#687773]/80">{item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Honest labeling disclosure */}
                <p className="mt-8 text-center text-xs text-[#687773] max-w-xl mx-auto">
                    Note: To maintain medical integrity, unverified patient testimonials are not presented as verified clinical endorsements. Live patient reviews will be activated following hospital institutional review.
                </p>
            </div>
        </section>
    );
};

export default ReviewsSection;
