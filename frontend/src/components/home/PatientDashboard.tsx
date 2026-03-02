import React from 'react';
import { Loader2, Calendar, Award } from 'lucide-react';

interface PatientDashboardProps {
    doctors: any[];
    loading: boolean;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ doctors, loading }) => {
    return (
        <div className="flex-1">
            <div className="mb-10 text-left">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">Expert Specialists</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs opacity-60 italic">Available for booking today</p>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-emerald-600" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
                    {doctors.map(doc => (
                        <div key={doc.id} className="bg-white p-10 rounded-[20px] shadow-sm border border-gray-100 hover:border-emerald-300 transition-all duration-500 hover:shadow-2xl flex flex-col group relative overflow-hidden text-left">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-30 group-hover:bg-emerald-200 transition-colors" />
                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div className="text-left">
                                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">Dr. {doc.user?.firstName} {doc.user?.lastName}</h3>
                                    <p className="text-emerald-600 font-black uppercase text-[10px] tracking-widest mt-2 italic flex items-center">
                                        <Award size={12} className="mr-1" />
                                        {doc.specialization}
                                    </p>
                                </div>
                                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                                    Rs.{doc.consultationFee}
                                </div>
                            </div>
                            <p className="text-gray-400 font-bold text-sm mb-10 flex-1 line-clamp-3 text-left leading-relaxed italic opacity-80">
                                {doc.bio || 'Providing expert medical consultation with focus on long-term wellness and personalized patient care.'}
                            </p>
                            <button className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 rounded-[28px] transition-all flex items-center justify-center mt-auto border border-white/5 shadow-2xl shadow-slate-900/10 hover:shadow-emerald-500/30 active:scale-95 text-[10px] uppercase tracking-[0.2em]">
                                <Calendar size={18} className="mr-3" /> Book Consultation
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
