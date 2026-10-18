import React, { useState } from 'react';
import { Search, MapPin, Stethoscope, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import consultationHeroImg from '../../assets/consultation_hero.jpg';
import { CLINIC_LOCATIONS, HEALTHCARE_SPECIALTIES } from '../../data/healthcareData';

interface HeroSectionProps {
    onSearch?: (params: { specialty: string; location: string; query: string }) => void;
    onBookClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onBookClick }) => {
    const [specialty, setSpecialty] = useState('All');
    const [location, setLocation] = useState('All');
    const [query, setQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch({ specialty, location, query });
        }
        const elem = document.getElementById('doctors-list');
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section
            className="pt-6 pb-12 sm:pt-10 sm:pb-16 bg-white border-b border-[#DDE6E2]"
            aria-label="Doctor Appointments and Specialist Search"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Hero Editorial Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Column: Clinical Title & Search Console */}
                    <div className="lg:col-span-7 flex flex-col items-start text-left">
                        {/* Clinical Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-semibold mb-5">
                            <span className="w-2 h-2 rounded-full bg-[#237A57]" />
                            <span>Hospital-Affiliated Specialist Appointments</span>
                        </div>

                        {/* Stately, Authoritative Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#192B29] tracking-tight leading-[1.14] mb-5">
                            Specialized Clinical Care, <br />
                            <span className="text-[#173D39]">
                                Scheduled with Confidence.
                            </span>
                        </h1>

                        {/* Informative Subtitle */}
                        <p className="text-[#687773] text-base sm:text-[17px] leading-relaxed mb-6 max-w-2xl font-normal">
                            Connect directly with credentialed medical specialists across accredited hospital pavilions.
                            Review transparent consultation fees, select real-time available clinic slots, and receive immediate appointment confirmation.
                        </p>

                        {/* Search Console Card */}
                        <div className="w-full bg-[#F3F7F5] p-4 sm:p-5 rounded-2xl border border-[#DDE6E2] shadow-sm">
                            <form onSubmit={handleSearchSubmit} className="space-y-3.5">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Specialty Select */}
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="hero-specialty"
                                            className="text-[11px] font-bold text-[#192B29] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                                        >
                                            <Stethoscope size={13} className="text-[#245B54]" /> SPECIALTY
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="hero-specialty"
                                                value={specialty}
                                                onChange={(e) => setSpecialty(e.target.value)}
                                                className="w-full bg-white border border-[#DDE6E2] hover:border-[#245B54] focus:border-[#173D39] rounded-lg px-3 py-2 text-sm text-[#192B29] font-medium transition-colors cursor-pointer outline-none appearance-none pr-8"
                                            >
                                                <option value="All">All Specialties (7)</option>
                                                {HEALTHCARE_SPECIALTIES.map((spec) => (
                                                    <option key={spec.id} value={spec.name}>
                                                        {spec.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#687773]">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Select */}
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="hero-location"
                                            className="text-[11px] font-bold text-[#192B29] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                                        >
                                            <MapPin size={13} className="text-[#245B54]" /> MEDICAL CENTER
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="hero-location"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="w-full bg-white border border-[#DDE6E2] hover:border-[#245B54] focus:border-[#173D39] rounded-lg px-3 py-2 text-sm text-[#192B29] font-medium transition-colors cursor-pointer outline-none appearance-none pr-8"
                                            >
                                                <option value="All">All Campuses</option>
                                                {CLINIC_LOCATIONS.map((loc) => (
                                                    <option key={loc.id} value={loc.name}>
                                                        {loc.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#687773]">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Doctor / Symptom Keyword Input */}
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="hero-query"
                                            className="text-[11px] font-bold text-[#192B29] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                                        >
                                            <Search size={13} className="text-[#245B54]" /> DOCTOR / CONCERN
                                        </label>
                                        <input
                                            id="hero-query"
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="e.g. Vance, ECG, Skin"
                                            className="w-full bg-white border border-[#DDE6E2] hover:border-[#245B54] focus:border-[#173D39] rounded-lg px-3 py-2 text-sm text-[#192B29] font-medium transition-colors outline-none placeholder:text-[#687773]/70"
                                        />
                                    </div>
                                </div>

                                {/* Card Footer: Guarantees + Action Buttons */}
                                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="flex items-center gap-4 text-xs text-[#687773]">
                                        <span className="flex items-center gap-1 font-medium">
                                            <CheckCircle2 size={13} className="text-[#237A57]" /> Verified Calendars
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 font-medium">
                                            <CheckCircle2 size={13} className="text-[#237A57]" /> Zero Facility Markups
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <button
                                            type="button"
                                            onClick={onBookClick}
                                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[#DDE6E2] text-[#173D39] bg-white text-xs font-semibold hover:bg-[#E8F0ED] transition-colors shadow-xs"
                                        >
                                            Quick Schedule
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#173D39] text-white text-xs font-semibold hover:bg-[#245B54] active:bg-[#12302D] transition-colors shadow-sm"
                                        >
                                            <span>Search Specialists</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Editorial Hospital Consultation Card */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative rounded-2xl overflow-hidden border border-[#DDE6E2] shadow-sm bg-[#E8F0ED]">
                            <img
                                src={consultationHeroImg}
                                alt="Senior physician consulting warmly with patient in a serene, bright outpatient clinic office"
                                className="w-full h-[360px] sm:h-[400px] lg:h-[420px] object-cover object-center"
                                loading="eager"
                            />
                            {/* Photographic metadata tag */}
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3.5 rounded-xl border border-[#DDE6E2] shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#E8F0ED] flex items-center justify-center text-[#173D39] shrink-0">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#192B29]">Outpatient Clinical Consultation</p>
                                        <p className="text-[11px] text-[#687773]">Primary Source Credentialed Faculty</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F0ED] text-[#173D39] uppercase tracking-wide">
                                    ST. JUDE PAVILION
                                </span>
                            </div>
                        </div>

                        {/* Supporting badge */}
                        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-[#687773] justify-end">
                            <Clock size={13} className="text-[#245B54]" />
                            <span>Average appointment confirmed within 45 seconds</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
