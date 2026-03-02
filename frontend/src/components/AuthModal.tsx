import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Shield, Mail, Lock, Loader2, X, User, Eye, EyeOff } from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:5000' });

const loginSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

const signupSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    role: yup.string().oneOf(['patient', 'doctor']).required('Role is required'),
}).required();

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
    initialRole?: 'patient' | 'doctor';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login', initialRole = 'patient' }) => {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<any>({
        resolver: yupResolver(mode === 'login' ? loginSchema : signupSchema),
        defaultValues: { role: 'patient' }
    });

    const selectedRole = watch('role');

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setValue('role', initialRole || 'patient');
            reset({}, { keepValues: true }); // We want to keep the role value we just set
        }
    }, [isOpen, initialMode, initialRole, reset, setValue]);

    const onSubmit = async (data: any) => {
        try {
            const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';

            // Filter payload to only include fields required by the backend for each specific mode
            const payload = mode === 'login'
                ? { email: data.email, password: data.password }
                : {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
                    role: data.role
                };

            const response = await api.post(endpoint, payload);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success(mode === 'login' ? 'Welcome back!' : 'Account created successfully!');
            onClose();
            window.location.reload();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setShowPassword(false);
        reset();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-[540px] bg-white rounded-[20px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 mb-5">
                                    <Shield size={28} />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                                </h2>
                                <p className="text-slate-400 font-bold text-xs mt-2">
                                    {mode === 'login' ? 'Enter your credentials to continue' : 'Join MediBookAI today'}
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                {mode === 'signup' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Role</label>
                                            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 rounded-[20px] border border-slate-100">
                                                <button
                                                    type="button"
                                                    onClick={() => setValue('role', 'patient')}
                                                    className={`py-2 rounded-[16px] font-black text-[10px] uppercase tracking-widest transition-all ${selectedRole === 'patient' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    Patient
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setValue('role', 'doctor')}
                                                    className={`py-2 rounded-[16px] font-black text-[10px] uppercase tracking-widest transition-all ${selectedRole === 'doctor' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    Doctor
                                                </button>
                                            </div>
                                            <input type="hidden" {...register('role')} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                                    <input
                                                        {...register('firstName')}
                                                        className={`w-full pl-12 pr-6 py-3.5 bg-slate-50 border-2 ${errors.firstName ? 'border-red-200 bg-red-50/30' : 'border-transparent focus:border-emerald-500'} rounded-[20px] outline-none font-bold text-sm text-slate-700 placeholder:text-slate-300 transition-all`}
                                                        placeholder="John"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                                    <input
                                                        {...register('lastName')}
                                                        className={`w-full pl-12 pr-6 py-3.5 bg-slate-50 border-2 ${errors.lastName ? 'border-red-200 bg-red-50/30' : 'border-transparent focus:border-emerald-500'} rounded-[20px] outline-none font-bold text-sm text-slate-700 placeholder:text-slate-300 transition-all`}
                                                        placeholder="Doe"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Identity</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                        <input
                                            {...register('email')}
                                            className={`w-full pl-12 pr-6 py-4 bg-slate-50 border-2 ${errors.email ? 'border-red-200 bg-red-50/30' : 'border-transparent focus:border-emerald-500'} rounded-[20px] outline-none font-bold text-sm text-slate-700 placeholder:text-slate-300 transition-all`}
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    <p className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-4 min-h-[14px]">{errors.email?.message as string}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            {...register('password')}
                                            className={`w-full pl-12 pr-12 py-4 bg-slate-50 border-2 ${errors.password ? 'border-red-200 bg-red-50/30' : 'border-transparent focus:border-emerald-500'} rounded-[20px] outline-none font-bold text-sm text-slate-700 placeholder:text-slate-300 transition-all`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors bg-transparent border-none p-0 flex items-center justify-center focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-4 min-h-[14px]">{errors.password?.message as string}</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-4 rounded-[20px] transition-all shadow-xl active:scale-95 flex items-center justify-center border-none text-sm"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : mode === 'login' ? 'Login' : 'Create Account'}
                                </button>
                            </form>
                            <div className="mt-8 flex flex-col items-center space-y-4">
                                <p className="text-xs font-bold text-slate-400">
                                    {mode === 'login' ? "New to MediBookAI?" : "Already Have an Account?"}{' '}
                                    <button onClick={toggleMode} className="text-emerald-600 hover:underline font-black bg-transparent border-none p-0 ml-1">
                                        {mode === 'login' ? "Join now" : "Login instead"}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
