import { useState } from 'react';
import { useMonth } from '../context/MonthContext';
import { Trash2, Lock, Plus, Eye, Star, AlertCircle } from 'lucide-react';

export const AdminDashboard = () => {
    const {
        months,
        addMonth,
        updateMonthStatus,
        reviews,
        activeMonthId,
        setActiveMonthId,
        toggleFeaturedReview,
        deleteReview,
        getReviewsForMonth
    } = useMonth();
    const [newMonthName, setNewMonthName] = useState('');

    const handleAddMonth = (e) => {
        e.preventDefault();
        if (newMonthName.trim()) {
            addMonth(newMonthName);
            setNewMonthName('');
        }
    };

    // Show all reviews for simplicity in admin, or filtered by active month?
    // Prompt says "View all reviews". I'll show for active month by default, or all?
    // Let's show all but grouped or just simple list.
    // I'll show all sorted by date.
    const allReviews = [...reviews].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="bg-white rounded-3xl p-8 shadow-lg max-w-6xl mx-auto space-y-8 animate-fade-in border border-pink-100">
            <h2 className="text-3xl font-heading text-pink-500 mb-6 flex items-center gap-2">
                <span className="text-4xl">👑</span> Admin Dashboard
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Month Management */}
                <div>
                    <h3 className="text-xl font-bold text-brown-700 mb-4 flex items-center gap-2">
                        Monthly Experience Management
                    </h3>

                    <form onSubmit={handleAddMonth} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newMonthName}
                            onChange={(e) => setNewMonthName(e.target.value)}
                            placeholder="New Month Name (e.g. March 2026)"
                            className="flex-1"
                        />
                        <button type="submit" className="bg-brown-500 hover:bg-brown-600 px-4 rounded-xl text-white">
                            <Plus size={20} />
                        </button>
                    </form>

                    <div className="space-y-3">
                        {months.map(month => (
                            <div key={month.id} className={`flex justify-between items-center p-3 rounded-xl border ${month.id === activeMonthId ? 'bg-pink-50 border-pink-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-80'}`}>
                                <div>
                                    <p className="font-bold text-brown-700">{month.name}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${month.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                        {month.status}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {month.status !== 'active' ? (
                                        <button
                                            onClick={() => {
                                                updateMonthStatus(month.id, 'active');
                                                setActiveMonthId(month.id);
                                            }}
                                            className="p-2 bg-white border border-pink-100 text-pink-400 hover:bg-pink-50 rounded-lg"
                                            title="Set Active"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => updateMonthStatus(month.id, 'closed')}
                                            className="p-2 bg-white border border-red-100 text-red-400 hover:bg-red-50 rounded-lg"
                                            title="Close Month"
                                        >
                                            <Lock size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review Analytics/List */}
                <div>
                    <h3 className="text-xl font-bold text-brown-700 mb-4">All Reviews</h3>
                    <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2 custom-scrollbar bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        {allReviews.length === 0 && (
                            <div className="text-center text-gray-400 py-10">No reviews yet.</div>
                        )}
                        {allReviews.map(review => (
                            <div key={review.id} className={`p-4 bg-white rounded-xl text-sm border transition-all ${review.isFeatured ? 'border-yellow-300 shadow-md ring-1 ring-yellow-100' : 'border-gray-100 shadow-sm'}`}>
                                <div className="flex justify-between mb-2">
                                    <div>
                                        <span className="font-bold text-brown-600 block">{review.monthId}</span>
                                        <span className="text-xs text-gray-400">{new Date(review.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => toggleFeaturedReview(review.id)}
                                            className={`p-1.5 rounded-full transition-colors ${review.isFeatured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400'}`}
                                            title="Toggle Featured"
                                        >
                                            <Star size={16} fill={review.isFeatured ? "currentColor" : "none"} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete review?')) deleteReview(review.id);
                                            }}
                                            className="p-1.5 text-gray-300 hover:text-red-500 rounded-full hover:bg-red-50"
                                            title="Delete Review"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {review.love && <p className="text-brown-700 italic mb-1">"{review.love}"</p>}
                                {review.improve && <p className="text-gray-500 text-xs">Improve: {review.improve}</p>}

                                <div className="mt-2 flex gap-1 items-center">
                                    <span className="text-xs font-bold text-gray-400 mr-2">Overall:</span>
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i < review.rating ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
