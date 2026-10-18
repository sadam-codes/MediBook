import React from 'react';
import { Logo } from '../ui/Logo';

export const HomeFooter: React.FC = () => {
    return (
        <footer className="bg-[#173D39] text-[#E8F0ED] py-10 sm:py-12 border-t border-[#245B54] text-left" aria-label="Website Footer">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Main Minimal Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#245B54]/70">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <Logo size="md" className="shadow-sm" />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg sm:text-xl text-white tracking-tight leading-none">
                                    MediBook
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#245B54] text-[#BDE8DA] uppercase tracking-wider">
                                    Health
                                </span>
                            </div>
                            <p className="text-xs text-[#E8F0ED]/70 mt-1 font-medium">
                                Outpatient Specialist Appointment Network
                            </p>
                        </div>
                    </div>

                    {/* Quick Nav Links */}
                    <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-semibold text-[#E8F0ED]/80">
                        <a href="#doctors-list" className="hover:text-[#BDE8DA] transition-colors">
                            Find a Doctor
                        </a>
                        <a href="#specialties" className="hover:text-[#BDE8DA] transition-colors">
                            Specialties
                        </a>
                        <a href="#how-it-works" className="hover:text-[#BDE8DA] transition-colors">
                            How It Works
                        </a>
                        <a href="#faq" className="hover:text-[#BDE8DA] transition-colors">
                            FAQs
                        </a>
                        <a href="/login" className="hover:text-[#BDE8DA] transition-colors">
                            Portal Login
                        </a>
                    </nav>
                </div>

                {/* Bottom Row: Minimal Notice & Copyright */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#E8F0ED]/60">
                    <p>© {new Date().getFullYear()} MediBook Health. All rights reserved.</p>
                    <p className="text-[11px] text-[#E8F0ED]/70 text-center sm:text-right">
                        <span className="text-[#BDE8DA] font-semibold">Emergency Notice:</span> If experiencing acute medical distress, please dial 911 immediately.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default HomeFooter;
