import React from 'react';
import { Star, Award, ShieldCheck } from 'lucide-react';
import { doctorData } from '../../data/homeData';

interface DoctorsSpecialistsSectionProps {
    onViewProfile: (doc: any) => void;
    doctors: any[];
}

const DoctorsSpecialistsSection: React.FC<DoctorsSpecialistsSectionProps> = ({ onViewProfile }) => {
    const displayDoctors = doctorData.slice(0, 6);

    return (
        <div className="mb-24">
            <div className="text-center mb-16 relative">
                <div className="inline-flex items-center space-x-2 bg-sky-50 px-5 py-2 rounded-full border border-sky-100 mb-6">
                    <span className="text-[10px] font-black text-sky-600 uppercase tracking-[0.2em]">Our Elite Medical Team</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Meet Our Specialists</h2>
                <p className="text-gray-400 font-bold max-w-2xl mx-auto text-lg leading-relaxed">Our world-class healthcare professionals are here to provide you with the best medical care and expertise.</p>
            </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {displayDoctors.map((doc, i) => (
                    <div key={i} className="group bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-700 hover:-translate-y-3">
                        <div className="relative h-64 overflow-hidden">
                            <div className="absolute inset-0 bg-sky-950/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                            <img
                                src={doc.img}
                                alt={doc.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute bottom-6 left-6 z-20">
                                <div className="bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20 shadow-2xl">
                                    <div className="flex items-center space-x-2">
                                        <Award size={14} className="text-sky-600" />
                                        <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">{doc.exp}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 text-left">
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-sky-600 transition-colors uppercase leading-none">{doc.name}</h3>
                                    <div className="flex items-center space-x-1 text-yellow-500">
                                        <Star size={16} className="fill-current" />
                                        <span className="text-xs font-black text-gray-900 ml-1">{doc.rating}</span>
                                    </div>
                                </div>
                                <p className="text-sky-500 font-bold text-sm uppercase opacity-80">{doc.spec}</p>
                            </div>

                            <div className="flex items-center space-x-3 mb-10">
                                <div className="flex -space-x-2.5">
                                    {[...Array(5)].map((_, idx) => (
                                        <div key={idx} className="w-6 h-6 rounded-full bg-sky-50 border-2 border-white flex items-center justify-center">
                                            <ShieldCheck size={12} className="text-sky-500" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Verified Professional</span>
                            </div>

                            <button
                            type="button"
                                onClick={() => onViewProfile(doc)}
                                className="w-full py-5 bg-sky-600 text-white font-black rounded-[20px] transition-all duration-500 shadow-2xl shadow-slate-900/10 hover:shadow-sky-600/30 text-[10px] uppercase tracking-[0.2em] active:scale-95 border border-white/5"
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorsSpecialistsSection;
