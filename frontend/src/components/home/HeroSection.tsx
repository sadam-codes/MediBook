import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import doctorimage from '../../assets/mendoctor.jpg';

interface HeroSectionProps {
    onBookClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onBookClick }) => {
    return (
        <div className="bg-white rounded-[20px] p-8 md:p-14 mb-14 shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center gap-14 text-center lg:text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            <div className="flex-1 lg:w-3/5 pl-0 lg:pl-10 relative z-10 text-left">
                <div className="inline-flex items-center space-x-2 bg-sky-50 px-4 py-2 rounded-full border border-sky-100 mb-8">
                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">MediBook Excellence</span>
                </div>
                <h1 className="text-4xl lg:text-[4rem] font-black text-gray-900 mb-8 tracking-tighter leading-[0.95] text-left">
                    Your Health, <br /><span className="text-sky-600">Our Priority.</span>
                </h1>

                <p className="text-gray-500 text-lg md:text-xl mb-10 max-w-xl text-left leading-relaxed font-bold">
                    Join thousands of satisfied patients who trust our platform for safe,
                    reliable, and professional healthcare services.
                </p>

                <div className="flex flex-col space-y-3 mb-12 text-left">
                    <div className="flex items-center space-x-3 text-slate-400 font-black uppercase tracking-widest text-xs">
                        <CheckCircle2 size={16} className="text-sky-500" />
                        <span>No hidden charges</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-400 font-black uppercase tracking-widest text-xs">
                        <CheckCircle2 size={16} className="text-sky-500" />
                        <span>Trusted specialists</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-400 font-black uppercase tracking-widest text-xs">
                        <CheckCircle2 size={16} className="text-sky-500" />
                        <span>Easy booking process</span>
                    </div>
                </div>

                <button
                    onClick={onBookClick}
                    className="px-12 py-5 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-2xl shadow-2xl shadow-sky-500/30 transition-all text-lg active:scale-95 uppercase tracking-widest"
                >
                    Book Session Now
                </button>
            </div>
            <div className="flex-1 lg:w-2/5 w-full relative flex items-center justify-center">
                <div className="absolute inset-0 bg-sky-600/5 rounded-[20px] transform rotate-3 scale-105"></div>
                <img
                    src={doctorimage}
                    alt="Doctor talking to patient"
                    className="relative w-full object-cover rounded-[20px] shadow-2xl border-4 border-white"
                />
            </div>
        </div>
    );
};

export default HeroSection;
