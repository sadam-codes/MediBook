import React from 'react';
import { Calendar, UserPlus } from 'lucide-react';

interface DoctorDashboardProps {
    user: any;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="bg-emerald-950 rounded-[56px] p-12 mb-10 overflow-hidden relative shadow-2xl shrink-0 border border-white/5 text-left">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[100px] opacity-40"></div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-10">
                    <div className="text-left">
                        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 mb-5">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">System Online</span>
                        </div>
                        <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Dr. {user.firstName}</h2>
                        <p className="text-emerald-200 font-black text-xs uppercase tracking-[0.3em] opacity-40 italic">Medical Analytics Console</p>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-white/5 backdrop-blur-3xl px-10 py-6 rounded-[40px] border border-white/10 shadow-2xl">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 opacity-60 text-left">Patients Today</p>
                            <p className="text-4xl font-black text-white leading-none">0</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-10 rounded-[56px] shadow-sm border border-gray-100 flex-1 min-h-0">
                <div className="text-left flex flex-col">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10 flex items-center">
                        <Calendar size={18} className="mr-3 text-emerald-500" />
                        Appointment Queue
                    </h3>
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[20px] bg-gray-50/30 group hover:bg-white hover:border-emerald-100 transition-all duration-700">
                        <div className="p-6 bg-white rounded-3xl shadow-sm mb-5 group-hover:scale-110 transition-transform duration-500">
                            <Calendar size={32} className="text-gray-200 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">Queue is currently empty</p>
                    </div>
                </div>
                <div className="text-left flex flex-col">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10 flex items-center">
                        <UserPlus size={18} className="mr-3 text-emerald-500" />
                        Patient Database
                    </h3>
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[20px] bg-gray-50/30 group hover:bg-white hover:border-emerald-100 transition-all duration-700">
                        <div className="p-6 bg-white rounded-3xl shadow-sm mb-5 group-hover:scale-110 transition-transform duration-500">
                            <UserPlus size={32} className="text-gray-200 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">No patient records found</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
