import React from 'react';
import { Building2, Check } from 'lucide-react';
import clinicPavilionImg from '../../assets/clinic_pavilion.jpg';

export const MedicalPhotographySection: React.FC = () => {
    return (
        <section className="py-14 sm:py-20 bg-[#F3F7F5] border-b border-[#DDE6E2]" aria-label="Clinical Environment and Facilities">
            <div className="site-container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left: Authentic Architectural Photography */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <div className="relative rounded-2xl overflow-hidden border border-[#DDE6E2] shadow-md bg-white">
                            <img
                                src={clinicPavilionImg}
                                alt="Modern outpatient medical pavilion with patient reception, natural light, and serene clinical consultation rooms"
                                className="w-full h-[340px] sm:h-[420px] object-cover"
                                loading="lazy"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-[#DDE6E2] shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <p className="text-xs font-bold text-[#192B29]">Metropolitan Outpatient Pavilion & Clinical Suites</p>
                                        <p className="text-[11px] text-[#687773]">Designed for quiet, unhurried specialist consultations</p>
                                    </div>
                                    <span className="self-start sm:self-center text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F0ED] text-[#173D39] uppercase tracking-wider">
                                        Campus Ambulatory Wing
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Editorial Narrative on Care Quality */}
                    <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-start text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-semibold mb-4">
                            <Building2 size={13} className="text-[#245B54]" />
                            <span>Clinical Standards</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#192B29] tracking-tight leading-tight mb-4">
                            A Calm, Patient-Centered Clinical Environment.
                        </h2>

                        <p className="text-[#687773] text-sm sm:text-base leading-relaxed mb-6 font-normal">
                            Specialist healthcare should feel unhurried, transparent, and humane. MediBook connects you to affiliated clinical suites engineered specifically for clinical dialogue, thorough physical evaluation, and collaborative care decisions.
                        </p>

                        <div className="space-y-3 w-full">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-[#DDE6E2]">
                                <div className="w-6 h-6 rounded-full bg-[#E8F0ED] text-[#173D39] flex items-center justify-center shrink-0 mt-0.5">
                                    <Check size={14} className="stroke-[2.5]" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xs font-bold text-[#192B29]">Dedicated Specialist Consultation Times</h3>
                                    <p className="text-xs text-[#687773] mt-0.5">Physicians maintain protected appointment slots so visits are never truncated.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-[#DDE6E2]">
                                <div className="w-6 h-6 rounded-full bg-[#E8F0ED] text-[#173D39] flex items-center justify-center shrink-0 mt-0.5">
                                    <Check size={14} className="stroke-[2.5]" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xs font-bold text-[#192B29]">Direct Coordination with Diagnostic Services</h3>
                                    <p className="text-xs text-[#687773] mt-0.5">On-site clinical laboratory and non-invasive cardiovascular imaging facilities.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-[#DDE6E2]">
                                <div className="w-6 h-6 rounded-full bg-[#E8F0ED] text-[#173D39] flex items-center justify-center shrink-0 mt-0.5">
                                    <Check size={14} className="stroke-[2.5]" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xs font-bold text-[#192B29]">Integrated Patient Medical Records</h3>
                                    <p className="text-xs text-[#687773] mt-0.5">Your visit summary and clinical care plan are accessible through your portal.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MedicalPhotographySection;
