import React, { useState } from 'react';
import { Loader2, ShieldCheck, Calendar, Building2, Filter } from 'lucide-react';
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
        { label: 'All Specialties', value: 'All' },
        ...specializations.map(s => ({ label: s, value: s }))
    ];

    return (
        <div className="flex-1 text-left">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-semibold mb-2">
                        <ShieldCheck size={13} className="text-[#245B54]" />
                        <span>Vetted Clinical Faculty</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#192B29]">Book an Outpatient Specialist</h2>
                    <p className="text-[#687773] text-xs mt-0.5">Select a specialist by medical discipline and view verified clinic availability</p>
                </div>

                <div className="w-full md:w-72">
                    <CustomSelect
                        label="Specialty Filter"
                        options={specialtyOptions}
                        value={selectedSpecialty}
                        onChange={(val) => setSelectedSpecialty(val as string)}
                        placeholder="All Specialties"
                        icon={Filter}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-[#173D39]" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doc, i) => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#DDE6E2] hover:border-[#173D39] hover:shadow-md transition-all flex flex-col justify-between">
                                <div>
                                    <div className="relative h-56 overflow-hidden bg-[#F3F7F5] border-b border-[#DDE6E2]">
                                        <img
                                            src={doc.user?.profileImage ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${doc.user.profileImage}` : "/default-doc.png"}
                                            alt={doc.user?.fullName}
                                            className="w-full h-full object-cover object-top"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#173D39] border border-[#DDE6E2] shadow-sm">
                                                <ShieldCheck size={11} className="text-[#237A57]" />
                                                Active Privileges
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 right-3">
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#173D39] text-white">
                                                ${doc.consultationFee || 120} Consult
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-base font-bold text-[#192B29] leading-snug">
                                            Dr. {doc.user?.fullName}
                                        </h3>
                                        <p className="text-xs font-semibold text-[#245B54] mt-0.5">
                                            {doc.specialization} Specialist
                                        </p>

                                        <div className="mt-3 pt-3 border-t border-[#F3F7F5] space-y-1.5 text-xs text-[#687773]">
                                            <div className="flex items-center gap-2">
                                                <Building2 size={13} className="text-[#245B54] shrink-0" />
                                                <span className="truncate">{doc.clinicName || 'St. Jude Outpatient Pavilion'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={13} className="text-[#245B54] shrink-0" />
                                                <span>{doc.experience ? `${doc.experience} Years Exp.` : 'Senior Faculty'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 pt-0">
                                    <button
                                        type="button"
                                        onClick={() => onViewProfile(doc)}
                                        className="w-full py-2.5 px-3 bg-[#173D39] hover:bg-[#245B54] text-white font-semibold rounded-lg text-xs transition-colors shadow-sm text-center"
                                    >
                                        View Profile & Schedule
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-[#F3F7F5] rounded-xl border border-dashed border-[#DDE6E2]">
                            <h3 className="text-base font-bold text-[#192B29] mb-1">No specialists found in this department</h3>
                            <p className="text-xs text-[#687773]">Try selecting "All Specialties" to view all available physicians.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
