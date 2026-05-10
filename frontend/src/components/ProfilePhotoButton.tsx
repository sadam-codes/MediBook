import React, { useRef, useState } from 'react';
import api from '../services/api';
import { Camera, Loader2 } from 'lucide-react';

export type LayoutUser = {
    id: number;
    fullName: string;
    email: string;
    role: string;
    profileImage?: string | null;
    hasPatientProfile?: boolean;
    hasDoctorProfile?: boolean;
};

type ProfilePhotoButtonProps = {
    user: LayoutUser;
    onUpdated: (patch: { profileImage: string | null }) => void;
    onCacheBust: () => void;
    cacheKey: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
};

export const ProfilePhotoButton: React.FC<ProfilePhotoButtonProps> = ({
    user,
    onUpdated,
    onCacheBust,
    cacheKey,
    size = 'sm',
    showLabel = false,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const raw = user.profileImage;
    const src = raw
        ? (raw.startsWith('http') ? raw : `${base}${raw}?v=${cacheKey}`)
        : null;

    const dim =
        size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-12 h-12' : 'w-9 h-9';
    const rounded = size === 'lg' ? 'rounded-2xl' : 'rounded-lg';
    const iconSize = size === 'lg' ? 18 : size === 'md' ? 16 : 14;

    const pick = () => {
        setErr(null);
        inputRef.current?.click();
    };

    const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setLoading(true);
        setErr(null);
        try {
            const form = new FormData();
            form.append('profileImage', file);
            const { data } = await api.patch<{ user: { profileImage: string } }>(
                '/users/me/profile-image',
                form,
            );
            onUpdated({ profileImage: data.user.profileImage });
            onCacheBust();
        } catch (ex: unknown) {
            const msg =
                typeof ex === 'object' && ex !== null && 'response' in ex
                    ? (ex as { response?: { data?: { message?: string | string[] } } }).response?.data
                          ?.message
                    : undefined;
            setErr(
                typeof msg === 'string'
                    ? msg
                    : Array.isArray(msg)
                      ? msg.join(', ')
                      : 'Upload failed',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-1">
            <button
                type="button"
                onClick={pick}
                disabled={loading}
                title="Change profile photo"
                className={`relative group ${rounded} border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${loading ? 'opacity-60' : ''}`}
            >
                {src ? (
                    <img
                        src={src}
                        alt=""
                        className={`${dim} ${rounded} object-cover border border-white shadow-sm`}
                    />
                ) : (
                    <div
                        className={`${dim} bg-sky-600 text-white ${rounded} flex items-center justify-center font-bold shadow-sm text-sm`}
                    >
                        {user.fullName?.[0] || 'U'}
                    </div>
                )}
                <span className={`absolute inset-0 ${rounded} bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center`}>
                    {loading ? (
                        <Loader2 className="text-white animate-spin" size={iconSize} />
                    ) : (
                        <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" size={iconSize} />
                    )}
                </span>
            </button>
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={onFile}
            />
            {showLabel && (
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wide">Photo</span>
            )}
            {err && <p className="text-[10px] text-red-600 font-semibold max-w-[140px] text-center">{err}</p>}
        </div>
    );
};
