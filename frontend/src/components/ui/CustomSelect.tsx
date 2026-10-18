import React, { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption<T = string | number> {
    label: string;
    value: T;
    sublabel?: string;
    icon?: React.ComponentType<{ className?: string; size?: number }>;
    disabled?: boolean;
}

export interface CustomSelectProps<T extends string | number> {
    id?: string;
    label?: string;
    options: SelectOption<T>[];
    value: T;
    onChange: (value: T) => void;
    placeholder?: string;
    icon?: React.ComponentType<{ className?: string; size?: number }>;
    error?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'surface';
    disabled?: boolean;
    name?: string;
}

export function CustomSelect<T extends string | number>({
    id,
    label,
    options,
    value,
    onChange,
    placeholder = 'Select an option...',
    icon: Icon,
    error,
    className = '',
    size = 'md',
    variant = 'default',
    disabled = false,
    name
}: CustomSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const generatedId = useId();
    const selectId = id || generatedId;
    const listboxId = `${selectId}-listbox`;

    const selectedOption = options.find((opt) => opt.value === value);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset highlighted index when opened
    useEffect(() => {
        if (isOpen) {
            const currentIndex = options.findIndex((opt) => opt.value === value);
            setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
        } else {
            setHighlightedIndex(-1);
        }
    }, [isOpen, value, options]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
            const items = listboxRef.current.querySelectorAll('[role="option"]');
            const item = items[highlightedIndex] as HTMLElement;
            if (item) {
                item.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [highlightedIndex, isOpen]);

    const handleSelect = (option: SelectOption<T>) => {
        if (option.disabled || disabled) return;
        onChange(option.value);
        setIsOpen(false);
        triggerRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (isOpen) {
                    if (highlightedIndex >= 0 && highlightedIndex < options.length) {
                        const opt = options[highlightedIndex];
                        if (opt && !opt.disabled) {
                            handleSelect(opt);
                        }
                    }
                } else {
                    setIsOpen(true);
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
                }
                break;
            case 'Escape':
                if (isOpen) {
                    e.preventDefault();
                    setIsOpen(false);
                    triggerRef.current?.focus();
                }
                break;
            case 'Tab':
                if (isOpen) {
                    setIsOpen(false);
                }
                break;
            default:
                break;
        }
    };

    // Size variants
    const sizeClasses = {
        sm: 'py-2 text-xs min-h-[38px]',
        md: 'py-2.5 text-sm min-h-[44px]',
        lg: 'py-3 text-base min-h-[50px]',
    };

    const iconSizes = {
        sm: 14,
        md: 16,
        lg: 18,
    };

    // Surface / Background styling
    const bgClasses = variant === 'surface' 
        ? 'bg-[#F3F7F5] hover:bg-white' 
        : 'bg-white';

    return (
        <div className={`relative w-full text-left ${className}`} ref={containerRef}>
            {label && (
                <label 
                    id={`${selectId}-label`}
                    htmlFor={selectId} 
                    className="block text-[11px] font-bold text-[#192B29] uppercase tracking-wider mb-1.5"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <button
                    ref={triggerRef}
                    id={selectId}
                    name={name}
                    type="button"
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    aria-labelledby={label ? `${selectId}-label` : undefined}
                    aria-label={!label ? placeholder : undefined}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    onKeyDown={handleKeyDown}
                    className={`relative w-full ${sizeClasses[size]} ${bgClasses} border transition-all duration-200 rounded-xl flex items-center justify-between text-left outline-none ${
                        Icon ? 'pl-10' : 'pl-3.5'
                    } pr-10 ${
                        disabled
                            ? 'opacity-60 cursor-not-allowed bg-gray-50 border-[#DDE6E2]'
                            : error
                            ? 'border-[#B42318] ring-2 ring-[#B42318]/10'
                            : isOpen
                            ? 'border-[#173D39] ring-2 ring-[#173D39]/15 shadow-sm'
                            : 'border-[#DDE6E2] hover:border-[#245B54] hover:shadow-xs'
                    }`}
                >
                    {/* Left Leading Icon */}
                    {Icon && (
                        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                            isOpen ? 'text-[#173D39]' : 'text-[#245B54]'
                        }`}>
                            <Icon size={iconSizes[size]} />
                        </div>
                    )}

                    {/* Selected Label Display */}
                    <span className="truncate pr-2">
                        {selectedOption ? (
                            <span className="font-semibold text-[#192B29]">
                                {selectedOption.label}
                            </span>
                        ) : (
                            <span className="text-[#687773] font-normal">
                                {placeholder}
                            </span>
                        )}
                    </span>

                    {/* Styled Chevron Icon */}
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                        <ChevronDown
                            size={iconSizes[size]}
                            className={`transition-transform duration-200 ${
                                isOpen ? 'rotate-180 text-[#173D39]' : 'text-[#687773]'
                            }`}
                        />
                    </div>
                </button>

                {/* Floating Options Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={listboxRef}
                            id={listboxId}
                            role="listbox"
                            aria-labelledby={label ? `${selectId}-label` : undefined}
                            initial={{ opacity: 0, y: 4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.98 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            className="absolute z-[80] w-full mt-1.5 bg-white border border-[#DDE6E2] rounded-xl shadow-xl shadow-[#173D39]/8 overflow-hidden py-1 max-h-60 overflow-y-auto no-scrollbar hide-scrollbar"
                        >
                            {options.length === 0 ? (
                                <div className="px-4 py-3 text-xs text-[#687773] text-center">
                                    No options available
                                </div>
                            ) : (
                                options.map((option, index) => {
                                    const isSelected = value === option.value;
                                    const isHighlighted = highlightedIndex === index;
                                    const OptionIcon = option.icon;

                                    return (
                                        <div
                                            key={String(option.value)}
                                            role="option"
                                            aria-selected={isSelected}
                                            aria-disabled={option.disabled}
                                            onClick={() => handleSelect(option)}
                                            onMouseEnter={() => setHighlightedIndex(index)}
                                            className={`px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer flex items-center justify-between transition-colors ${
                                                option.disabled
                                                    ? 'opacity-40 cursor-not-allowed bg-transparent'
                                                    : isSelected
                                                    ? 'bg-[#E8F0ED] text-[#173D39] font-bold'
                                                    : isHighlighted
                                                    ? 'bg-[#F3F7F5] text-[#173D39]'
                                                    : 'text-[#192B29] hover:bg-[#F3F7F5]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 truncate">
                                                {OptionIcon && (
                                                    <OptionIcon
                                                        size={14}
                                                        className={`shrink-0 ${
                                                            isSelected ? 'text-[#173D39]' : 'text-[#245B54]'
                                                        }`}
                                                    />
                                                )}
                                                <div className="truncate">
                                                    <span className="block truncate">{option.label}</span>
                                                    {option.sublabel && (
                                                        <span className="text-[11px] font-normal text-[#687773] block truncate">
                                                            {option.sublabel}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className="w-5 h-5 rounded-full bg-[#173D39] flex items-center justify-center text-white shrink-0 ml-2">
                                                    <Check size={12} className="stroke-[2.5]" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {error && (
                <p className="text-[11px] text-[#B42318] mt-1.5 font-medium ml-1">
                    {error}
                </p>
            )}
        </div>
    );
}

export default CustomSelect;
