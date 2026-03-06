import React, { useState } from 'react';
import { Loader2, Award, Star, ShieldCheck, Filter } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';
import { specializations } from '../../data/specializations';

interface PatientDashboardProps {
    doctors: any[];
    loading: boolean;
    onViewProfile: (doc: any) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ doctors, loading, onViewProfile }) => {
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

    const filteredDoctors = doctors.filter(doc =>
        selectedSpecialty === 'All' || doc.specialization === selectedSpecialty
    );

    const specialtyOptions = [
        { label: 'All Specialists', value: 'All' },
        ...specializations.map(s => ({ label: s, value: s }))
    ];

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="text-left">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">Expert Specialists</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs opacity-60">Available for booking today</p>
                </div>

                <div className="w-full md:w-80">
                    <CustomSelect
                        label="Find Specialist"
                        options={specialtyOptions}
                        value={selectedSpecialty}
                        onChange={(val) => setSelectedSpecialty(val as string)}
                        placeholder="Select Specialty"
                        icon={Filter}
                    />
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-sky-600" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doc, i) => (
                            <div key={i} className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm">
                                <div className="relative h-64 overflow-hidden shrink-0">
                                    <div className="absolute inset-0 bg-sky-950/20 z-10"></div>
                                    <img
                                        src={doc.user?.profileImage ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${doc.user.profileImage}` : "/default-doc.png"}
                                        alt={doc.user?.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-6 left-6 z-20">
                                        <div className="bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20 shadow-2xl">
                                            <div className="flex items-center space-x-2">
                                                <Award size={14} className="text-sky-600" />
                                                <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">{doc.experience} Years Exp.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 text-left">
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">Dr. {doc.user?.fullName}</h3>
                                            <div className="flex items-center space-x-1 text-yellow-500">
                                                <Star size={16} className="fill-current" />
                                                <span className="text-xs font-black text-gray-900 ml-1">4.9</span>
                                            </div>
                                        </div>
                                        <p className="text-sky-500 font-bold text-sm tracking-[0.1em] uppercase opacity-80">{doc.specialization}</p>
                                    </div>

                                    <div className="flex items-center space-x-3 mb-10">
                                        <div className="flex -space-x-2.5">
                                            {[...Array(5)].map((_, idx) => (
                                                <div key={idx} className="w-6 h-6 rounded-full bg-sky-50 border-2 border-white flex items-center justify-center">
                                                    <ShieldCheck size={12} className="text-sky-500" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Verified Professional</span>
                                    </div>

                                    <button
                                        onClick={() => onViewProfile(doc)}
                                        className="w-full py-5 bg-sky-600 text-white font-black rounded-[20px] transition-all duration-500 shadow-2xl shadow-slate-900/10 hover:shadow-sky-600/30 text-[10px] uppercase tracking-[0.2em] active:scale-95 border border-white/5"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">No doctors available now</h3>
                            <p className="text-gray-400 font-bold">Please check back later for new specialist</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
