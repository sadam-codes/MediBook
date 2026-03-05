import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:5000' });

const schema = yup.object({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

interface SignupFormData {
    fullName: string;
    email: string;
    password: string;
}

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: yupResolver(schema) as any
    });

    const onSubmit = async (data: SignupFormData) => {
        try {
            const response = await api.post('/auth/signup', data);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Account created successfully!');
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
        <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-8 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[500px] bg-white rounded-[20px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
            >
                {/* Header Block */}
                <div className="p-8 pb-6 shrink-0 relative border-b border-gray-100">
                    <button
                        onClick={() => navigate('/')}
                        className="absolute left-6 top-6 w-8 h-8 rounded-md hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors bg-white border border-gray-200"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className="text-center mt-4">
                        <div className="inline-flex items-center space-x-2 text-emerald-600 font-semibold text-xs uppercase tracking-wider mb-2">
                            <span>Join MediBookAI</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
                        <p className="text-gray-500 font-medium text-sm mt-2">
                            Already a member?{' '}
                            <button onClick={() => navigate('/login')} className="text-emerald-600 font-medium hover:underline bg-transparent border-none">Sign In</button>
                        </p>
                    </div>
                </div>

                {/* Form Area - Scrollable */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Full Name</label>
                            <input {...register('fullName')} className={`w-full px-4 py-3 bg-white border ${errors.fullName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'} rounded-lg outline-none text-gray-900 transition-all`} />
                            <p className="text-xs text-red-600 font-medium">{errors.fullName?.message as string}</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Email Address</label>
                            <input {...register('email')} className={`w-full px-4 py-3 bg-white border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'} rounded-lg outline-none text-gray-900 transition-all`} />
                            <p className="text-xs text-red-600 font-medium">{errors.email?.message as string}</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    className={`w-full px-4 pr-12 py-3 bg-white border ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'} rounded-lg outline-none text-gray-900 transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors bg-transparent border-none p-0 flex items-center justify-center focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-red-600 font-medium">{errors.password?.message as string}</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md active:scale-[0.98] flex items-center justify-center border-none mt-6"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin text-white" /> : 'Create Account'}
                        </button>
                    </form>
                </div>
            </motion.div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
            `}</style>
        </div>
    );
};
