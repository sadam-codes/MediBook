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
    ClipboardList, Timer, ShieldCheck, Camera, ArrowRight, ArrowLeft
} from 'lucide-react';
import { CustomSelect } from './ui/CustomSelect';
import { Logo } from './ui/Logo';
import { specializations } from '../data/specializations';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000' });

// --- Profile Image Upload Component ---
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
            <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Profile Photo</label>
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer w-full p-4 bg-[#F3F7F5] border-2 border-dashed ${error ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#173D39]'} rounded-xl transition-all flex flex-col items-center justify-center gap-2 min-h-[120px]`}
            >
                {preview ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#DDE6E2] shadow-sm">
                        <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-[#173D39]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Camera size={20} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-[#E8F0ED] rounded-xl flex items-center justify-center text-[#173D39] group-hover:bg-[#173D39] group-hover:text-[#BDE8DA] shadow-sm border border-[#DDE6E2] transition-all">
                            <ImageIcon size={22} />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-[#192B29]">Upload Clinical Photo</p>
                            <p className="text-[11px] text-[#687773] font-medium">PNG, JPG up to 5MB</p>
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
            {error && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{error}</p>}
        </div>
    );
}

// --- Validation Schemas ---
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchemaBase = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['patient', 'doctor']),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    gender: z.string().min(1, 'Gender is required'),
    profileImage: z.any().optional(),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),

    // Doctor fields
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

    // Patient fields
    dateOfBirth: z.string().optional(),
    bloodGroup: z.string().optional(),
    allergies: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    address: z.string().optional(),
});

const signupSchema = signupSchemaBase.superRefine((data, ctx) => {
    if (data.role === 'doctor') {
        if (!data.licenseNumber) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'License number is required', path: ['licenseNumber'] });
        if (!data.specialization) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Specialization is required', path: ['specialization'] });
        if (data.experience === undefined || data.experience === '') ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Experience is required', path: ['experience'] });
        if (!data.qualification) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Primary qualification is required', path: ['qualification'] });
        if (!data.clinicName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Clinic or hospital name is required', path: ['clinicName'] });
        if (!data.clinicAddress) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Clinic address is required', path: ['clinicAddress'] });
        if (data.consultationFee === undefined || data.consultationFee === '') ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Consultation fee is required', path: ['consultationFee'] });
        if (!data.availableDays || data.availableDays.length === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select at least one available day', path: ['availableDays'] });
    } else {
        if (!data.dateOfBirth) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Date of birth is required', path: ['dateOfBirth'] });
        if (!data.emergencyContactName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Emergency contact name is required', path: ['emergencyContactName'] });
        if (!data.emergencyContactPhone) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Emergency contact phone is required', path: ['emergencyContactPhone'] });
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
            toast.success(mode === 'login' ? 'Welcome back to MediBook!' : 'Profile successfully registered!');
            onClose();
            window.location.reload();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || 'Authentication failed. Please verify your details.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
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
        { label: 'A+ (Positive)', value: 'A+' }, { label: 'A- (Negative)', value: 'A-' },
        { label: 'B+ (Positive)', value: 'B+' }, { label: 'B- (Negative)', value: 'B-' },
        { label: 'AB+ (Positive)', value: 'AB+' }, { label: 'AB- (Negative)', value: 'AB-' },
        { label: 'O+ (Positive)', value: 'O+' }, { label: 'O- (Negative)', value: 'O-' }
    ];

    const durationOptions = [
        { label: '15 Minutes Consultation', value: 15 },
        { label: '30 Minutes Standard Slot', value: 30 },
        { label: '45 Minutes In-depth Session', value: 45 },
        { label: '60 Minutes Comprehensive', value: 60 }
    ];

    const specializationOptions = specializations.map(s => ({ label: s, value: s }));
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#173D39]/50 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        transition={{ duration: 0.2 }}
                        className={`relative w-full ${mode === 'signup' ? 'max-w-3xl' : 'max-w-md'} bg-white rounded-2xl shadow-2xl border border-[#DDE6E2] overflow-hidden flex flex-col max-h-[90vh] my-auto z-10 transition-all duration-300`}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 p-2 text-[#687773] hover:text-[#192B29] hover:bg-[#F3F7F5] rounded-xl transition-colors z-20"
                            aria-label="Close dialog"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6 sm:p-10 overflow-y-auto no-scrollbar flex-1">
                            {/* Modal Header */}
                            <div className="mb-8 text-center">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-bold uppercase tracking-wider mb-4">
                                    <ShieldCheck size={14} className="text-[#173D39]" />
                                    <span>{mode === 'login' ? 'Verified Member Access' : 'MediBook Registration'}</span>
                                </div>

                                <Logo size="xl" className="mx-auto shadow-md shadow-[#173D39]/10 mb-3" />

                                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#192B29] tracking-tight">
                                    {mode === 'login'
                                        ? 'Welcome to MediBook'
                                        : signupStep === 1
                                            ? 'Create Your Account'
                                            : signupStep === 2
                                                ? (selectedRole === 'doctor' ? 'Professional Credentials' : 'Personal Medical Profile')
                                                : signupStep === 3
                                                    ? (selectedRole === 'doctor' ? 'Practice & Clinical Facility' : 'Address & Emergency Care')
                                                    : 'Schedule & Availability'
                                    }
                                </h2>
                                <p className="text-[#687773] text-sm mt-1.5 font-medium max-w-sm mx-auto">
                                    {mode === 'login'
                                        ? 'Sign in to manage appointments, clinical consultations, and health records.'
                                        : 'Connect with verified healthcare specialists and streamline your appointments.'}
                                </p>

                                {/* Step Indicator */}
                                {mode === 'signup' && (
                                    <div className="flex items-center justify-center gap-2 mt-6">
                                        {[1, 2, 3, 4].map(step => (
                                            <div
                                                key={step}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                                    signupStep === step
                                                        ? 'w-8 bg-[#173D39]'
                                                        : signupStep > step
                                                            ? 'w-6 bg-[#245B54]'
                                                            : 'w-3 bg-[#DDE6E2]'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Form Body */}
                            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                {/* LOGIN MODE */}
                                {mode === 'login' && (
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Account Email</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                <input
                                                    {...register('email')}
                                                    className={`w-full pl-11 pr-4 py-3.5 bg-white border ${
                                                        errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                    } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                    placeholder="name@example.com"
                                                />
                                            </div>
                                            {errors.email && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.email.message}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    {...register('password')}
                                                    className={`w-full pl-11 pr-12 py-3.5 bg-white border ${
                                                        errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                    } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#687773] hover:text-[#173D39] transition-colors bg-transparent border-none p-0 flex items-center justify-center focus:outline-none"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.password.message}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-[#173D39] hover:bg-[#245B54] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center text-sm gap-2 mt-2"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin text-white" size={20} /> : 'Sign In to Account'}
                                        </button>
                                    </div>
                                )}

                                {/* SIGNUP STEP 1: Basic Account Info */}
                                {mode === 'signup' && signupStep === 1 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Account Role</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setValue('role', 'patient')}
                                                    className={`p-3.5 rounded-xl font-bold text-sm transition-all border flex items-center gap-3 text-left ${
                                                        selectedRole === 'patient'
                                                            ? 'bg-[#173D39] text-white border-[#173D39] shadow-md shadow-[#173D39]/15'
                                                            : 'bg-white text-[#192B29] border-[#DDE6E2] hover:border-[#173D39]/40 hover:bg-[#F3F7F5]'
                                                    }`}
                                                >
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                                        selectedRole === 'patient' ? 'bg-white/15 text-[#BDE8DA]' : 'bg-[#E8F0ED] text-[#173D39]'
                                                    }`}>
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold">Patient</div>
                                                        <div className={`text-[11px] ${selectedRole === 'patient' ? 'text-white/80' : 'text-[#687773]'}`}>Book & consult</div>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setValue('role', 'doctor')}
                                                    className={`p-3.5 rounded-xl font-bold text-sm transition-all border flex items-center gap-3 text-left ${
                                                        selectedRole === 'doctor'
                                                            ? 'bg-[#173D39] text-white border-[#173D39] shadow-md shadow-[#173D39]/15'
                                                            : 'bg-white text-[#192B29] border-[#DDE6E2] hover:border-[#173D39]/40 hover:bg-[#F3F7F5]'
                                                    }`}
                                                >
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                                        selectedRole === 'doctor' ? 'bg-white/15 text-[#BDE8DA]' : 'bg-[#E8F0ED] text-[#173D39]'
                                                    }`}>
                                                        <Stethoscope size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold">Medical Doctor</div>
                                                        <div className={`text-[11px] ${selectedRole === 'doctor' ? 'text-white/80' : 'text-[#687773]'}`}>Practice & schedule</div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 md:col-span-1">
                                            <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Full Legal Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                <input
                                                    {...register('fullName')}
                                                    className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                        errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                    } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                    placeholder="Dr. Jane Doe / John Smith"
                                                />
                                            </div>
                                            {errors.fullName && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.fullName.message}</p>}
                                        </div>

                                        <div className="space-y-1.5 md:col-span-1">
                                            <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Email Address</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                <input
                                                    {...register('email')}
                                                    className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                        errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                    } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                    placeholder="email@example.com"
                                                />
                                            </div>
                                            {errors.email && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.email.message}</p>}
                                        </div>

                                        <div className="space-y-1.5 md:col-span-1">
                                            <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Phone Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                <input
                                                    {...register('phoneNumber')}
                                                    className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                        errors.phoneNumber ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                    } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                    placeholder="+92 300 1234567"
                                                />
                                            </div>
                                            {errors.phoneNumber && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.phoneNumber.message}</p>}
                                        </div>

                                        <div className="space-y-1.5 md:col-span-1">
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
                                        </div>

                                        <div className="space-y-1.5 md:col-span-1">
                                            <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                <input
                                                    type="password"
                                                    {...register('password')}
                                                    className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                        errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                    } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                    placeholder="Min 6 characters"
                                                />
                                            </div>
                                            {errors.password && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.password.message}</p>}
                                        </div>

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

                                        <div className="md:col-span-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={handleNextStep}
                                                className="w-full bg-[#173D39] hover:bg-[#245B54] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
                                            >
                                                Continue to Next Step <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* SIGNUP STEP 2: Professional Credentials or Personal Health */}
                                {mode === 'signup' && signupStep === 2 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                                        {selectedRole === 'doctor' ? (
                                            <>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Board License ID</label>
                                                    <div className="relative group">
                                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            {...register('licenseNumber')}
                                                            className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                                errors.licenseNumber ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                            } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                            placeholder="PMDC / State License"
                                                        />
                                                    </div>
                                                    {errors.licenseNumber && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.licenseNumber.message}</p>}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Controller
                                                        name="specialization"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <CustomSelect
                                                                label="Clinical Specialty"
                                                                options={specializationOptions}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                placeholder="Select Specialty"
                                                                icon={Activity}
                                                                error={errors.specialization?.message as string}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Years in Practice</label>
                                                    <div className="relative group">
                                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            type="number"
                                                            {...register('experience')}
                                                            className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                                errors.experience ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                            } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                            placeholder="e.g. 8"
                                                        />
                                                    </div>
                                                    {errors.experience && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.experience.message}</p>}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Highest Degree / Fellowship</label>
                                                    <div className="relative group">
                                                        <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            {...register('qualification')}
                                                            className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                                errors.qualification ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                            } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                            placeholder="MBBS, FCPS, MD"
                                                        />
                                                    </div>
                                                    {errors.qualification && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.qualification.message}</p>}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Date of Birth</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            type="date"
                                                            {...register('dateOfBirth')}
                                                            className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                                errors.dateOfBirth ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                            } rounded-xl outline-none font-medium text-sm text-[#192B29] transition-all`}
                                                        />
                                                    </div>
                                                    {errors.dateOfBirth && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.dateOfBirth.message}</p>}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Controller
                                                        name="bloodGroup"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <CustomSelect
                                                                label="Blood Group"
                                                                options={bloodOptions}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                placeholder="Select Blood Type"
                                                                icon={Activity}
                                                                error={errors.bloodGroup?.message as string}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className="md:col-span-2 flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setSignupStep(1)}
                                                className="flex-1 px-5 py-3.5 bg-white border border-[#DDE6E2] hover:bg-[#F3F7F5] text-[#192B29] font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                                            >
                                                <ArrowLeft size={16} /> Previous
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNextStep}
                                                className="flex-[2] bg-[#173D39] hover:bg-[#245B54] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
                                            >
                                                Next Step <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* SIGNUP STEP 3: Practice & Clinic Logistics or Patient Residence */}
                                {mode === 'signup' && signupStep === 3 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                                        {selectedRole === 'doctor' ? (
                                            <>
                                                <div className="space-y-1.5 md:col-span-1">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Hospital / Clinic Facility</label>
                                                    <div className="relative group">
                                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            {...register('clinicName')}
                                                            className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                                errors.clinicName ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                            } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                            placeholder="City Hospital / MediClinic"
                                                        />
                                                    </div>
                                                    {errors.clinicName && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.clinicName.message}</p>}
                                                </div>

                                                <div className="space-y-1.5 md:col-span-1">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Consultation Fee (PKR)</label>
                                                    <div className="relative group">
                                                        <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            type="number"
                                                            {...register('consultationFee')}
                                                            className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                                errors.consultationFee ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                            } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                            placeholder="e.g. 2500"
                                                        />
                                                    </div>
                                                    {errors.consultationFee && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.consultationFee.message}</p>}
                                                </div>

                                                <div className="space-y-1.5 md:col-span-2">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Clinic Address</label>
                                                    <div className="relative group">
                                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            {...register('clinicAddress')}
                                                            className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                                errors.clinicAddress ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                            } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                            placeholder="Floor 2, Medical Tower, Sector F-8"
                                                        />
                                                    </div>
                                                    {errors.clinicAddress && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.clinicAddress.message}</p>}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-1.5 md:col-span-2">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Residential Address</label>
                                                    <div className="relative group">
                                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            {...register('address')}
                                                            className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                                errors.address ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                            } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                            placeholder="Street, Area, Apartment"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5 md:col-span-2">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Known Allergies / Pre-existing Conditions</label>
                                                    <div className="relative group">
                                                        <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            {...register('allergies')}
                                                            className="w-full pl-11 pr-4 py-3 bg-white border border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10 rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all"
                                                            placeholder="e.g. Penicillin, Asthma, None"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="space-y-1.5 md:col-span-1">
                                            <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">City</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                <input
                                                    {...register('city')}
                                                    className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                        errors.city ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                    } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                    placeholder="Lahore / Islamabad"
                                                />
                                            </div>
                                            {errors.city && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.city.message}</p>}
                                        </div>

                                        <div className="space-y-1.5 md:col-span-1">
                                            <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Country</label>
                                            <div className="relative group">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                <input
                                                    {...register('country')}
                                                    className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                        errors.country ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                    } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                    placeholder="Pakistan"
                                                />
                                            </div>
                                            {errors.country && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.country.message}</p>}
                                        </div>

                                        <div className="md:col-span-2 flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setSignupStep(2)}
                                                className="flex-1 px-5 py-3.5 bg-white border border-[#DDE6E2] hover:bg-[#F3F7F5] text-[#192B29] font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                                            >
                                                <ArrowLeft size={16} /> Previous
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNextStep}
                                                className="flex-[2] bg-[#173D39] hover:bg-[#245B54] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
                                            >
                                                Next Step <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* SIGNUP STEP 4: Schedule Availability or Emergency Contacts */}
                                {mode === 'signup' && signupStep === 4 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                                        {selectedRole === 'doctor' ? (
                                            <>
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Available Practice Days</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {days.map(day => (
                                                            <button
                                                                key={day}
                                                                type="button"
                                                                onClick={() => toggleDay(day)}
                                                                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                                                                    selectedDays.includes(day)
                                                                        ? 'bg-[#173D39] text-white border-[#173D39] shadow-sm'
                                                                        : 'bg-white text-[#687773] border-[#DDE6E2] hover:border-[#173D39] hover:text-[#173D39]'
                                                                }`}
                                                            >
                                                                {day}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {errors.availableDays && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.availableDays.message}</p>}
                                                </div>

                                                <div className="space-y-1.5 md:col-span-1">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Shift Start Time</label>
                                                    <div className="relative group">
                                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            type="time"
                                                            {...register('startTime')}
                                                            className="w-full pl-11 pr-4 py-3 bg-white border border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10 rounded-xl outline-none font-medium text-sm text-[#192B29] transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5 md:col-span-1">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Shift End Time</label>
                                                    <div className="relative group">
                                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            type="time"
                                                            {...register('endTime')}
                                                            className="w-full pl-11 pr-4 py-3 bg-white border border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10 rounded-xl outline-none font-medium text-sm text-[#192B29] transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5 md:col-span-1">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Recess / Break Time</label>
                                                    <div className="relative group">
                                                        <Timer className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            {...register('breakTime')}
                                                            className="w-full pl-11 pr-4 py-3 bg-white border border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10 rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all"
                                                            placeholder="1:00 PM - 2:00 PM"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5 md:col-span-1">
                                                    <Controller
                                                        name="appointmentDuration"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <CustomSelect
                                                                label="Slot Duration"
                                                                options={durationOptions}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                placeholder="Select Duration"
                                                                icon={Clock}
                                                                error={errors.appointmentDuration?.message as string}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-1.5 md:col-span-2">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Emergency Contact Person</label>
                                                    <div className="relative group">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            {...register('emergencyContactName')}
                                                            className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                                errors.emergencyContactName ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                            } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                            placeholder="Family member / Guardian name"
                                                        />
                                                    </div>
                                                    {errors.emergencyContactName && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.emergencyContactName.message}</p>}
                                                </div>

                                                <div className="space-y-1.5 md:col-span-2">
                                                    <label className="text-xs font-bold text-[#192B29] uppercase tracking-wider ml-1">Emergency Contact Phone</label>
                                                    <div className="relative group">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687773] group-focus-within:text-[#173D39] transition-colors" size={18} />
                                                        <input
                                                            {...register('emergencyContactPhone')}
                                                            className={`w-full pl-11 pr-4 py-3 bg-white border ${
                                                                errors.emergencyContactPhone ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDE6E2] hover:border-[#245B54]/40 focus:border-[#173D39] focus:ring-2 focus:ring-[#173D39]/10'
                                                            } rounded-xl outline-none font-medium text-sm text-[#192B29] placeholder:text-[#687773]/60 transition-all`}
                                                            placeholder="+92 300 0000000"
                                                        />
                                                    </div>
                                                    {errors.emergencyContactPhone && <p className="text-xs text-[#B42318] font-semibold mt-1 ml-1">{errors.emergencyContactPhone.message}</p>}
                                                </div>
                                            </>
                                        )}

                                        <div className="md:col-span-2 flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setSignupStep(3)}
                                                className="flex-1 px-5 py-3.5 bg-white border border-[#DDE6E2] hover:bg-[#F3F7F5] text-[#192B29] font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                                            >
                                                <ArrowLeft size={16} /> Previous
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-[2] bg-[#173D39] hover:bg-[#245B54] text-white font-bold py-3.5 rounded-xl shadow-md active:scale-[0.99] flex items-center justify-center gap-2 text-sm transition-all"
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="animate-spin text-white" size={20} />
                                                ) : (
                                                    <>
                                                        <CheckCircle2 size={18} className="text-[#BDE8DA]" />
                                                        <span>Complete Registration</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>

                            {/* Mode Toggle Footer */}
                            {(mode === 'login' || (mode === 'signup' && signupStep === 1)) && (
                                <div className="mt-8 pt-6 border-t border-[#DDE6E2] text-center">
                                    <p className="text-xs font-semibold text-[#687773]">
                                        {mode === 'login' ? "Don't have an account yet?" : "Already registered with MediBook?"}{' '}
                                        <button
                                            type="button"
                                            onClick={toggleMode}
                                            className="text-[#173D39] hover:text-[#245B54] hover:underline font-bold transition-all bg-transparent border-none p-0 inline"
                                        >
                                            {mode === 'login' ? "Create account" : "Sign in"}
                                        </button>
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
