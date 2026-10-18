import React, { useState } from 'react';
import { Search, MapPin, Stethoscope, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import consultationHeroImg from '../../assets/consultation_hero.jpg';
import { CLINIC_LOCATIONS, HEALTHCARE_SPECIALTIES } from '../../data/healthcareData';

interface HeroSectionProps {
    onSearch?: (params: { specialty: string; location: string; query: string }) => void;
    onBookClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onBookClick }) => {
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
        <section className="pt-4 pb-12 sm:pt-8 sm:pb-16 bg-white border-b border-[#DDE6E2]" aria-label="Hero and Specialist Search">
            <div className="site-container">
                {/* Hero Editorial Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10">
                    {/* Left Column: Clinical Title & Search */}
                    <div className="lg:col-span-7 flex flex-col items-start text-left">
                        {/* Clinical mark */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F0ED] border border-[#DDE6E2] text-[#173D39] text-xs font-semibold mb-5">
                            <span className="w-2 h-2 rounded-full bg-[#237A57]" />
                            <span>Hospital-Affiliated Specialist Appointments</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#192B29] tracking-tight leading-[1.12] mb-5">
                            Specialized Clinical Care,{' '}
                            <span className="text-[#173D39] block mt-1">
                                Scheduled with Confidence.
                            </span>
                        </h1>

                        <p className="text-[#687773] text-base sm:text-lg leading-relaxed mb-6 max-w-2xl font-normal">
                            Connect directly with credentialed medical specialists across accredited hospital pavilions.
                            Review transparent consultation fees, select real-time available clinic slots, and receive immediate appointment confirmation.
                        </p>

                        {/* Search Console Card */}
                        <div className="w-full bg-[#F3F7F5] p-4 sm:p-5 rounded-2xl border border-[#DDE6E2] shadow-sm">
                            <form onSubmit={handleSearchSubmit} className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Specialty Select */}
                                    <div className="flex flex-col">
                                        <label htmlFor="hero-specialty" className="text-[11px] font-bold text-[#192B29] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                            <Stethoscope size={13} className="text-[#245B54]" /> Specialty
                                        </label>
                                        <select
                                            id="hero-specialty"
                                            value={specialty}
                                            onChange={(e) => setSpecialty(e.target.value)}
                                            className="w-full bg-white border border-[#DDE6E2] rounded-lg px-3 py-2 text-sm text-[#192B29] font-medium transition-colors cursor-pointer"
                                        >
                                            <option value="All">All Specialties (7)</option>
                                            {HEALTHCARE_SPECIALTIES.map((spec) => (
                                                <option key={spec.id} value={spec.name}>
                                                    {spec.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Location Select */}
                                    <div className="flex flex-col">
                                        <label htmlFor="hero-location" className="text-[11px] font-bold text-[#192B29] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                            <MapPin size={13} className="text-[#245B54]" /> Medical Center
                                        </label>
                                        <select
                                            id="hero-location"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full bg-white border border-[#DDE6E2] rounded-lg px-3 py-2 text-sm text-[#192B29] font-medium transition-colors cursor-pointer"
                                        >
                                            <option value="All">All Campuses</option>
                                            {CLINIC_LOCATIONS.map((loc) => (
                                                <option key={loc.id} value={loc.name}>
                                                    {loc.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Doctor Keyword Input */}
                                    <div className="flex flex-col">
                                        <label htmlFor="hero-query" className="text-[11px] font-bold text-[#192B29] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                            <Search size={13} className="text-[#245B54]" /> Doctor / Concern
                                        </label>
                                        <input
                                            id="hero-query"
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="e.g. Vance, ECG, Skin"
                                            className="w-full bg-white border border-[#DDE6E2] rounded-lg px-3 py-2 text-sm text-[#192B29] font-medium transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="flex items-center gap-4 text-xs text-[#687773]">
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 size={13} className="text-[#237A57]" /> Verified Calendars
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 size={13} className="text-[#237A57]" /> Zero Facility Markups
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <button
                                            type="button"
                                            onClick={onBookClick}
                                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-[#DDE6E2] text-[#173D39] bg-white text-xs font-semibold hover:bg-[#E8F0ED] transition-colors"
                                        >
                                            Quick Schedule
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#173D39] text-white text-xs font-semibold hover:bg-[#245B54] active:bg-[#12302D] transition-colors shadow-sm"
                                        >
                                            <span>Search Specialists</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Authentic Editorial Medical Photography */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative rounded-2xl overflow-hidden border border-[#DDE6E2] shadow-lg bg-[#E8F0ED]">
                            <img
                                src={consultationHeroImg}
                                alt="Physician consulting warmly with patient in a serene, bright clinic office"
                                className="w-full h-[360px] sm:h-[420px] object-cover"
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
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F0ED] text-[#173D39] uppercase">
                                    St. Jude Pavilion
                                </span>
                            </div>
                        </div>

                        {/* Subtle supporting badge */}
                        <div className="hidden sm:flex items-center gap-2 mt-3 text-xs text-[#687773] justify-end">
                            <Clock size={13} className="text-[#245B54]" />
                            <span>Average appointment confirmed within 45 seconds</span>
                        </div>
                    </div>
                </div>

                {/* Key clinical standards row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#DDE6E2]/70 text-left">
                    <div className="p-4 rounded-xl bg-[#F3F7F5] border border-[#DDE6E2] flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#E8F0ED] text-[#173D39] flex items-center justify-center shrink-0 mt-0.5">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <h2 className="text-xs font-bold text-[#192B29] uppercase tracking-wider">Board-Certified Specialists</h2>
                            <p className="text-xs text-[#687773] mt-0.5">Every doctor is vetted with active medical licensing and hospital clinic privileges.</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F3F7F5] border border-[#DDE6E2] flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#E8F0ED] text-[#173D39] flex items-center justify-center shrink-0 mt-0.5">
                            <Clock size={18} />
                        </div>
                        <div>
                            <h2 className="text-xs font-bold text-[#192B29] uppercase tracking-wider">Direct Schedule Sync</h2>
                            <p className="text-xs text-[#687773] mt-0.5">Available slots reflect authentic clinic calendars to eliminate double booking.</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F3F7F5] border border-[#DDE6E2] flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#E8F0ED] text-[#173D39] flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <h2 className="text-xs font-bold text-[#192B29] uppercase tracking-wider">Transparent Pricing</h2>
                            <p className="text-xs text-[#687773] mt-0.5">Upfront consultation fees with zero booking surcharges or surprise facility fees.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
