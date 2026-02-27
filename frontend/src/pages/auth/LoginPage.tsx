import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:5000' });

const schema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

type FormData = yup.InferType<typeof schema>;

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data: FormData) => {
        setServerError('');
        try {
            const response = await api.post('/auth/login', data);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err: any) {
            setServerError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
            >
                <div className="p-8 sm:p-12 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-200 mb-6">
                            <Shield size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                        <p className="text-slate-400 font-bold text-sm mt-2">Enter your credentials to continue</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {serverError && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100 flex items-center justify-center uppercase tracking-widest"
                            >
                                {serverError}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Identity</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    {...register('email')}
                                    className={`w-full pl-14 pr-6 py-5 bg-slate-50 border-2 ${errors.email ? 'border-red-200 bg-red-50/30' : 'border-transparent focus:border-blue-500'} rounded-[24px] outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all`}
                                    placeholder="name@example.com"
                                />
                            </div>
                            <p className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-4 min-h-[14px]">{errors.email?.message}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    {...register('password')}
                                    className={`w-full pl-14 pr-6 py-5 bg-slate-50 border-2 ${errors.password ? 'border-red-200 bg-red-50/30' : 'border-transparent focus:border-blue-500'} rounded-[24px] outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all`}
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-4 min-h-[14px]">{errors.password?.message}</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 rounded-[28px] transition-all shadow-xl active:scale-95 flex items-center justify-center border-none"
                            style={{ backgroundColor: '#0f172a' }}
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Authorize Session'}
                        </button>
                    </form>

                    <div className="mt-10 flex flex-col items-center space-y-4">
                        <p className="text-sm font-bold text-slate-400">
                            New to MediBookAI?{' '}
                            <button onClick={() => navigate('/')} className="text-blue-600 hover:underline font-black bg-transparent border-none p-0 inline-flex items-center">
                                Join now <ArrowLeft size={14} className="ml-1 rotate-180" />
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};
