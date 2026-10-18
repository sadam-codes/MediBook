import React from 'react';
import { HeartPulse, Phone, Mail, ShieldAlert, ShieldCheck } from 'lucide-react';
import { HEALTHCARE_SPECIALTIES, CLINIC_LOCATIONS } from '../../data/healthcareData';

export const HomeFooter: React.FC = () => {
    return (
        <footer className="bg-[#173D39] text-[#E8F0ED] pt-16 pb-12 border-t border-[#245B54] text-left" aria-label="Website Footer">
            <div className="site-container">
                {/* Main 4-column footer grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#245B54]">
                    {/* Col 1: Brand & Clinical Purpose (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[#245B54] flex items-center justify-center text-[#BDE8DA] border border-[#3E857B]">
                                <HeartPulse size={20} className="stroke-[2.2]" />
                            </div>
                            <span className="font-bold text-xl text-white tracking-tight">
                                MediBook <span className="text-[#BDE8DA] font-normal text-sm ml-1">Health</span>
                            </span>
                        </div>

                        <p className="text-xs text-[#E8F0ED]/80 leading-relaxed max-w-sm">
                            A dedicated clinical scheduling platform connecting patients with verified medical specialists across accredited hospital outpatient pavilions.
                        </p>

                        <div className="pt-2 text-xs text-[#E8F0ED]/70 space-y-2">
                            <div className="flex items-center gap-2">
                                <Phone size={13} className="text-[#BDE8DA] shrink-0" />
                                <span>Patient Desk: (555) 018-4200 (Mon–Fri, 8am–6pm)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={13} className="text-[#BDE8DA] shrink-0" />
                                <span>Inquiries: appointments@medibook-health.org</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={13} className="text-[#BDE8DA] shrink-0" />
                                <span>Encrypted Healthcare Scheduling • TLS 1.3</span>
                            </div>
                        </div>
                    </div>

                    {/* Col 2: Clinical Departments (3 cols) */}
                    <div className="lg:col-span-3 space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            Clinical Departments
                        </h4>
                        <ul className="space-y-2 text-xs text-[#E8F0ED]/80">
                            {HEALTHCARE_SPECIALTIES.map((spec) => (
                                <li key={spec.id}>
                                    <a
                                        href="#doctors-list"
                                        className="hover:text-[#BDE8DA] transition-colors"
                                    >
                                        {spec.name} Department
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Outpatient Campuses (3 cols) */}
                    <div className="lg:col-span-3 space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            Hospital Campuses
                        </h4>
                        <ul className="space-y-3 text-xs text-[#E8F0ED]/80">
                            {CLINIC_LOCATIONS.map((clinic) => (
                                <li key={clinic.id} className="space-y-0.5">
                                    <p className="font-semibold text-white">{clinic.name}</p>
                                    <p className="text-[#E8F0ED]/60 text-[11px]">{clinic.address}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Patient Guidance & Ethics (2 cols) */}
                    <div className="lg:col-span-2 space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            Patient Guidance
                        </h4>
                        <ul className="space-y-2 text-xs text-[#E8F0ED]/80">
                            <li><a href="#specialties" className="hover:text-[#BDE8DA] transition-colors">Specialist Directory</a></li>
                            <li><a href="#doctors-list" className="hover:text-[#BDE8DA] transition-colors">Real-Time Calendars</a></li>
                            <li><a href="#" className="hover:text-[#BDE8DA] transition-colors">Intake Preparation</a></li>
                            <li><a href="#" className="hover:text-[#BDE8DA] transition-colors">Fee Disclosures</a></li>
                            <li><a href="#" className="hover:text-[#BDE8DA] transition-colors">Patient Care Charter</a></li>
                            <li><a href="#" className="hover:text-[#BDE8DA] transition-colors">Privacy Practices</a></li>
                        </ul>
                    </div>
                </div>

                {/* Mandatory Medical Emergency Disclaimer Banner */}
                <div className="py-6 border-b border-[#245B54] my-6 bg-[#12302D] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-xl">
                    <div className="flex items-start gap-3 text-xs text-[#E8F0ED]/90">
                        <ShieldAlert size={16} className="text-[#BDE8DA] shrink-0 mt-0.5" />
                        <div>
                            <strong className="text-white block mb-0.5">Emergency Medical Notice:</strong>
                            <span>
                                MediBook is an outpatient appointment scheduling and healthcare information platform. If you are experiencing an acute medical emergency, chest pain, difficulty breathing, or severe trauma, please immediately call 911 (or your local emergency telephone number) or proceed to the nearest emergency department. Do not rely on scheduled outpatient appointments for emergency medical triage.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal / Copyright Bar */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8F0ED]/60">
                    <p>© 2026 MediBook Health System. All rights reserved. Hospital specialist network.</p>
                    <div className="flex items-center gap-6 text-[11px]">
                        <a href="#" className="hover:text-white transition-colors">Notice of Privacy Practices</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                        <a href="#" className="hover:text-white transition-colors">Nondiscrimination Statement</a>
                        <a href="#" className="hover:text-white transition-colors">Accessibility</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default HomeFooter;
