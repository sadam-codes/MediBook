import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Loader2, Heart, CalendarDays } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000' });
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const schema = yup.object({
    dateOfBirth: yup.string().required('Birth Date is required'),
    gender: yup.string().required('Gender is required'),
    bloodGroup: yup.string().required('Blood Group is required'),
    phoneNumber: yup.string().required('Phone Number is required'),
    medicalHistory: yup.string()
}).required();

export const PatientForm: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [submitting, setSubmitting] = useState(false);
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const { register, handleSubmit, setValue, watch } = useForm({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            dateOfBirth: '',
            gender: '',
            bloodGroup: '',
            phoneNumber: '',
            medicalHistory: ''
        }
    });

    const genderValue = watch('gender');
    const bloodGroupValue = watch('bloodGroup');

    const onSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            const cleanedData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
            );
            await api.post('/users/complete-patient-profile', cleanedData);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.hasPatientProfile = true;
            localStorage.setItem('user', JSON.stringify(user));
            toast.success('Profile created successfully!');
            onComplete();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit form. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const onError = (errors: any) => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
            toast.error(errors[firstErrorKey].message);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-[#173D39]/5 border border-[#DDE6E2] max-w-2xl mx-auto mt-6 relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-full h-2.5 bg-[#173D39]" />

            <div className="mb-6 text-center">
                <div className="w-14 h-14 bg-[#173D39] text-[#BDE8DA] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#245B54] shadow-sm">
                    <Heart size={26} className="fill-current" />
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#192B29] tracking-tight mb-2">Your Health Profile</h3>
                <p className="text-[#687773] font-normal text-sm max-w-md mx-auto leading-relaxed">
                    To provide you with safe outpatient care, please declare essential clinical details for your patient record.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#192B29] ml-1">Birth Date</label>
                        <div className="relative">
                            <DatePicker
                                selected={birthDate}
                                onChange={(date: any) => {
                                    setBirthDate(date);
                                    setValue('dateOfBirth', date ? date.toISOString().split('T')[0] : '');
                                }}
                                dateFormat="dd MMM yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                maxDate={new Date()}
                                placeholderText="Select birth date"
                                className="w-full px-4 py-2.5 pl-10 bg-white border border-[#DDE6E2] hover:border-[#245B54] focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/15 rounded-xl outline-none text-[#192B29] text-sm font-medium transition-all shadow-xs cursor-pointer min-h-[44px]"
                                wrapperClassName="w-full"
                                popperClassName="sky-datepicker-popper"
                                calendarClassName="sky-datepicker"
                            />
                            <CalendarDays size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#245B54] pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#192B29] ml-1">Phone Number</label>
                        <input {...register('phoneNumber')} placeholder="e.g. (555) 018-4200" className="w-full px-4 py-2.5 bg-white border border-[#DDE6E2] hover:border-[#245B54] focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/15 rounded-xl outline-none text-[#192B29] text-sm font-medium transition-all shadow-xs min-h-[44px]" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#192B29] ml-1">Gender</label>
                        <CustomSelect
                            value={genderValue}
                            onChange={(val) => setValue('gender', val)}
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other / Non-binary' }
                            ]}
                            placeholder="Select gender..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#192B29] ml-1">Blood Group</label>
                        <CustomSelect
                            value={bloodGroupValue}
                            onChange={(val) => setValue('bloodGroup', val)}
                            options={[
                                { value: 'A+', label: 'A Positive (A+)' },
                                { value: 'A-', label: 'A Negative (A-)' },
                                { value: 'B+', label: 'B Positive (B+)' },
                                { value: 'B-', label: 'B Negative (B-)' },
                                { value: 'O+', label: 'O Positive (O+)' },
                                { value: 'O-', label: 'O Negative (O-)' },
                                { value: 'AB+', label: 'AB Positive (AB+)' },
                                { value: 'AB-', label: 'AB Negative (AB-)' }
                            ]}
                            placeholder="Select blood group..."
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1.5 mt-1">
                        <label className="text-xs font-bold text-[#192B29] ml-1">Medical History & Allergies</label>
                        <textarea {...register('medicalHistory')} rows={3} className="w-full px-4 py-3 bg-white border border-[#DDE6E2] hover:border-[#245B54] focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/15 rounded-xl outline-none text-[#192B29] text-sm font-medium transition-all shadow-xs resize-y leading-relaxed" placeholder="Please declare any known conditions, allergies, or past surgeries to help doctors assist you better..."></textarea>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={submitting} className="w-full px-6 py-3.5 bg-[#173D39] hover:bg-[#245B54] text-white font-bold text-sm rounded-xl flex justify-center items-center shadow-md transition-all active:scale-[0.98]">
                        {submitting ? <Loader2 className="animate-spin mr-2 text-white" size={20} /> : 'Save Health Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};
