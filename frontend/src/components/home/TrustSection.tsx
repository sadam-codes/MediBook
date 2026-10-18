import React from 'react';
import { ShieldCheck, CreditCard, RefreshCw, Lock, CheckCircle2 } from 'lucide-react';
import { TRUST_PILLARS } from '../../data/healthcareData';

export const TrustSection: React.FC = () => {
    const pillarIcons = [ShieldCheck, CreditCard, RefreshCw, Lock];

    return (
        <section className="py-16 sm:py-24 bg-[#F3F7F5] border-b border-[#DDE6E2]" aria-label="Clinical Trust and Verification Standards">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header */}
                <div className="text-left max-w-3xl mb-12">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-semibold mb-3">
                        <ShieldCheck size={13} className="text-[#245B54]" />
                        <span>Verifiable Standards</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#192B29] tracking-tight">
                        Built for Clinical Precision & Patient Trust
                    </h2>
                    <p className="text-[#687773] text-sm sm:text-base mt-2 font-normal">
                        We prioritize transparent, verifiable healthcare operations over marketing claims.
                        Every provider and appointment schedule conforms to validated clinical governance.
                    </p>
                </div>

                {/* 4 Trust Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {TRUST_PILLARS.map((pillar, idx) => {
                        const Icon = pillarIcons[idx % pillarIcons.length];
                        return (
                            <div
                                key={pillar.id}
                                className="bg-white rounded-xl border border-[#DDE6E2] p-6 flex flex-col justify-between text-left hover:border-[#173D39] hover:shadow-sm transition-all"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-[#E8F0ED] border border-[#DDE6E2] flex items-center justify-center text-[#173D39] mb-4">
                                        <Icon size={20} className="stroke-[2.2]" />
                                    </div>

                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F3F7F5] text-[#245B54] uppercase tracking-wider mb-2.5 inline-block border border-[#DDE6E2]">
                                        {pillar.badge}
                                    </span>

                                    <h3 className="text-base font-bold text-[#192B29] mb-2">
                                        {pillar.title}
                                    </h3>

                                    <p className="text-xs text-[#687773] leading-relaxed">
                                        {pillar.description}
                                    </p>
                                </div>

                                <div className="pt-4 mt-4 border-t border-[#F3F7F5] flex items-center gap-1.5 text-[11px] font-semibold text-[#237A57]">
                                    <CheckCircle2 size={13} />
                                    <span>Verified Policy</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Transparency Note */}
                <div className="mt-8 p-4 rounded-xl bg-white border border-[#DDE6E2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#687773] text-left">
                    <span className="text-[#192B29] font-medium">
                        <strong>Policy Transparency:</strong> MediBook does not accept sponsored placement fees from physicians or fabricate clinical outcome percentages.
                    </span>
                    <span className="text-[11px] text-[#245B54] font-semibold underline shrink-0 cursor-pointer">
                        View Clinical Governance Charter
                    </span>
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
