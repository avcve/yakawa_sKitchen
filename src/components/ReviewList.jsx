import { useMonth } from '../context/MonthContext';
import { StarRating } from './StarRating';
import { User, Calendar, Star } from 'lucide-react';

export const ReviewList = () => {
    const { getReviewsForMonth, activeMonthId } = useMonth();
    const reviews = getReviewsForMonth(activeMonthId);

    if (reviews.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl opacity-80 animate-fade-in border border-dashed border-pink-200">
                <p className="text-brown-400 text-lg font-heading text-2xl mb-2">No reviews yet...</p>
                <p className="text-sm text-brown-300">Be the first to sprinkle some magic! ✨</p>
            </div>
        )
    }

    // Sort: Featured first, then newest
    const sortedReviews = [...reviews].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedReviews.map((review) => (
                <div
                    key={review.id}
                    className={`bg-white p-6 rounded-3xl transition-all duration-300 border flex flex-col h-full animate-fade-in group relative overflow-hidden ${review.isFeatured
                        ? 'border-yellow-200 shadow-md transform hover:-translate-y-1 ring-2 ring-yellow-100/50'
                        : 'border-pink-50 shadow-sm hover:shadow-md hover:border-pink-100'
                        }`}
                >
                    {review.isFeatured && (
                        <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-600 text-[10px] font-bold px-2 py-1 rounded-bl-xl flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> Featured
                        </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${review.isFeatured ? 'bg-gradient-to-br from-yellow-300 to-orange-300' : 'bg-gradient-to-br from-pink-200 to-pink-300'}`}>
                                <User size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-brown-800 text-sm">{review.nickname || 'Guest'}</h4>
                                <span className="text-brown-400 text-xs flex items-center gap-1 font-mono">
                                    <Calendar size={10} />
                                    {new Date(review.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-lg ${review.isFeatured ? 'bg-yellow-50' : 'bg-pink-50'}`}>
                            <StarRating value={review.rating} readOnly size={16} />
                        </div>
                    </div>

                    <div className="space-y-2 mb-4 text-xs text-brown-600 bg-opacity-30 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex justify-between">
                            <span>Taste</span>
                            <StarRating value={review.specifics.taste} readOnly size={10} />
                        </div>
                        <div className="flex justify-between">
                            <span>Portion</span>
                            <StarRating value={review.specifics.portion} readOnly size={10} />
                        </div>
                        <div className="flex justify-between">
                            <span>Presentation</span>
                            <StarRating value={review.specifics.presentation} readOnly size={10} />
                        </div>
                    </div>

                    {review.love && (
                        <div className="mb-3 relative pl-3 border-l-2 border-pink-200">
                            <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-1">Loved Most</p>
                            <p className="text-brown-700 text-sm italic font-medium">"{review.love}"</p>
                        </div>
                    )}

                    {review.improve && (
                        <div className="mb-4 pl-3 border-l-2 border-gray-200">
                            <p className="text-[10px] font-bold text-brown-400 uppercase tracking-wider mb-1">Could Improve</p>
                            <p className="text-brown-500 text-xs">{review.improve}</p>
                        </div>
                    )}

                    {review.images && review.images.length > 0 && (
                        <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-dashed border-pink-100">
                            {review.images.map((img, idx) => (
                                <div key={idx} className="group/img relative aspect-square overflow-hidden rounded-lg">
                                    <img
                                        src={img.preview || img}
                                        alt="Review"
                                        className="w-full h-full object-cover transform group-hover/img:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
