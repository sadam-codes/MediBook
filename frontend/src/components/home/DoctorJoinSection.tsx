import React from 'react';

const DoctorJoinSection: React.FC = () => {
    const handleJoinClick = () => {
        sessionStorage.setItem('showSignup', 'true');
        sessionStorage.setItem('signupRole', 'doctor');
        window.location.reload();
    };

    return (
        <div className="bg-slate-950 rounded-[20px] p-10 md:p-20 mb-24 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-600/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center space-x-2 bg-sky-500/10 px-5 py-2 rounded-full border border-sky-500/20 mb-10">
                    <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Medical Professionals Portal</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none max-w-4xl text-center">
                    Reach more patients, <br /><span className="text-sky-500">Grow your Practice.</span>
                </h2>
                <p className="text-slate-400 text-xl mb-14 max-w-2xl font-bold leading-relaxed opacity-80 text-center">
                    Join our global network of experts and manage your clinic with <br className="hidden md:block" /> AI-integrated healthcare solutions.
                </p>
                <button
                    onClick={handleJoinClick}
                    className="px-10 py-6 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-[20px] transition-all text-xl active:scale-95 uppercase tracking-widest "
                >
                    Join as Doctor
                </button>
            </div>
        </div>
    );
};

export default DoctorJoinSection;
