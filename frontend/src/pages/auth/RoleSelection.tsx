import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Activity, ShieldCheck, HeartPulse } from 'lucide-react';

export const RoleSelection: React.FC = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role: string) => {
        if (role === 'admin') {
            navigate('/login');
            return;
        }
        localStorage.setItem('selectedRole', role);
        navigate('/signup');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-6 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-100/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-100/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

            <motion.div
                className="max-w-6xl w-full relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="text-center mb-16">
                    <motion.div variants={itemVariants} className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-3xl shadow-sm border border-slate-100 mb-8">
                        <HeartPulse className="text-sky-600 animate-pulse" size={24} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Next Gen Healthcare</span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
                        MediBook<span className="text-sky-600">AI</span>
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">
                        Experience the future of medical management. <br className="hidden md:block" /> Select your entry point to the ecosystem.
                    </motion.p>
                </div>

                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <RoleCard
                        icon={<User size={40} />}
                        title="Patient"
                        description="Access world-class care, book appointments, and manage health records live."
                        onClick={() => handleRoleSelect('patient')}
                        color="sky"
                    />
                    <RoleCard
                        icon={<Activity size={40} />}
                        title="Doctor"
                        description="Empower your practice with advanced scheduling and patient analytics."
                        onClick={() => handleRoleSelect('doctor')}
                        color="sky"
                    />
                    <RoleCard
                        icon={<ShieldCheck size={40} />}
                        title="Admin"
                        description="Global platform administration, user security, and system auditing."
                        onClick={() => handleRoleSelect('admin')}
                        color="slate"
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="mt-16 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-10 py-4 bg-white border border-slate-200 text-slate-600 font-black text-sm rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95"
                    >
                        Sign in to existing account
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

interface RoleCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    color: 'blue' | 'sky' | 'slate';
}

const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description, onClick, color }) => {
    const colorMap = {
        blue: 'hover:border-sky-500 hover:shadow-sky-200/40 text-sky-600',
        sky: 'hover:border-sky-500 hover:shadow-sky-200/40 text-sky-600',
        slate: 'hover:border-slate-900 hover:shadow-slate-200/40 text-slate-900',
    };

    return (
        <motion.button
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`flex flex-col items-center text-center p-10 bg-white rounded-[40px] border-2 border-transparent shadow-2xl transition-all duration-500 group relative overflow-hidden ${colorMap[color]}`}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-sky-50/50 transition-colors"></div>

            <div className={`mb-8 w-20 h-20 rounded-[28px] ${color === 'slate' ? 'bg-slate-900 text-white' : 'bg-slate-50 group-hover:bg-white'} flex items-center justify-center shadow-inner transition-all relative z-10`}>
                {icon}
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10">{title}</h3>
            <p className="text-slate-400 font-bold text-sm leading-relaxed relative z-10">
                {description}
            </p>
        </motion.button>
    );
};
