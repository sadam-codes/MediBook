import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Activity, ShieldCheck, HeartPulse, ArrowRight } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';

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
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen w-full bg-[#F3F7F5] flex items-center justify-center p-4 sm:p-8 py-12 relative overflow-hidden">
            {/* Ambient Background Decorative Radiance */}
            <div className="w-[500px] h-[500px] bg-[#BDE8DA]/30 rounded-full blur-3xl absolute -top-32 -right-32 pointer-events-none" />
            <div className="w-[400px] h-[400px] bg-[#E8F0ED]/70 rounded-full blur-3xl absolute -bottom-24 -left-24 pointer-events-none" />

            <motion.div
                className="w-full max-w-5xl relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <motion.div variants={itemVariants} className="flex justify-center mb-4">
                        <Logo size="2xl" className="shadow-md shadow-[#173D39]/10" />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 shadow-sm"
                    >
                        <HeartPulse className="text-[#173D39] animate-pulse" size={16} />
                        <span>Clinical Portal Selection</span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#192B29] mb-4 tracking-tight"
                    >
                        Welcome to MediBook
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-sm sm:text-lg text-[#687773] font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        Experience thoughtful, modern healthcare management. <br className="hidden sm:inline" />
                        Select your entry point to access clinical consultations and scheduling.
                    </motion.p>
                </div>

                {/* 3 Role Cards */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <RoleCard
                        roleTag="For Individuals & Families"
                        icon={<User size={30} />}
                        title="Patient Portal"
                        description="Find certified specialists, book seamless appointments, and access clinical consultations."
                        ctaText="Enter as Patient"
                        onClick={() => handleRoleSelect('patient')}
                    />
                    <RoleCard
                        roleTag="For Healthcare Providers"
                        icon={<Activity size={30} />}
                        title="Doctor & Specialist"
                        description="Empower your medical practice with verified scheduling, appointments, and patient profiles."
                        ctaText="Join as Doctor"
                        onClick={() => handleRoleSelect('doctor')}
                    />
                    <RoleCard
                        roleTag="For Clinical Administration"
                        icon={<ShieldCheck size={30} />}
                        title="Hospital Admin"
                        description="Oversee verified practitioners, system security, hospital compliance, and auditing."
                        ctaText="Admin Portal"
                        onClick={() => handleRoleSelect('admin')}
                    />
                </motion.div>

                {/* Bottom Back / Sign-in Link */}
                <motion.div variants={itemVariants} className="mt-12 sm:mt-16 text-center">
                    <p className="text-xs font-semibold text-[#687773] mb-3">
                        Already have an active account?
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-3.5 bg-white border border-[#DDE6E2] hover:border-[#173D39] hover:bg-[#173D39] hover:text-white text-[#192B29] font-bold text-sm rounded-xl transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
                    >
                        <span>Sign in to existing account</span>
                        <ArrowRight size={15} />
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

interface RoleCardProps {
    roleTag: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    ctaText: string;
    onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ roleTag, icon, title, description, ctaText, onClick }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="flex flex-col items-center text-center p-8 sm:p-10 bg-white rounded-2xl border border-[#DDE6E2] hover:border-[#173D39] hover:shadow-xl hover:shadow-[#173D39]/10 transition-all duration-300 group cursor-pointer relative overflow-hidden"
        >
            {/* Soft decorative background pill on hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F3F7F5] rounded-full -mr-16 -mt-16 group-hover:bg-[#E8F0ED]/70 transition-colors pointer-events-none" />

            <div className="text-[11px] font-bold uppercase tracking-wider text-[#173D39] bg-[#E8F0ED] px-3 py-1 rounded-full border border-[#DDE6E2] mb-6 relative z-10">
                {roleTag}
            </div>

            <div className="mb-6 w-16 h-16 rounded-2xl bg-[#E8F0ED] group-hover:bg-[#173D39] text-[#173D39] group-hover:text-[#BDE8DA] flex items-center justify-center shadow-inner transition-all duration-300 group-hover:scale-105 relative z-10">
                {icon}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#192B29] mb-3 relative z-10">
                {title}
            </h2>

            <p className="text-sm text-[#687773] leading-relaxed mb-8 font-medium flex-1 relative z-10">
                {description}
            </p>

            <div className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all bg-[#F3F7F5] text-[#173D39] group-hover:bg-[#173D39] group-hover:text-white border border-[#DDE6E2] group-hover:border-[#173D39] relative z-10">
                <span>{ctaText}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </motion.div>
    );
};
