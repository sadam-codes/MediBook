import React, { useState, useEffect, useRef, type JSX } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
    Mail, Lock, Loader2, X, User, Eye, EyeOff, Activity,
    FileText, Clock, Coins, Phone, Calendar, Stethoscope,
    MapPin, Building, Globe, CheckCircle2, UserCircle, Image as ImageIcon,
    ClipboardList, Timer, ShieldCheck, Camera
} from 'lucide-react';
import { CustomSelect } from './ui/CustomSelect';
import { specializations } from '../data/specializations';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000' });

// --- Professional Custom Components ---


interface ProfileImageUploadProps {
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

function ProfileImageUpload({ onChange, error }: ProfileImageUploadProps): JSX.Element {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 ml-1">Profile Photo</label>
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer w-full p-4 bg-slate-50 border-2 border-dashed ${error ? 'border-red-300' : 'border-slate-200 hover:border-slate-400'} rounded-xl transition-all flex flex-col items-center justify-center gap-2 min-h-[120px]`}
            >
                {preview ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={20} className="text-white" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-slate-600 shadow-sm border border-slate-200 transition-colors">
                            <ImageIcon size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Storage Drive</p>
                            <p className="text-[10px] text-slate-400 font-medium">Click to select photo</p>
                        </div>
                    </>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>
            {error && <p className="text-[10px] text-red-500 mt-1 font-bold ml-1">{error}</p>}
        </div>
    );
};

// --- Validation Schemas ---
const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchemaBase = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['patient', 'doctor']),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    gender: z.string().min(1, 'Gender is required'),
    profileImage: z.any().optional(),
    city: z.string().min(1, 'Required'),
    country: z.string().min(1, 'Required'),

    // Doctor fields (optional base, refined later)
    licenseNumber: z.string().optional(),
    specialization: z.string().optional(),
    experience: z.any().optional(),
    qualification: z.string().optional(),
    clinicName: z.string().optional(),
    clinicAddress: z.string().optional(),
    consultationFee: z.any().optional(),
    availableDays: z.array(z.string()).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    breakTime: z.string().optional(),
    appointmentDuration: z.any().optional(),

    // Patient fields (optional base, refined later)
    dateOfBirth: z.string().optional(),
    bloodGroup: z.string().optional(),
    allergies: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    address: z.string().optional(),
});

const signupSchema = signupSchemaBase.superRefine((data, ctx) => {
    if (data.role === 'doctor') {
        if (!data.licenseNumber) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['licenseNumber'] });
        if (!data.specialization) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['specialization'] });
        if (data.experience === undefined || data.experience === '') ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['experience'] });
        if (!data.qualification) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['qualification'] });
        if (!data.clinicName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['clinicName'] });
        if (!data.clinicAddress) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['clinicAddress'] });
        if (data.consultationFee === undefined || data.consultationFee === '') ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['consultationFee'] });
        if (!data.availableDays || data.availableDays.length === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select days', path: ['availableDays'] });
    } else {
        if (!data.dateOfBirth) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['dateOfBirth'] });
        if (!data.emergencyContactName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['emergencyContactName'] });
        if (!data.emergencyContactPhone) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['emergencyContactPhone'] });
    }
});

interface SignupFormData {
    fullName: string;
    email: string;
    password: string;
    role: 'patient' | 'doctor';
    phoneNumber: string;
    gender: string;
    profileImage?: any;
    licenseNumber?: string;
    specialization?: string;
    experience?: number;
    qualification?: string;
    clinicName?: string;
    clinicAddress?: string;
    city: string;
    country: string;
    consultationFee?: number;
    availableDays?: string[];
    startTime?: string;
    endTime?: string;
    breakTime?: string;
    appointmentDuration?: number;
    dateOfBirth?: string;
    bloodGroup?: string;
    allergies?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
    initialRole?: 'patient' | 'doctor';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login', initialRole = 'patient' }) => {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [signupStep, setSignupStep] = useState<number>(1);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch, trigger, control } = useForm<SignupFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(mode === 'login' ? loginSchema : signupSchema) as any,
        defaultValues: { role: 'patient', availableDays: [] }
    });

    const selectedRole = watch('role');
    const selectedDays = watch('availableDays') || [];

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setSignupStep(1);
            setValue('role', initialRole || 'patient');
            reset({ role: initialRole || 'patient' }, { keepDefaultValues: true });
        }
    }, [isOpen, initialMode, initialRole, reset, setValue]);

    const handleNextStep = async () => {
        let fieldsToValidate: any[] = [];
        if (signupStep === 1) fieldsToValidate = ['fullName', 'email', 'password', 'phoneNumber', 'gender', 'role'];
        else if (signupStep === 2) fieldsToValidate = selectedRole === 'doctor' ? ['licenseNumber', 'specialization', 'experience', 'qualification'] : ['dateOfBirth', 'bloodGroup'];
        else if (signupStep === 3) fieldsToValidate = selectedRole === 'doctor' ? ['clinicName', 'clinicAddress', 'city', 'country', 'consultationFee'] : ['address', 'city', 'country', 'allergies'];

        const isValid = await trigger(fieldsToValidate as any);
        if (isValid) setSignupStep(signupStep + 1);
    };

    const onSubmit = async (data: SignupFormData) => {
        try {
            const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';

            let payload: any = data;
            if (mode === 'signup') {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (key === 'availableDays' && Array.isArray(value)) {
                        value.forEach(day => formData.append('availableDays[]', day));
                    } else if (value !== undefined && value !== null) {
                        formData.append(key, value as any);
                    }
                });
                payload = formData;
            }
            const response = await api.post(endpoint, payload);

            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success(mode === 'login' ? 'Access Granted' : 'Profile Activated');
            onClose();
            window.location.reload();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || 'Action failed');
            } else {
                toast.error('Unexpected error');
            }
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setSignupStep(1);
        setShowPassword(false);
        reset();
    };

    const toggleDay = (day: string) => {
        const currentDays = watch('availableDays') || [];
        if (currentDays.includes(day)) {
            setValue('availableDays', currentDays.filter(d => d !== day));
        } else {
            setValue('availableDays', [...currentDays, day]);
        }
    };

    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
    ];

    const bloodOptions = [
        { label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' }
    ];

    const durationOptions = [
        { label: '15 Min Session', value: 15 },
        { label: '30 Min Session', value: 30 },
        { label: '60 Min Session', value: 60 }
    ];

    const specializationOptions = specializations.map(s => ({ label: s, value: s }));

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className={`relative w-full ${mode === 'signup' ? 'max-w-4xl' : 'max-w-md'} bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300`}
                    >
                        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors z-20"><X size={20} /></button>

                        <div className="p-8 sm:p-12 overflow-y-auto custom-scrollbar flex-1">
                            <div className="mb-10 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 rounded-lg text-white mb-6">
                                    {mode === 'signup' ? (selectedRole === 'doctor' ? <Stethoscope size={24} /> : <UserCircle size={24} />) : <ShieldCheck size={24} />}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    {mode === 'login' ? 'Portal Authentication' : (signupStep === 1 ? 'Network Registration' : signupStep === 2 ? 'Professional Credentials' : signupStep === 3 ? 'Operational Logistics' : 'Final Activation')}
                                </h2>
                                <p className="text-slate-500 text-sm mt-2 font-medium">{mode === 'login' ? 'Secure access to your professional dashboard' : 'Integrating your practice into MediBook'}</p>
                                {mode === 'signup' && (
                                    <div className="flex items-center justify-center gap-2 mt-8">
                                        {[1, 2, 3, 4].map(step => (
                                            <div key={step} className={`h-1.5 rounded-full transition-all duration-300 ${signupStep >= step ? 'w-10 bg-slate-900' : 'w-4 bg-slate-100'}`} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                {mode === 'login' && (
                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600 ml-1">Account Email</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input {...register('email')} className={`w-full pl-11 pr-4 py-3 bg-white border ${errors.email ? 'border-red-400' : 'border-slate-300 focus:border-slate-900'} rounded-lg outline-none font-medium text-sm text-slate-800 transition-all`} placeholder="name@organization.com" />
                                            </div>
                                            {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600 ml-1">Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input type={showPassword ? 'text' : 'password'} {...register('password')} className={`w-full pl-11 pr-12 py-3 bg-white border ${errors.password ? 'border-red-400' : 'border-slate-300 focus:border-slate-900'} rounded-lg outline-none font-medium text-sm text-slate-800 transition-all`} placeholder="••••••••" />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                            </div>
                                            {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
                                        </div>
                                        <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg transition-all shadow-sm active:scale-[0.99] flex items-center justify-center text-sm">{isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Authenticate'}</button>
                                    </div>
                                )}

                                {mode === 'signup' && signupStep === 1 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-600 ml-1">Register as</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['patient', 'doctor'].map(role => (
                                                    <button key={role} type="button" onClick={() => setValue('role', role as any)} className={`py-4 rounded-lg font-bold text-sm transition-all border ${selectedRole === role ? 'bg-slate-900 text-white' : 'bg-white text-slate-500'}`}>
                                                        {role === 'patient' ? 'Patient' : 'Doctor'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 md:col-span-1">
                                            <label className="text-xs font-semibold text-slate-600 ml-1">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input {...register('fullName')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm text-slate-800 shadow-sm transition-all" placeholder="Legal Name" />
                                            </div>
                                            {errors.fullName && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.fullName.message}</p>}
                                        </div>
                                        <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Email</label><div className="relative group"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('email')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm text-slate-800 shadow-sm transition-all" placeholder="email@address.com" /></div></div>
                                        <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Phone</label><div className="relative group"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('phoneNumber')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm text-slate-800 shadow-sm transition-all" placeholder="+92..." /></div></div>

                                        <Controller
                                            name="gender"
                                            control={control}
                                            render={({ field }) => (
                                                <CustomSelect
                                                    label="Gender Identity"
                                                    options={genderOptions}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select Gender"
                                                    icon={User}
                                                    error={errors.gender?.message as string}
                                                />
                                            )}
                                        />

                                        <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Password</label><div className="relative group"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="password" {...register('password')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm text-slate-800 shadow-sm transition-all" placeholder="Min 6 chars" /></div></div>

                                        <div className="md:col-span-1">
                                            <Controller
                                                name="profileImage"
                                                control={control}
                                                render={({ field }) => (
                                                    <ProfileImageUpload
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        error={errors.profileImage?.message as string}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div className="md:col-span-2 pt-4">
                                            <button type="button" onClick={handleNextStep} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-lg transition-all shadow-md text-sm">Next</button>
                                        </div>
                                    </div>
                                )}

                                {mode === 'signup' && signupStep === 2 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                                        {selectedRole === 'doctor' ? (
                                            <>
                                                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Board License ID</label><div className="relative group"><FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('licenseNumber')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all shadow-sm" placeholder="ID Number" /></div></div>
                                                <Controller
                                                    name="specialization"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <CustomSelect
                                                            label="Clinical Specialization"
                                                            options={specializationOptions}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Select Specialty"
                                                            icon={Activity}
                                                            error={errors.specialization?.message as string}
                                                        />
                                                    )}
                                                />
                                                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Years Practice</label><div className="relative group"><Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="number" {...register('experience')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all shadow-sm" placeholder="Total Years" /></div></div>
                                                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Primary Degree</label><div className="relative group"><ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('qualification')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all shadow-sm" placeholder="MBBS / MD" /></div></div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Birth Date</label><div className="relative group"><Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="date" {...register('dateOfBirth')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all shadow-sm" /></div></div>
                                                <Controller name="bloodGroup" control={control} render={({ field }) => (
                                                    <CustomSelect label="Medical Blood Type" options={bloodOptions} value={field.value} onChange={field.onChange} placeholder="Select Type" icon={Activity} error={errors.bloodGroup?.message as string} />
                                                )} />
                                            </>
                                        )}
                                        <div className="md:col-span-2 flex gap-4 pt-4"><button type="button" onClick={() => setSignupStep(1)} className="flex-1 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg text-sm">Previous</button><button type="button" onClick={handleNextStep} className="flex-[2] bg-slate-900 text-white font-bold py-3.5 rounded-lg text-sm">Next</button></div>
                                    </div>
                                )}

                                {mode === 'signup' && signupStep === 3 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                                        {selectedRole === 'doctor' ? (
                                            <>
                                                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Health Facility Name</label><div className="relative group"><Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('clinicName')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all shadow-sm" placeholder="Clinic / Hospital" /></div></div>
                                                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Clinical Fee (PKR)</label><div className="relative group"><Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="number" {...register('consultationFee')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all shadow-sm" placeholder="Rate" /></div></div>
                                                <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-semibold text-slate-600 ml-1">Operational Address</label><div className="relative group"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('clinicAddress')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all shadow-sm" placeholder="Street Location" /></div></div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-semibold text-slate-600 ml-1">Residential Residence</label><div className="relative group"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('address')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all shadow-sm" placeholder="Home Address" /></div></div>
                                                <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-semibold text-slate-600 ml-1">Recorded Allergies</label><div className="relative group"><Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('allergies')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all shadow-sm" placeholder="Conditions" /></div></div>
                                            </>
                                        )}
                                        <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Operational City</label><div className="relative group"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('city')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all shadow-sm" placeholder="City" /></div></div>
                                        <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Country Zone</label><div className="relative group"><Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('country')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all shadow-sm" placeholder="Country" /></div></div>
                                        <div className="md:col-span-2 flex gap-4 pt-4"><button type="button" onClick={() => setSignupStep(2)} className="flex-1 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg text-sm">Previous</button><button type="button" onClick={handleNextStep} className="flex-[2] bg-slate-900 text-white font-bold py-3.5 rounded-lg text-sm">Next</button></div>
                                    </div>
                                )}

                                {mode === 'signup' && signupStep === 4 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                                        {selectedRole === 'doctor' ? (
                                            <>
                                                <div className="space-y-3 md:col-span-2"><label className="text-xs font-semibold text-slate-600 ml-1">Weekly Commitment</label><div className="flex flex-wrap gap-2">{days.map(day => (<button key={day} type="button" onClick={() => toggleDay(day)} className={`px-5 py-2 rounded-lg font-bold text-xs transition-all border ${selectedDays.includes(day) ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-900'}`}>{day}</button>))}</div></div>
                                                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Shift Commencement</label><div className="relative group"><Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="time" {...register('startTime')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all" /></div></div>
                                                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Shift Conclusion</label><div className="relative group"><Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="time" {...register('endTime')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm transition-all" /></div></div>
                                                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 ml-1">Recess Interval</label><div className="relative group"><Timer className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('breakTime')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm text-slate-800 shadow-sm transition-all" placeholder="Break Duration" /></div></div>
                                                <Controller name="appointmentDuration" control={control} render={({ field }) => (
                                                    <CustomSelect label="Consultation Slot" options={durationOptions} value={field.value} onChange={field.onChange} placeholder="Select Duration" icon={Clock} error={errors.appointmentDuration?.message as string} />
                                                )} />
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-semibold text-slate-600 ml-1">Crisis Point of Contact</label><div className="relative group"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('emergencyContactName')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm shadow-sm transition-all" placeholder="Contact Name" /></div></div>
                                                <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-semibold text-slate-600 ml-1">Crisis Contact Number</label><div className="relative group"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input {...register('emergencyContactPhone')} className="w-full pl-11 pr-4 py-3 border border-slate-300 focus:border-slate-900 rounded-lg outline-none font-medium text-sm shadow-sm transition-all" placeholder="Emergency Phone" /></div></div>
                                            </>
                                        )}
                                        <div className="md:col-span-2 flex gap-4 pt-4"><button type="button" onClick={() => setSignupStep(3)} className="flex-1 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg text-sm">Previous</button><button type="submit" disabled={isSubmitting} className="flex-[2] bg-slate-900 text-white font-bold py-3.5 rounded-lg shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 text-sm">{isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={18} /> Activate Profile</>}</button></div>
                                    </div>
                                )}
                            </form>

                            {(mode === 'login' || (mode === 'signup' && signupStep === 1)) && (
                                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col items-center"><p className="text-xs font-semibold text-slate-500">{mode === 'login' ? "Unauthorized?" : "Registered?"} <button onClick={toggleMode} className="text-slate-900 hover:underline font-bold ml-1 transition-all">{mode === 'login' ? "Register Registry" : "Sign In"}</button></p></div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
