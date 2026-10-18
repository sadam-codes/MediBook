import React from 'react';
import { HeartPulse, ShieldAlert, Baby, Brain, Bone, Activity, Stethoscope, ArrowRight } from 'lucide-react';
import { HEALTHCARE_SPECIALTIES, type SpecialtyItem } from '../../data/healthcareData';

interface SpecialtiesSectionProps {
    onSelectSpecialty: (specialtyName: string) => void;
}

const getSpecialtyIcon = (iconName: SpecialtyItem['icon']) => {
    switch (iconName) {
        case 'heart':
            return <HeartPulse className="w-5 h-5 text-[#173D39]" />;
        case 'skin':
            return <Activity className="w-5 h-5 text-[#173D39]" />;
        case 'baby':
            return <Baby className="w-5 h-5 text-[#173D39]" />;
        case 'brain':
            return <Brain className="w-5 h-5 text-[#173D39]" />;
        case 'bone':
            return <Bone className="w-5 h-5 text-[#173D39]" />;
        case 'dna':
            return <ShieldAlert className="w-5 h-5 text-[#173D39]" />;
        case 'stethoscope':
        default:
            return <Stethoscope className="w-5 h-5 text-[#173D39]" />;
    }
};

export const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({ onSelectSpecialty }) => {
    return (
        <section id="specialties" className="py-16 sm:py-24 bg-white border-b border-[#DDE6E2]" aria-label="Clinical Specialties">
            <div className="site-container">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-semibold mb-3">
                            <span>Clinical Departments</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#192B29] tracking-tight">
                            Specialized Healthcare Disciplines
                        </h2>
                        <p className="text-[#687773] text-sm sm:text-base mt-2 max-w-2xl font-normal">
                            Consult with credentialed medical specialists across key hospital clinical departments.
                            Compare treatment scope and view next available appointment slots.
                        </p>
                    </div>

                    <div className="text-xs font-semibold text-[#173D39] bg-[#F3F7F5] px-4 py-2.5 rounded-lg border border-[#DDE6E2] shrink-0 self-start md:self-end">
                        7 Accredited Clinical Departments
                    </div>
                </div>

                {/* Specialties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {HEALTHCARE_SPECIALTIES.map((spec) => (
                        <div
                            key={spec.id}
                            className="bg-[#FFFFFF] rounded-xl border border-[#DDE6E2] p-5 hover:border-[#173D39] hover:shadow-md transition-all flex flex-col justify-between group text-left"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#E8F0ED] border border-[#DDE6E2] flex items-center justify-center group-hover:bg-[#BDE8DA] transition-colors">
                                        {getSpecialtyIcon(spec.icon)}
                                    </div>
                                    <span className="text-[11px] font-bold text-[#687773] px-2 py-0.5 rounded bg-[#F3F7F5] border border-[#DDE6E2]">
                                        From ${spec.averageFee}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-[#192B29] group-hover:text-[#173D39] transition-colors mb-1">
                                    {spec.name}
                                </h3>
                                <p className="text-xs font-semibold text-[#245B54] mb-2">
                                    {spec.tagline}
                                </p>
                                <p className="text-xs text-[#687773] leading-relaxed mb-4">
                                    {spec.description}
                                </p>

                                {/* Clinical Conditions Pills */}
                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {spec.commonConditions.map((condition, idx) => (
                                        <span
                                            key={idx}
                                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F3F7F5] text-[#192B29] border border-[#DDE6E2]"
                                        >
                                            {condition}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => onSelectSpecialty(spec.name)}
                                className="w-full py-2.5 px-3 rounded-lg bg-[#F3F7F5] group-hover:bg-[#173D39] text-[#173D39] group-hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-[#DDE6E2] group-hover:border-[#173D39]"
                            >
                                <span>Browse {spec.name} Specialists</span>
                                <ArrowRight size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SpecialtiesSection;
