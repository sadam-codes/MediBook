import React from 'react';
import { Star } from 'lucide-react';
import { patientReviews } from '../../data/homeData';

const ReviewsSection: React.FC = () => {
    return (
        <div className="mb-24">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter text-center uppercase tracking-tight">Voices of Trust</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {patientReviews.map((review, i) => (
                    <div key={i} className="bg-white p-10 rounded-[20px] shadow-sm border border-gray-100 flex flex-col group text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-gray-50 opacity-10 font-black text-7xl select-none">"</div>
                        <div className="flex text-yellow-200 mb-8 space-x-1.5">
                            {[...Array(review.rating)].map((_, idx) => <Star key={idx} size={18} className="fill-current" />)}
                        </div>
                        <p className="text-gray-500 font-bold mb-12 flex-1 leading-relaxed text-lg opacity-80">"{review.text}"</p>
                        <div className="flex items-center space-x-5 pt-8 border-t border-gray-50">
                            <div className="w-14 h-14 rounded-[20px] overflow-hidden border-2 border-white">
                                <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                                <p className="font-black text-gray-900 text-sm uppercase tracking-widest">{review.name}</p>
                                <p className="text-sky-600 font-bold text-[10px] uppercase tracking-[0.2em] opacity-60">Verified {review.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsSection;
