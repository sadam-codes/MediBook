import React from 'react';
import logoImg from '../../assets/logo.png';

interface LogoProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
    variant?: 'badge' | 'plain';
    alt?: string;
}

const sizeMap = {
    xs: { box: 'w-7 h-7 rounded-lg', img: 'w-7 h-7' },
    sm: { box: 'w-9 h-9 rounded-xl', img: 'w-9 h-9' },
    md: { box: 'w-10 h-10 rounded-xl', img: 'w-10 h-10' },
    lg: { box: 'w-12 h-12 rounded-2xl', img: 'w-12 h-12' },
    xl: { box: 'w-14 h-14 rounded-2xl', img: 'w-14 h-14' },
    '2xl': { box: 'w-16 h-16 rounded-2xl', img: 'w-16 h-16' },
};

export const Logo: React.FC<LogoProps> = ({
    size = 'md',
    className = '',
    variant = 'badge',
    alt = 'MediBook Health Official Emblem'
}) => {
    const config = sizeMap[size];

    if (variant === 'plain') {
        return (
            <img
                src={logoImg}
                alt={alt}
                className={`${config.box} object-contain rounded-xl shadow-sm ${className}`}
            />
        );
    }

    return (
        <div
            className={`${config.box} bg-white flex items-center justify-center p-0.5 border border-[#DDE6E2] shadow-sm overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
        >
            <img
                src={logoImg}
                alt={alt}
                className="w-full h-full object-contain rounded-[9px]"
            />
        </div>
    );
};
