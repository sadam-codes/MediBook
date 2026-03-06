import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Loader2, Briefcase } from 'lucide-react';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000' });
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const DoctorStepper: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        if (step < 2) {
            setStep(step + 1);
            return;
        }
        setSubmitting(true);
        try {
            const cleanedData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
            );
            await api.post('/users/join-doctor', cleanedData);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.role = 'doctor';
            localStorage.setItem('user', JSON.stringify(user));
            toast.success('Your doctor profile has been created!');
            onComplete();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const onError = (errors: any) => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
            toast.error(errors[firstErrorKey].message as string);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 max-w-2xl mx-auto mt-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2.5 bg-sky-600" />

            <div className="mb-6 text-center">
                <div className="w-14 h-14 bg-sky-600 text-white rounded-[20px] flex items-center justify-center mx-auto mb-4 transform -rotate-3 shadow-md border border-sky-100">
                    <Briefcase size={28} className="fill-current" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">Doctor Application</h3>
                <p className="text-gray-500 font-medium text-sm max-w-md mx-auto leading-relaxed">
                    Join our network of elite healthcare professionals and reach more patients effortlessly.
                </p>
            </div>

            <div className="flex space-x-2 mb-8 max-w-sm mx-auto">
                <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-sky-600 shadow-sm shadow-sky-600/30' : 'bg-gray-100'}`} />
                <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-sky-600 shadow-sm shadow-sky-600/30' : 'bg-gray-100'}`} />
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">Specialization</label>
                            <input {...register('specialization', { required: 'Specialization is required' })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 rounded-xl outline-none text-gray-900 text-sm font-medium transition-all shadow-sm" placeholder="e.g. Cardiologist" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">License Number</label>
                            <input {...register('licenseNumber', { required: 'License Number is required' })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 rounded-xl outline-none text-gray-900 text-sm font-medium transition-all shadow-sm" placeholder="e.g. MED-123456" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">Years of Experience</label>
                            <input type="number" {...register('experience', { required: 'Years of Experience is required' })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 rounded-xl outline-none text-gray-900 text-sm font-medium transition-all shadow-sm" placeholder="e.g. 5" />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">Consultation Fee (PKR)</label>
                            <input type="number" {...register('consultationFee', { required: 'Consultation Fee is required' })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 rounded-xl outline-none text-gray-900 text-sm font-medium transition-all shadow-sm" placeholder="e.g. 1500" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">Professional Bio</label>
                            <textarea {...register('bio', { required: 'Professional Bio is required' })} rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-skyw-500 focus:ring-2 focus:ring-skyw-500/10 rounded-xl outline-none text-gray-900 text-sm font-medium transition-all shadow-sm resize-y leading-relaxed" placeholder="Tell patients about your expertise, background, and approach to medicine..."></textarea>
                        </div>
                    </div>
                )}

                <div className="flex items-center space-x-3 pt-4">
                    {step > 1 && (
                        <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-4 bg-white border border-gray-200 text-gray-700 font-bold text-[15px] rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                            Back
                        </button>
                    )}
                    <button type="submit" disabled={submitting} className="flex-1 px-6 py-4 bg-sky-600 hover:bg-sky-700 text-white font-black text-[15px] rounded-xl flex justify-center items-center shadow-lg shadow-sky-600/20 hover:-translate-y-0.5 transition-all outline-none active:scale-[0.98]">
                        {submitting ? <Loader2 className="animate-spin text-white" size={20} /> : (step === 2 ? 'Submit Application' : 'Continue')}
                    </button>
                </div>
            </form>
        </div>
    );
};
