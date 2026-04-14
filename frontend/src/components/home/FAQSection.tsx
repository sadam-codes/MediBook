import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqs } from '../../data/homeData';

const FAQAccordion = ({ q, a }: { q: string, a: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`bg-white rounded-3xl border transition-all duration-300 ${isOpen ? 'border-sky-200 shadow-xl shadow-sky-500/5' : 'border-gray-100 shadow-sm hover:border-gray-200'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
            >
                <span className={`font-black text-lg ${isOpen ? 'text-sky-600' : 'text-gray-900 group-hover:text-sky-600'} transition-colors tracking-tight`}>{q}</span>
                <div className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-sky-600 text-white shadow-lg shadow-sky-200' : 'bg-gray-50 text-gray-400'}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="px-8 pb-7 text-gray-500 font-bold leading-relaxed text-[15px]">
                            {a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQSection: React.FC = () => {
    return (
        <div className="mb-24">
            <div className="text-center mb-16 relative">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Need Assistance?</h2>
                <p className="text-gray-400 font-bold max-w-2xl mx-auto text-lg opacity-80">Quick answers to frequently asked questions about MediBook.</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-5">
                {faqs.map((faq, i) => (
                    <FAQAccordion key={i} q={faq.q} a={faq.a} />
                ))}
            </div>
        </div>
    );
};

export default FAQSection;
