import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HEALTHCARE_FAQS } from '../../data/healthcareData';

const FAQAccordion = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`rounded-xl border transition-all duration-200 ${isOpen ? 'bg-[#F3F7F5] border-[#173D39] shadow-sm' : 'bg-white border-[#DDE6E2] hover:border-[#245B54]'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
                aria-expanded={isOpen}
            >
                <span className={`font-bold text-sm sm:text-base ${isOpen ? 'text-[#173D39]' : 'text-[#192B29] group-hover:text-[#173D39]'} transition-colors pr-4`}>
                    {question}
                </span>
                <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${isOpen ? 'bg-[#173D39] text-white' : 'bg-[#E8F0ED] text-[#173D39]'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-5 pt-1 text-[#687773] text-xs sm:text-sm leading-relaxed border-t border-[#DDE6E2]/50 text-left">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const FAQSection: React.FC = () => {
    return (
        <section id="faq" className="py-16 sm:py-24 bg-[#F3F7F5] border-b border-[#DDE6E2]" aria-label="Frequently Asked Questions">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-semibold mb-3">
                        <HelpCircle size={13} className="text-[#245B54]" />
                        <span>Patient Assistance</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#192B29] tracking-tight">
                        Frequently Asked Clinical Questions
                    </h2>
                    <p className="text-[#687773] text-sm sm:text-base mt-2 font-normal">
                        Answers regarding verified appointments, clinic intake, billing, and confidentiality.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-3">
                    {HEALTHCARE_FAQS.map((faq, i) => (
                        <FAQAccordion key={i} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
