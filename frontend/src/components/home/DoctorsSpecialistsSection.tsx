import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Search, ShieldCheck, X } from 'lucide-react';
import { DEMO_DOCTORS, type DoctorProfile, CLINIC_LOCATIONS, HEALTHCARE_SPECIALTIES } from '../../data/healthcareData';
import { CustomSelect } from '../ui/CustomSelect';

interface DoctorsSpecialistsSectionProps {
    doctors?: any[];
    onViewProfile: (doc: any) => void;
    onBookDoctor: (doc: any) => void;
    activeSpecialtyFilter?: string;
    onClearSpecialtyFilter?: () => void;
}

export const DoctorsSpecialistsSection: React.FC<DoctorsSpecialistsSectionProps> = ({
    doctors = [],
    onViewProfile,
    onBookDoctor,
    activeSpecialtyFilter = 'All',
    onClearSpecialtyFilter
}) => {
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>(activeSpecialtyFilter);
    const [selectedClinic, setSelectedClinic] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const specialtyOptions = useMemo(() => [
        { label: `All Specialties (${HEALTHCARE_SPECIALTIES.length})`, value: 'All' },
        ...HEALTHCARE_SPECIALTIES.map((spec) => ({
            label: spec.name,
            value: spec.name,
            sublabel: spec.description
        }))
    ], []);

    const clinicOptions = useMemo(() => [
        { label: 'All Campuses', value: 'All' },
        ...CLINIC_LOCATIONS.map((loc) => ({
            label: loc.name,
            value: loc.name,
            sublabel: loc.campus
        }))
    ], []);

    // Keep state in sync with external filter changes (e.g. from Hero or Specialties section)
    React.useEffect(() => {
        if (activeSpecialtyFilter) {
            setSelectedSpecialty(activeSpecialtyFilter);
        }
    }, [activeSpecialtyFilter]);

    // Use passed doctors or default to centralized DEMO_DOCTORS
    const sourceDoctors: DoctorProfile[] = useMemo(() => {
        if (doctors && doctors.length > 0) {
            return doctors.map((d: any, idx: number) => {
                if (d.title && d.clinic) return d as DoctorProfile;
                // Normalize from backend or legacy shape
                const fallbackDemo = DEMO_DOCTORS[idx % DEMO_DOCTORS.length];
                return {
                    id: d.id || idx + 1,
                    userId: d.userId || d.user?.id,
                    name: d.name || `Dr. ${d.user?.fullName || 'Physician'}`,
                    title: d.title || fallbackDemo.title,
                    specialty: d.specialization || d.spec || fallbackDemo.specialty,
                    subspecialty: fallbackDemo.subspecialty,
                    qualifications: d.experience ? `${d.experience} Years Exp. • MD` : fallbackDemo.qualifications,
                    experienceYears: Number(d.experience) || fallbackDemo.experienceYears,
                    clinic: fallbackDemo.clinic,
                    consultationFee: Number(d.consultationFee) || fallbackDemo.consultationFee,
                    rating: Number(d.averageRating || d.rating) || fallbackDemo.rating,
                    reviewCount: Number(d.reviewCount || d.reviews) || fallbackDemo.reviewCount,
                    nextAvailable: fallbackDemo.nextAvailable,
                    image: d.img || fallbackDemo.image,
                    bio: d.bio || fallbackDemo.bio,
                    education: fallbackDemo.education,
                    certifications: fallbackDemo.certifications,
                    languages: fallbackDemo.languages,
                    isDemoRecord: true,
                    demoNotice: fallbackDemo.demoNotice,
                    availableSchedule: fallbackDemo.availableSchedule
                };
            });
        }
        return DEMO_DOCTORS;
    }, [doctors]);

    const filteredDoctors = useMemo(() => {
        return sourceDoctors.filter((doc) => {
            const matchesSpecialty =
                selectedSpecialty === 'All' ||
                doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

            const matchesClinic =
                selectedClinic === 'All' ||
                doc.clinic.name.toLowerCase() === selectedClinic.toLowerCase() ||
                doc.clinic.id === selectedClinic;

            const q = searchQuery.toLowerCase().trim();
            const matchesQuery =
                !q ||
                doc.name.toLowerCase().includes(q) ||
                doc.specialty.toLowerCase().includes(q) ||
                doc.subspecialty.toLowerCase().includes(q) ||
                doc.clinic.name.toLowerCase().includes(q);

            return matchesSpecialty && matchesClinic && matchesQuery;
        });
    }, [sourceDoctors, selectedSpecialty, selectedClinic, searchQuery]);

    const handleClearFilters = () => {
        setSelectedSpecialty('All');
        setSelectedClinic('All');
        setSearchQuery('');
        if (onClearSpecialtyFilter) onClearSpecialtyFilter();
    };

    return (
        <section id="doctors-list" className="py-16 sm:py-24 bg-[#F3F7F5] border-b border-[#DDE6E2]" aria-label="Available Doctors and Appointments">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 text-left">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-semibold mb-3">
                            <ShieldCheck size={13} className="text-[#245B54]" />
                            <span>Credentialed Faculty</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#192B29] tracking-tight">
                            Meet Our Clinical Specialists
                        </h2>
                        <p className="text-[#687773] text-sm sm:text-base mt-2 max-w-2xl font-normal">
                            All listed physicians hold active medical licensing and authenticated hospital privileges.
                            Filter by medical discipline, outpatient location, or physician name.
                        </p>
                    </div>

                    <div className="text-xs text-[#687773] bg-white px-4 py-2 rounded-lg border border-[#DDE6E2] self-start md:self-end">
                        Showing <strong className="text-[#192B29]">{filteredDoctors.length}</strong> available specialists
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDE6E2] shadow-sm mb-10 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        {/* Search Input */}
                        <div className="sm:col-span-5 relative">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#687773]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by physician name or clinical condition..."
                                className="w-full bg-[#F3F7F5] border border-[#DDE6E2] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#192B29] font-medium transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#687773] hover:text-[#192B29]"
                                    aria-label="Clear search"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Specialty Filter */}
                        <div className="sm:col-span-4">
                            <CustomSelect
                                options={specialtyOptions}
                                value={selectedSpecialty}
                                onChange={(val) => {
                                    setSelectedSpecialty(val as string);
                                    if (onClearSpecialtyFilter && val === 'All') onClearSpecialtyFilter();
                                }}
                                placeholder="Filter by Specialty"
                                variant="surface"
                            />
                        </div>

                        {/* Clinic Location Filter */}
                        <div className="sm:col-span-3">
                            <CustomSelect
                                options={clinicOptions}
                                value={selectedClinic}
                                onChange={(val) => setSelectedClinic(val as string)}
                                placeholder="All Campuses"
                                variant="surface"
                            />
                        </div>
                    </div>

                    {/* Active Filter Tags */}
                    {(selectedSpecialty !== 'All' || selectedClinic !== 'All' || searchQuery) && (
                        <div className="pt-3.5 mt-3.5 border-t border-[#DDE6E2] flex items-center justify-between flex-wrap gap-2 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[#687773] font-semibold">Active Filters:</span>
                                {selectedSpecialty !== 'All' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F0ED] text-[#173D39] font-medium border border-[#DDE6E2]">
                                        Specialty: {selectedSpecialty}
                                        <button onClick={() => setSelectedSpecialty('All')}><X size={12} /></button>
                                    </span>
                                )}
                                {selectedClinic !== 'All' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F0ED] text-[#173D39] font-medium border border-[#DDE6E2]">
                                        Clinic: {selectedClinic}
                                        <button onClick={() => setSelectedClinic('All')}><X size={12} /></button>
                                    </span>
                                )}
                                {searchQuery && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F0ED] text-[#173D39] font-medium border border-[#DDE6E2]">
                                        Keyword: "{searchQuery}"
                                        <button onClick={() => setSearchQuery('')}><X size={12} /></button>
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleClearFilters}
                                className="text-xs font-semibold text-[#173D39] hover:underline"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Doctor Cards Grid (Section 6 Requirements) */}
                {filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doc) => (
                            <div
                                key={doc.id}
                                className="bg-white rounded-2xl border border-[#DDE6E2] overflow-hidden hover:border-[#173D39] hover:shadow-lg transition-all flex flex-col justify-between text-left group"
                            >
                                <div>
                                    {/* Doctor Portrait Header */}
                                    <div className="relative h-60 overflow-hidden bg-[#F3F7F5] border-b border-[#DDE6E2]">
                                        <img
                                            src={doc.image}
                                            alt={doc.name}
                                            className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-[#173D39] border border-[#DDE6E2] shadow-sm">
                                                <ShieldCheck size={11} className="text-[#237A57]" />
                                                Board-Certified Specialist
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 right-3">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-[#173D39] text-white shadow-sm">
                                                ${doc.consultationFee} <span className="text-[10px] font-normal ml-1 opacity-80">Consult Fee</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content Body */}
                                    <div className="p-5">
                                        <div className="mb-3">
                                            <h3 className="text-lg font-bold text-[#192B29] group-hover:text-[#173D39] transition-colors leading-snug">
                                                {doc.name}
                                            </h3>
                                            <p className="text-xs font-semibold text-[#245B54] mt-0.5">
                                                {doc.specialty} • {doc.subspecialty}
                                            </p>
                                        </div>

                                        {/* Credentials & Qualifications */}
                                        <div className="space-y-2 text-xs text-[#687773] mb-4 pb-4 border-b border-[#F3F7F5]">
                                            <div className="flex items-start gap-2">
                                                <span className="font-semibold text-[#192B29] shrink-0">Credentials:</span>
                                                <span className="truncate">{doc.qualifications}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={13} className="text-[#245B54] shrink-0" />
                                                <span className="truncate text-[#192B29]">{doc.clinic.name}</span>
                                            </div>
                                        </div>

                                        {/* Next Available Appointment Slot */}
                                        <div className="p-3 rounded-xl bg-[#E8F0ED]/70 border border-[#DDE6E2] flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-[#173D39]" />
                                                <span className="text-[11px] font-semibold text-[#192B29]">Next Available:</span>
                                            </div>
                                            <span className="text-xs font-bold text-[#173D39] bg-white px-2 py-0.5 rounded border border-[#DDE6E2]">
                                                {doc.nextAvailable.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => onViewProfile(doc)}
                                        className="py-2.5 px-3 rounded-lg border border-[#DDE6E2] text-[#192B29] hover:bg-[#F3F7F5] font-semibold text-xs transition-colors text-center"
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onBookDoctor(doc)}
                                        className="py-2.5 px-3 rounded-lg bg-[#173D39] hover:bg-[#245B54] text-white font-semibold text-xs transition-colors text-center shadow-sm"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-2xl border border-dashed border-[#DDE6E2] p-12 text-center max-w-lg mx-auto">
                        <div className="w-12 h-12 rounded-xl bg-[#E8F0ED] text-[#173D39] flex items-center justify-center mx-auto mb-4">
                            <Search size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-[#192B29] mb-1">No specialists match your criteria</h3>
                        <p className="text-xs text-[#687773] mb-5">
                            Try adjusting your specialty or campus filter to view available physicians.
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="px-5 py-2.5 rounded-lg bg-[#173D39] text-white text-xs font-semibold hover:bg-[#245B54] transition-colors"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DoctorsSpecialistsSection;
