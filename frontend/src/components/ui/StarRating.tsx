import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingDisplayProps {
    rating: number;
    size?: number;
    showValue?: boolean;
    reviewCount?: number;
}

export const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({
    rating,
    size = 16,
    showValue = true,
    reviewCount,
}) => {
    const rounded = Math.round(rating * 2) / 2;

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = rounded >= star;
                const half = !filled && rounded >= star - 0.5;

                return (
                    <Star
                        key={star}
                        size={size}
                        className={`${filled ? 'fill-amber-400 text-amber-400' : half ? 'fill-amber-200 text-amber-400' : 'text-slate-200'}`}
                    />
                );
            })}
            {showValue && (
                <span className="text-xs font-black text-slate-900 ml-1">{rating.toFixed(1)}</span>
            )}
            {reviewCount !== undefined && reviewCount > 0 && (
                <span className="text-[10px] font-bold text-slate-400 ml-1">({reviewCount})</span>
            )}
        </div>
    );
};

interface StarRatingInputProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    size?: number;
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
    value,
    onChange,
    disabled = false,
    size = 28,
}) => {
    const [hover, setHover] = React.useState(0);
    const active = hover || value;

    return (
        <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={disabled}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(star)}
                    className="p-1 transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
                >
                    <Star
                        size={size}
                        className={`${active >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} transition-colors`}
                    />
                </button>
            ))}
        </div>
    );
};
