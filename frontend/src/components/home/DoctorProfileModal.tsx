import React from 'react';
import { X, ShieldCheck, Award, Star, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DoctorProfileModalProps {
    doctor: any;
    isOpen: boolean;
    onClose: () => void;
    onBook: () => void;
}

const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({ doctor, isOpen, onClose, onBook }) => {
    if (!isOpen || !doctor) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white w-full max-w-2xl rounded-[20px] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh]"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-emerald-600 hover:text-white rounded-full transition-all backdrop-blur-md border border-gray-100 text-slate-400 shadow-sm"
                    >
                        <X size={20} />
                    </button>

                    <div className="overflow-y-auto custom-scrollbar flex-1">
                        <div className="flex flex-col md:flex-row">
                            {/* Image Section */}
                            <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0">
                                <img src={doctor.img} alt={doctor.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/40 to-transparent" />
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 p-6 md:p-10 flex flex-col">
                                <div className="mb-6">
                                    <div className="inline-flex items-center space-x-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-4 text-left">
                                        <ShieldCheck size={14} className="text-emerald-600" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Specialist</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-2 text-left">{doctor.name}</h2>
                                    <p className="text-emerald-600 font-bold text-base md:text-lg text-left">{doctor.spec}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left">
                                        <div className="flex items-center space-x-2 text-gray-400 mb-1">
                                            <Award size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Experience</span>
                                        </div>
                                        <p className="text-gray-900 font-black text-sm md:text-base">{doctor.exp}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left">
                                        <div className="flex items-center space-x-1 text-yellow-500 mb-1">
                                            <Star size={14} className="fill-current" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Rating</span>
                                        </div>
                                        <p className="text-gray-900 font-black text-sm md:text-base">{doctor.rating} <span className="text-gray-400 text-xs">({doctor.reviews})</span></p>
                                    </div>
                                </div>

                                <div className="mb-8 text-left">
                                    <h4 className="text-gray-900 font-black text-xs md:text-sm uppercase tracking-widest mb-3 flex items-center">
                                        <Clock size={16} className="mr-2 text-emerald-500" />
                                        About Specialist
                                    </h4>
                                    <p className="text-gray-500 font-bold leading-relaxed text-sm italic">
                                        "{doctor.bio}"
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={onBook}
                                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
                                    >
                                        <CalendarIcon size={18} />
                                        <span>Book Appointment</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DoctorProfileModal;
