import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowLeft, Heart, Briefcase } from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:5000' });

const schema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    phoneNumber: yup.string().optional(),
    specialization: yup.string().optional(),
    licenseNumber: yup.string().optional(),
    experience: yup.number().nullable().transform((_, val) => (val === '' ? null : Number(val))).optional(),
    bio: yup.string().optional(),
    consultationFee: yup.number().nullable().transform((_, val) => (val === '' ? null : Number(val))).optional(),
    dateOfBirth: yup.string().optional(),
    gender: yup.string().oneOf(['male', 'female', 'other', '']).optional(),
    bloodGroup: yup.string().oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).optional(),
    allergies: yup.string().optional(),
    medicalHistory: yup.string().optional(),
    address: yup.string().optional(),
    emergencyContactName: yup.string().optional(),
    emergencyContactPhone: yup.string().optional(),
    department: yup.string().optional(),
}).required();

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [role, setRole] = useState('patient');

    useEffect(() => {
        const storedRole = localStorage.getItem('selectedRole');
        if (!storedRole) navigate('/');
        setRole(storedRole || 'patient');
    }, [navigate]);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
        resolver: yupResolver(schema) as any
    });

    const onSubmit = async (data: any) => {
        setServerError('');
        try {
            const cleanedData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
            );
            const response = await api.post('/auth/signup', { ...cleanedData, role });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err: any) {
            setServerError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[600px] h-full max-h-[850px] bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
            >
                {/* Header Block */}
                <div className="p-8 sm:p-12 pb-6 shrink-0 relative border-b border-slate-50">
                    <button
                        onClick={() => navigate('/')}
                        className="absolute left-8 top-8 w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-colors bg-white border border-slate-100"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="text-center">
                        <div className="inline-flex items-center space-x-2 text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-3">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                            <span>{role} Enrollment</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
                        <p className="text-slate-400 font-bold text-sm mt-3">
                            Already a member?{' '}
                            <button onClick={() => navigate('/login')} className="text-blue-600 font-black hover:underline bg-transparent border-none">Sign In</button>
                        </p>
                    </div>
                </div>

                {/* Form Area - Scrollable */}
                <div className="flex-1 overflow-y-auto p-8 sm:px-12 pb-12 custom-scrollbar">
                    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                        {serverError && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-[20px] text-xs font-black border border-red-100 uppercase tracking-widest text-center">
                                {serverError}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                <input {...register('firstName')} className={`w-full px-6 py-4 bg-slate-50 border-2 ${errors.firstName ? 'border-red-200' : 'border-transparent focus:border-blue-500'} rounded-2xl outline-none font-bold text-slate-700 transition-all`} />
                                <p className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-1">{errors.firstName?.message as string}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                <input {...register('lastName')} className={`w-full px-6 py-4 bg-slate-50 border-2 ${errors.lastName ? 'border-red-200' : 'border-transparent focus:border-blue-500'} rounded-2xl outline-none font-bold text-slate-700 transition-all`} />
                                <p className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-1">{errors.lastName?.message as string}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input {...register('email')} className={`w-full px-6 py-4 bg-slate-50 border-2 ${errors.email ? 'border-red-200' : 'border-transparent focus:border-blue-500'} rounded-2xl outline-none font-bold text-slate-700 transition-all`} />
                            <p className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-1">{errors.email?.message as string}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                            <input type="password" {...register('password')} className={`w-full px-6 py-4 bg-slate-50 border-2 ${errors.password ? 'border-red-200' : 'border-transparent focus:border-blue-500'} rounded-2xl outline-none font-bold text-slate-700 transition-all`} />
                            <p className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-1">{errors.password?.message as string}</p>
                        </div>

                        {/* Role Specific Fields */}
                        {role === 'doctor' && (
                            <div className="space-y-6 pt-4 border-t border-slate-50">
                                <div className="flex items-center space-x-2 text-blue-600 mb-2">
                                    <Briefcase size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Professional Credentials</span>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Specialization</label>
                                        <input {...register('specialization')} className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-blue-500 border-2 rounded-2xl outline-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">License No.</label>
                                        <input {...register('licenseNumber')} className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-blue-500 border-2 rounded-2xl outline-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee (Rs.)</label>
                                        <input type="number" {...register('consultationFee')} className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-blue-500 border-2 rounded-2xl outline-none font-bold" />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biography</label>
                                        <textarea {...register('bio')} rows={3} className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-blue-500 border-2 rounded-[24px] outline-none font-bold resize-none"></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {role === 'patient' && (
                            <div className="space-y-6 pt-4 border-t border-slate-50">
                                <div className="flex items-center space-x-2 text-blue-600 mb-2">
                                    <Heart size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Personal Health Profile</span>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Birth Date</label>
                                        <input type="date" {...register('dateOfBirth')} className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-blue-500 border-2 rounded-2xl outline-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                                        <select {...register('gender')} className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-blue-500 border-2 rounded-2xl outline-none font-bold bg-transparent">
                                            <option value="">Select...</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact & History</label>
                                        <input placeholder="Emergency Contact Name" {...register('emergencyContactName')} className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-blue-500 border-2 rounded-2xl outline-none font-bold mb-4" />
                                        <textarea placeholder="Medical History / Allergies" {...register('medicalHistory')} rows={2} className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-blue-500 border-2 rounded-[24px] outline-none font-bold resize-none"></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-6 rounded-[32px] transition-all shadow-xl active:scale-95 flex items-center justify-center border-none mt-8"
                            style={{ backgroundColor: '#0f172a' }}
                        >
                            {isSubmitting ? <Loader2 className="animate-spin text-white" /> : 'Finalize Registration'}
                        </button>
                    </form>
                </div>
            </motion.div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
            `}</style>
        </div>
    );
};
