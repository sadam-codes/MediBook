import React from 'react';
import { Stethoscope, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

interface BookingExplanationSectionProps {
    onStartBooking: () => void;
}

export const BookingExplanationSection: React.FC<BookingExplanationSectionProps> = ({ onStartBooking }) => {
    const steps = [
        {
            number: '01',
            icon: Stethoscope,
            title: 'Select Doctor or Specialty',
            description: 'Browse our accredited clinical specialists by medical discipline, outpatient location, or consultation fee. Review primary qualifications and clinical backgrounds.'
        },
        {
            number: '02',
            icon: Calendar,
            title: 'Choose Verified Date & Time',
            description: 'Inspect live clinic calendar availability. Select from protected 30-minute consultation windows with zero danger of double booking or schedule conflicts.'
        },
        {
            number: '03',
            icon: CheckCircle2,
            title: 'Receive Instant Digital Pass',
            description: 'Provide basic patient contact details and consultation objectives. Receive an immediate electronic appointment pass with clinic arrival directions.'
        }
    ];

    return (
        <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-[#DDE6E2]" aria-label="Appointment Process Explanation">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-semibold mb-3">
                        <span>Scheduling Workflow</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#192B29] tracking-tight">
                        Three Direct Steps to Specialist Care
                    </h2>
                    <p className="text-[#687773] text-sm sm:text-base mt-2 font-normal">
                        Designed for patient clarity and efficiency. Zero phone queues, zero unexpected facility fees.
                    </p>
                </div>

                {/* Steps Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-[#F3F7F5] rounded-2xl border border-[#DDE6E2] p-6 sm:p-8 flex flex-col justify-between text-left relative group hover:border-[#173D39] hover:bg-white transition-all shadow-sm"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-[#DDE6E2] flex items-center justify-center text-[#173D39] group-hover:bg-[#E8F0ED] transition-colors shadow-sm">
                                            <Icon size={22} className="stroke-[2.2]" />
                                        </div>
                                        <span className="text-2xl font-black text-[#DDE6E2] group-hover:text-[#245B54] transition-colors">
                                            {step.number}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-[#192B29] mb-2.5">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[#687773] leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                <div className="pt-6 mt-6 border-t border-[#DDE6E2]/60 flex items-center gap-2 text-xs font-semibold text-[#173D39]">
                                    <span>Step {idx + 1} of 3</span>
                                    <ArrowRight size={13} className="text-[#245B54]" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Call to action bar */}
                <div className="mt-12 p-6 rounded-2xl bg-[#E8F0ED] border border-[#DDE6E2] flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                    <div>
                        <h4 className="text-sm font-bold text-[#173D39]">Need assistance with clinical intake?</h4>
                        <p className="text-xs text-[#687773] mt-0.5">Our patient care desk is available Monday through Friday for specialized scheduling support.</p>
                    </div>
                    <button
                        onClick={onStartBooking}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#173D39] hover:bg-[#245B54] text-white text-xs font-semibold transition-colors shrink-0"
                    >
                        Explore Available Slots
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BookingExplanationSection;
