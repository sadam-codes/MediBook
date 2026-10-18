import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Mail, Lock, User, Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000' });

const schema = yup.object({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().email('Please enter a valid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

interface SignupFormData {
    fullName: string;
    email: string;
    password: string;
}

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: yupResolver(schema) as any
    });

    const onSubmit = async (data: SignupFormData) => {
        try {
            const response = await api.post('/auth/signup', data);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Account created successfully! Welcome to MediBook.');
            navigate('/home');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#F3F7F5] flex flex-col items-center justify-center p-4 sm:p-8 py-12 relative overflow-hidden">
            {/* Ambient Background Accents */}
            <div className="w-96 h-96 bg-[#BDE8DA]/30 rounded-full blur-3xl absolute -top-20 -right-20 pointer-events-none" />
            <div className="w-96 h-96 bg-[#E8F0ED]/70 rounded-full blur-3xl absolute -bottom-20 -left-20 pointer-events-none" />

            {/* Back Navigation */}
            <div className="w-full max-w-[480px] mb-4 z-10">
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#687773] hover:text-[#173D39] transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                </button>
            </div>

            {/* Main Signup Card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl shadow-[#173D39]/5 border border-[#DDE6E2] overflow-hidden p-8 sm:p-10 relative z-10"
            >
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-bold uppercase tracking-wider mb-4">
                        <ShieldCheck size={14} className="text-[#173D39]" />
                        <span>Patient & Clinical Member</span>
                    </div>

                    <Logo size="2xl" className="shadow-md shadow-[#173D39]/10 mb-3" />

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192B29] tracking-tight">
                        Create Your Account
                    </h1>
                    <p className="text-[#687773] text-sm mt-1.5 font-medium max-w-xs">
                        Join MediBook to schedule appointments with verified specialists and track your health care.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">
                            Full Name
                        </label>
                        <div className="relative group">
                            <User
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors"
                                size={18}
                            />
                            <input
                                {...register('fullName')}
                                className={`w-full pl-11 pr-4 py-3.5 bg-white border ${errors.fullName
                                        ? 'border-rose-400 bg-rose-50/20'
                                        : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                    } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                placeholder="John Smith / Dr. Jane Doe"
                            />
                        </div>
                        {errors.fullName && (
                            <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.fullName.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors"
                                size={18}
                            />
                            <input
                                {...register('email')}
                                className={`w-full pl-11 pr-4 py-3.5 bg-white border ${errors.email
                                        ? 'border-rose-400 bg-rose-50/20'
                                        : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                    } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                placeholder="name@example.com"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <Lock
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors"
                                size={18}
                            />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                className={`w-full pl-11 pr-12 py-3.5 bg-white border ${errors.password
                                        ? 'border-rose-400 bg-rose-50/20'
                                        : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                    } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                placeholder="Min 6 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#687773] hover:text-[#173D39] transition-colors bg-transparent border-none p-0 flex items-center justify-center focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#173D39] hover:bg-[#245B54] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center text-sm gap-2 mt-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin text-white" size={20} />
                        ) : (
                            <>
                                <span>Create MediBook Account</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-[#DDE6E2] text-center">
                    <p className="text-xs font-semibold text-[#687773]">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-[#173D39] hover:text-[#245B54] hover:underline font-bold transition-all bg-transparent border-none p-0 inline"
                        >
                            Sign In
                        </button>
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#687773] font-medium">
                    <ShieldCheck size={13} className="text-[#173D39]" />
                    <span>Your personal health data is encrypted and confidential</span>
                </div>
            </motion.div>
        </div>
    );
};
