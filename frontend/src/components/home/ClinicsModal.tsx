import React from 'react';
import { X, MapPin, Phone, Clock, Building2, Video, CheckCircle2 } from 'lucide-react';
import { CLINIC_LOCATIONS, type ClinicLocation } from '../../data/healthcareData';

interface ClinicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClinic?: (clinicId: string) => void;
}

export const ClinicsModal: React.FC<ClinicsModalProps> = ({ isOpen, onClose, onSelectClinic }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-[#173D39]/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl border border-[#DDE6E2] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="clinics-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#DDE6E2] flex items-center justify-between bg-[#F3F7F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F0ED] border border-[#DDE6E2] flex items-center justify-center text-[#173D39]">
              <Building2 size={20} />
            </div>
            <div>
              <h2 id="clinics-modal-title" className="text-xl font-bold text-[#192B29]">
                Affiliated Hospitals & Outpatient Clinics
              </h2>
              <p className="text-xs text-[#687773] mt-0.5">
                Accredited clinical facilities and subspecialty consultation suites
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#687773] hover:text-[#192B29] hover:bg-[#E8F0ED] rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLINIC_LOCATIONS.map((clinic: ClinicLocation) => (
              <div
                key={clinic.id}
                className="p-5 rounded-xl border border-[#DDE6E2] bg-white hover:border-[#173D39] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F0ED] text-[#173D39]">
                      {clinic.isVirtual ? <Video size={12} /> : <Building2 size={12} />}
                      {clinic.campus}
                    </span>
                    <span className="text-[11px] font-medium text-[#237A57] flex items-center gap-1">
                      <CheckCircle2 size={12} /> Open Today
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#192B29] group-hover:text-[#173D39] transition-colors mb-1">
                    {clinic.name}
                  </h3>
                  <p className="text-xs text-[#687773] mb-3">
                    {clinic.suite}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#192B29]/80 pt-2 border-t border-[#F3F7F5]">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-[#245B54] shrink-0" />
                      <span>{clinic.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-[#245B54] shrink-0" />
                      <span>{clinic.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-[#245B54] shrink-0" />
                      <span>{clinic.hours}</span>
                    </div>
                  </div>
                </div>

                {onSelectClinic && (
                  <button
                    onClick={() => {
                      onSelectClinic(clinic.id);
                      onClose();
                    }}
                    className="mt-4 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#F3F7F5] text-[#173D39] hover:bg-[#173D39] hover:text-white transition-colors text-center border border-[#DDE6E2]"
                  >
                    View Specialists at this Location
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#E8F0ED]/70 border border-[#DDE6E2] text-xs text-[#192B29] flex items-start gap-3 mt-4">
            <span className="font-bold text-[#173D39] shrink-0">Direct Facility Access:</span>
            <span>All affiliated clinics feature dedicated patient parking, wheelchair accessibility, and direct electronic health record synchronization with MediBook.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F3F7F5] border-t border-[#DDE6E2] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-[#173D39] hover:bg-[#E8F0ED] rounded-lg transition-colors border border-[#DDE6E2]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
