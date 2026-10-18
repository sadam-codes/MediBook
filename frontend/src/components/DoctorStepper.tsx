import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Loader2, Briefcase, Stethoscope } from 'lucide-react';
import { CustomSelect } from './ui/CustomSelect';
import { specializations } from '../data/specializations';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000' });
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const DoctorStepper: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            specialization: '',
            licenseNumber: '',
            experience: '',
            consultationFee: '',
            bio: ''
        }
    });

    const specializationValue = watch('specialization');

    const specializationOptions = specializations.map((spec) => ({
        label: `${spec} Department`,
        value: spec
    }));

    const onSubmit = async (data: any) => {
        if (step === 1 && !data.specialization) {
            toast.error('Please select your clinical specialization');
            return;
        }
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
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-[#173D39]/5 border border-[#DDE6E2] max-w-2xl mx-auto mt-6 relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-full h-2.5 bg-[#173D39]" />

            <div className="mb-6 text-center">
                <div className="w-14 h-14 bg-[#173D39] text-[#BDE8DA] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#245B54] shadow-sm">
                    <Briefcase size={26} className="fill-current" />
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#192B29] tracking-tight mb-2">Physician Credentialing</h3>
                <p className="text-[#687773] font-normal text-sm max-w-md mx-auto leading-relaxed">
                    Join our network of vetted medical specialists and manage outpatient consultation schedules.
                </p>
            </div>

            <div className="flex space-x-2 mb-8 max-w-sm mx-auto">
                <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-[#173D39]' : 'bg-[#E8F0ED]'}`} />
                <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-[#173D39]' : 'bg-[#E8F0ED]'}`} />
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#192B29] ml-1">Clinical Specialization</label>
                            <CustomSelect
                                options={specializationOptions}
                                value={specializationValue}
                                onChange={(val) => setValue('specialization', val)}
                                placeholder="Select your medical discipline..."
                                icon={Stethoscope}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#192B29] ml-1">State License / Registration Number</label>
                            <input {...register('licenseNumber', { required: 'License Number is required' })} className="w-full px-4 py-2.5 bg-white border border-[#DDE6E2] hover:border-[#245B54] focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/15 rounded-xl outline-none text-[#192B29] text-sm font-medium transition-all shadow-xs min-h-[44px]" placeholder="e.g. MED-123456" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#192B29] ml-1">Years of Post-Residency Clinical Experience</label>
                            <input type="number" {...register('experience', { required: 'Years of Experience is required' })} className="w-full px-4 py-2.5 bg-white border border-[#DDE6E2] hover:border-[#245B54] focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/15 rounded-xl outline-none text-[#192B29] text-sm font-medium transition-all shadow-xs min-h-[44px]" placeholder="e.g. 8" />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#192B29] ml-1">Outpatient Consultation Fee (USD)</label>
                            <input type="number" {...register('consultationFee', { required: 'Consultation Fee is required' })} className="w-full px-4 py-2.5 bg-white border border-[#DDE6E2] hover:border-[#245B54] focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/15 rounded-xl outline-none text-[#192B29] text-sm font-medium transition-all shadow-xs min-h-[44px]" placeholder="e.g. 150" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#192B29] ml-1">Professional Bio & Clinical Focus</label>
                            <textarea {...register('bio', { required: 'Professional Bio is required' })} rows={4} className="w-full px-4 py-3 bg-white border border-[#DDE6E2] hover:border-[#245B54] focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/15 rounded-xl outline-none text-[#192B29] text-sm font-medium transition-all shadow-xs resize-y leading-relaxed" placeholder="Summarize your board certifications, outpatient approach, and hospital affiliations..."></textarea>
                        </div>
                    </div>
                )}

                <div className="flex items-center space-x-3 pt-4">
                    {step > 1 && (
                        <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3.5 bg-white border border-[#DDE6E2] text-[#192B29] font-semibold text-sm rounded-xl hover:bg-[#F3F7F5] transition-all shadow-xs">
                            Back
                        </button>
                    )}
                    <button type="submit" disabled={submitting} className="flex-1 px-6 py-3.5 bg-[#173D39] hover:bg-[#245B54] text-white font-bold text-sm rounded-xl flex justify-center items-center shadow-md transition-all active:scale-[0.98]">
                        {submitting ? <Loader2 className="animate-spin text-white" size={20} /> : (step === 2 ? 'Submit Application' : 'Continue to Practice Details')}
                    </button>
                </div>
            </form>
        </div>
    );
};
