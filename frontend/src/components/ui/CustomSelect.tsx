import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface CustomSelectProps<T> {
    label?: string;
    options: { label: string; value: T }[];
    value: T;
    onChange: (value: T) => void;
    placeholder: string;
    icon?: any;
    error?: string;
    className?: string;
}

export function CustomSelect<T extends string | number>({
    label,
    options,
    value,
    onChange,
    placeholder,
    icon: Icon,
    error,
    className = ""
}: CustomSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && <label className="block text-xs font-semibold text-slate-600 ml-1 mb-1.5 uppercase tracking-wider">{label}</label>}
            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative group cursor-pointer w-full pl-11 pr-10 py-3 bg-white border ${error ? 'border-red-400' : (isOpen ? 'border-slate-900 ring-1 ring-slate-900/5' : 'border-slate-300 hover:border-slate-400')} rounded-lg transition-all flex items-center min-h-[46px] shadow-sm`}
                >
                    {Icon && <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 ${isOpen ? 'text-slate-900' : 'text-slate-400'}`} size={18} />}
                    <span className={`text-sm font-medium ${selectedOption ? 'text-slate-800' : 'text-slate-400'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-slate-900' : ''}`} size={16} />
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.98 }}
                            className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden py-1"
                        >
                            {options.map((option) => (
                                <div
                                    key={String(option.value)}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`px-4 py-2.5 text-sm font-medium flex items-center justify-between cursor-pointer transition-colors ${value === option.value ? 'bg-slate-50 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    {option.label}
                                    {value === option.value && <Check size={14} className="text-slate-900" />}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {error && <p className="text-[10px] text-red-500 mt-1.5 font-bold ml-1">{error}</p>}
        </div>
    );
}
