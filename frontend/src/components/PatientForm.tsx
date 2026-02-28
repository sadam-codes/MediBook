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

const api = axios.create({ baseURL: 'http://localhost:5000' });
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
        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 max-w-2xl mx-auto mt-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2.5 bg-emerald-600" />

            <div className="mb-6 text-center">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-[20px] flex items-center justify-center mx-auto mb-4 transform -rotate-3 shadow-md border border-emerald-100">
                    <Heart size={28} className="fill-current" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">Your Health Profile</h3>
                <p className="text-gray-500 font-medium text-sm max-w-md mx-auto leading-relaxed">
                    To provide you with the best experience, we need a few medical details to personalize your care.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 ml-1">Birth Date</label>
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
                                className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl outline-none text-gray-900 text-sm font-medium transition-all shadow-sm cursor-pointer"
                                wrapperClassName="w-full"
                                popperClassName="emerald-datepicker-popper"
                                calendarClassName="emerald-datepicker"
                            />
                            <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 ml-1">Phone Number</label>
                        <input {...register('phoneNumber')} placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl outline-none text-gray-900 text-sm font-medium transition-all shadow-sm" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 ml-1">Gender</label>
                        <CustomSelect
                            value={genderValue}
                            onChange={(val) => setValue('gender', val)}
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' }
                            ]}
                            placeholder="Select gender..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 ml-1">Blood Group</label>
                        <CustomSelect
                            value={bloodGroupValue}
                            onChange={(val) => setValue('bloodGroup', val)}
                            options={[
                                { value: 'A+', label: 'A+' },
                                { value: 'A-', label: 'A-' },
                                { value: 'B+', label: 'B+' },
                                { value: 'B-', label: 'B-' },
                                { value: 'O+', label: 'O+' },
                                { value: 'O-', label: 'O-' },
                                { value: 'AB+', label: 'AB+' },
                                { value: 'AB-', label: 'AB-' }
                            ]}
                            placeholder="Select blood group..."
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-1.5 mt-1">
                        <label className="text-xs font-bold text-gray-700 ml-1">Medical History & Allergies</label>
                        <textarea {...register('medicalHistory')} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl outline-none text-gray-900 text-sm font-medium transition-all shadow-sm resize-y leading-relaxed" placeholder="Please declare any known conditions, allergies, or past surgeries to help doctors assist you better..."></textarea>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={submitting} className="w-full px-6 py-4 bg-emerald-600 text-white font-black text-[15px] rounded-xl flex justify-center items-center shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all active:scale-[0.98]">
                        {submitting ? <Loader2 className="animate-spin mr-2 text-white" size={20} /> : 'Save Health Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};
