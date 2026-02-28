import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder = "Select..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div
                className={`w-full px-4 py-3 bg-gray-50 border transition-all cursor-pointer flex justify-between items-center rounded-xl shadow-sm ${isOpen ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/10' : 'border-gray-200 hover:border-emerald-300'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`font-medium ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 py-2 animate-in fade-in slide-in-from-top-2 max-h-60 overflow-auto custom-scrollbar hide-scrollbar">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`px-4 py-2.5 cursor-pointer flex items-center justify-between transition-colors ${value === option.value ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600 font-medium'}`}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                            {value === option.value && <Check size={16} className="text-emerald-600" />}
                        </div>
                    ))}
                </div>
            )}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
                .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
            `}</style>
        </div>
    );
};
