import React, { useState, useMemo } from 'react';
import {
    Search, MapPin, Stethoscope, ArrowRight, ShieldCheck,
    Clock, CheckCircle2, Calendar, Building2
} from 'lucide-react';
import consultationHeroImg from '../../assets/consultation_hero_real.jpg';
import { CLINIC_LOCATIONS, HEALTHCARE_SPECIALTIES } from '../../data/healthcareData';
import { CustomSelect } from '../ui/CustomSelect';

interface HeroSectionProps {
    onSearch?: (params: { specialty: string; location: string; query: string }) => void;
    onBookClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onBookClick }) => {
    const [specialty, setSpecialty] = useState('All');
    const [location, setLocation] = useState('All');
    const [query, setQuery] = useState('');

    const specialtyOptions = useMemo(() => [
        { label: 'All Specialties', value: 'All' },
        ...HEALTHCARE_SPECIALTIES.map((spec) => ({
            label: spec.name,
            value: spec.name,
            sublabel: spec.description,
        }))
    ], []);

    const locationOptions = useMemo(() => [
        { label: 'All Hospital Campuses', value: 'All' },
        ...CLINIC_LOCATIONS.map((loc) => ({
            label: loc.name,
            value: loc.name,
            sublabel: loc.campus,
        }))
    ], []);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (onSearch) {
            onSearch({ specialty, location, query });
        }
        const elem = document.getElementById('doctors-list');
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleQuickSpecialtyClick = (specialtyName: string) => {
        setSpecialty(specialtyName);
        if (onSearch) {
            onSearch({ specialty: specialtyName, location, query: '' });
        }
        const elem = document.getElementById('doctors-list');
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const popularSpecialties = ['Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Orthopedics'];

    return (
        <section
            className="pt-8 pb-14 sm:pt-12 sm:pb-18 bg-[#FBFDFD] border-b border-[#DDE6E2]"
            aria-label="Doctor Appointments and Specialist Search"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    {/* Left Column: Authentic Hospital Copy & Direct Search */}
                    <div className="lg:col-span-7 flex flex-col items-start text-left">
                        {/* Clinical Network Tag */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-bold tracking-wide uppercase mb-5">
                            <ShieldCheck size={14} className="text-[#245B54]" />
                            <span>Accredited Outpatient Specialist Network</span>
                        </div>

                        {/* Confident, Dignified Headline */}
                        <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#192B29] tracking-tight leading-[1.12] mb-5">
                            Find the right doctor. <br />
                            <span className="text-[#173D39]">Book your visit with ease.</span>
                        </h1>

                        <p className="text-[#687773] text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-normal">
                            Connect with verified clinical specialists across our hospital pavilions.
                            Review transparent consultation fees, check real-time availability, and receive immediate appointment confirmation.
                        </p>

                        {/* Unified Doctor Search Console */}
                        <div className="w-full bg-white rounded-2xl border border-[#DDE6E2] shadow-sm p-3 sm:p-4 mb-4">
                            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-stretch gap-2.5">
                                {/* Specialty Select */}
                                <div className="flex-1 min-w-0">
                                    <label htmlFor="hero-specialty" className="sr-only">Specialty</label>
                                    <CustomSelect
                                        id="hero-specialty"
                                        options={specialtyOptions}
                                        value={specialty}
                                        onChange={(val) => setSpecialty(val as string)}
                                        placeholder="Specialty (All)"
                                        icon={Stethoscope}
                                        size="sm"
                                    />
                                </div>

                                {/* Location Select */}
                                <div className="flex-1 min-w-0">
                                    <label htmlFor="hero-location" className="sr-only">Campus Location</label>
                                    <CustomSelect
                                        id="hero-location"
                                        options={locationOptions}
                                        value={location}
                                        onChange={(val) => setLocation(val as string)}
                                        placeholder="Hospital Campus"
                                        icon={Building2}
                                        size="sm"
                                    />
                                </div>

                                {/* Doctor / Condition Input */}
                                <div className="flex-1 min-w-0 relative">
                                    <label htmlFor="hero-query" className="sr-only">Doctor Name or Condition</label>
                                    <div className="relative h-full flex items-center">
                                        <Search className="absolute left-3.5 text-[#687773]" size={16} />
                                        <input
                                            id="hero-query"
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Doctor name or symptom..."
                                            className="w-full h-full min-h-[42px] bg-[#F3F7F5] border border-[#DDE6E2] focus:border-[#173D39] focus:bg-white focus:ring-1 focus:ring-[#173D39] rounded-xl pl-10 pr-3 text-xs sm:text-sm text-[#192B29] font-medium outline-none transition-all placeholder:text-[#687773]/70"
                                        />
                                    </div>
                                </div>

                                {/* Search Button */}
                                <button
                                    type="submit"
                                    className="shrink-0 px-6 py-2.5 rounded-xl bg-[#173D39] hover:bg-[#245B54] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 min-h-[42px]"
                                >
                                    <span>Find Doctors</span>
                                    <ArrowRight size={14} />
                                </button>
                            </form>
                        </div>

                        {/* Popular Specialty Fast Links */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#687773] mb-6">
                            <span className="font-semibold text-[#192B29]">Common Specialties:</span>
                            {popularSpecialties.map((spec) => (
                                <button
                                    key={spec}
                                    type="button"
                                    onClick={() => handleQuickSpecialtyClick(spec)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                        specialty === spec
                                            ? 'bg-[#173D39] text-white border-[#173D39]'
                                            : 'bg-white text-[#687773] border-[#DDE6E2] hover:border-[#173D39] hover:text-[#173D39]'
                                    }`}
                                >
                                    {spec}
                                </button>
                            ))}
                        </div>

                        {/* Verified Guarantees */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#687773] pt-4 border-t border-[#DDE6E2]/70">
                            <span className="flex items-center gap-1.5 font-medium">
                                <CheckCircle2 size={15} className="text-[#237A57]" /> Verified Doctor Calendars
                            </span>
                            <span className="flex items-center gap-1.5 font-medium">
                                <CheckCircle2 size={15} className="text-[#237A57]" /> Transparent Consultation Fees
                            </span>
                            <span className="flex items-center gap-1.5 font-medium">
                                <CheckCircle2 size={15} className="text-[#237A57]" /> No Surprise Clinic Markups
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Grounded Editorial Hospital Consultation Card */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl border border-[#DDE6E2] shadow-sm overflow-hidden text-left">
                            {/* Realistic Hospital Image Frame */}
                            <div className="relative h-[290px] sm:h-[320px] bg-[#E8F0ED] overflow-hidden border-b border-[#DDE6E2]">
                                <img
                                    src={consultationHeroImg}
                                    alt="Physician conducting a clinical consultation in an outpatient hospital office"
                                    className="w-full h-full object-cover object-center"
                                    loading="eager"
                                />
                                <div className="absolute top-3.5 left-3.5">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-[#DDE6E2] text-xs font-bold text-[#173D39] shadow-sm">
                                        <Building2 size={13} className="text-[#245B54]" />
                                        <span>St. Jude Outpatient Pavilion</span>
                                    </span>
                                </div>
                            </div>

                            {/* Grounded Clinical Summary Box */}
                            <div className="p-5 sm:p-6 space-y-4">
                                <div>
                                    <h3 className="text-base font-bold text-[#192B29]">
                                        Outpatient Specialist Consultations
                                    </h3>
                                    <p className="text-xs text-[#687773] mt-1 leading-relaxed">
                                        Direct scheduling with certified department specialists. In-person diagnostic evaluations, laboratory follow-ups, and coordinated treatment plans.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#DDE6E2]">
                                    <div className="p-3 bg-[#F3F7F5] rounded-xl border border-[#DDE6E2]/60">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#192B29]">
                                            <Clock size={14} className="text-[#245B54]" />
                                            <span>Same-Week Visits</span>
                                        </div>
                                        <p className="text-[11px] text-[#687773] mt-0.5">Priority scheduling open</p>
                                    </div>

                                    <div className="p-3 bg-[#F3F7F5] rounded-xl border border-[#DDE6E2]/60">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#192B29]">
                                            <Calendar size={14} className="text-[#245B54]" />
                                            <span>Direct Booking</span>
                                        </div>
                                        <p className="text-[11px] text-[#687773] mt-0.5">Zero phone queues</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={onBookClick}
                                    className="w-full py-3 rounded-xl bg-[#173D39] hover:bg-[#245B54] text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <span>Browse Available Time Slots</span>
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
