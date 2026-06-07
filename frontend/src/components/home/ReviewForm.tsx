import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { StarRatingInput } from '../ui/StarRating';

interface ReviewFormProps {
    appointmentId: number;
    doctorName: string;
    onSubmitted?: () => void;
    onSkip?: () => void;
    compact?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
    appointmentId,
    doctorName,
    onSubmitted,
    onSkip,
    compact = false,
}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating < 1) {
            toast.error('Please select a star rating');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/reviews', {
                appointmentId,
                rating,
                comment: comment.trim() || undefined,
            });
            toast.success('Thank you for your review!');
            onSubmitted?.();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`w-full text-center ${compact ? 'space-y-4' : 'space-y-6'}`}>
            <div>
                <p className={`font-black text-gray-900 uppercase tracking-tight ${compact ? 'text-sm mb-1' : 'text-lg mb-2'}`}>
                    Rate Dr. {doctorName}
                </p>
                <p className="text-gray-400 font-bold text-xs">
                    How was your booking experience with this doctor?
                </p>
            </div>

            <StarRatingInput value={rating} onChange={setRating} disabled={submitting} size={compact ? 24 : 32} />

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional comment..."
                rows={compact ? 2 : 3}
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-medium text-gray-700 outline-none focus:border-sky-500 resize-none"
            />

            <div className={`flex gap-3 ${compact ? 'flex-col' : 'flex-col sm:flex-row'}`}>
                {onSkip && (
                    <button
                        type="button"
                        onClick={onSkip}
                        disabled={submitting}
                        className="w-full py-4 bg-white border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest text-[10px]"
                    >
                        Skip for Now
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || rating < 1}
                    className="w-full py-4 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-600 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit Review'}
                </button>
            </div>
        </div>
    );
};

export default ReviewForm;
