import { useState, useEffect } from 'react';
import { useMonth } from '../context/MonthContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Lock, Plus, Eye, Star, LogOut, UserCog, Save, Upload, X } from 'lucide-react';

const FoodDetailsForm = ({ monthId }) => {
    const { months, updateMonthDetails } = useMonth();
    const month = months.find(m => m.id === monthId);

    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (month) {
            setDescription(month.description || '');
            setImages(month.images || []);
        }
    }, [monthId, months]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result]);
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        updateMonthDetails(monthId, { description, images });
        alert('Food details saved!');
    };

    if (!month) return null;

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-brown-600 mb-2">Meal Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 rounded-xl border border-pink-100 focus:border-pink-300 outline-none h-32"
                    placeholder="Describe the meal (Ingredients, Inspiration, Flavor profile...)"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-brown-600 mb-2">
                    Food Images
                    <span className="text-gray-400 font-normal ml-2 text-xs">(First image is featured)</span>
                </label>

                <div className="flex flex-wrap gap-4 mb-3">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                            <img src={img} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                            {idx === 0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                                    Main
                                </div>
                            )}
                        </div>
                    ))}

                    <label className="w-24 h-24 rounded-xl border-2 border-dashed border-pink-200 flex flex-col items-center justify-center text-pink-300 cursor-pointer hover:bg-pink-50 hover:border-pink-300 transition-colors">
                        <Upload size={24} />
                        <span className="text-xs mt-1">Upload</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>
            </div>

            <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
            >
                <Save size={18} /> Save Details
            </button>
        </div>
    );
};

export const AdminDashboard = () => {
    const {
        months,
        addMonth,
        updateMonthStatus,
        reviews,
        activeMonthId,
        setActiveMonthId,
        toggleFeaturedReview,
        deleteReview
    } = useMonth();

    const { logout, updateCredentials, credentials } = useAuth();

    const [newMonthName, setNewMonthName] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [newUsername, setNewUsername] = useState(credentials.username);
    const [newPassword, setNewPassword] = useState(credentials.password);
    const [msg, setMsg] = useState('');

    const handleAddMonth = (e) => {
        e.preventDefault();
        if (newMonthName.trim()) {
            addMonth(newMonthName);
            setNewMonthName('');
        }
    };

    const handleUpdateCredentials = (e) => {
        e.preventDefault();
        updateCredentials(newUsername, newPassword);
        setMsg('Credentials updated!');
        setTimeout(() => setMsg(''), 3000);
    };

    const allReviews = [...reviews].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="bg-white rounded-3xl p-8 shadow-lg max-w-6xl mx-auto space-y-8 animate-fade-in border border-pink-100 mb-20 relative">
            <div className="flex justify-between items-center mb-6 border-b border-pink-100 pb-4">
                <h2 className="text-3xl font-heading text-pink-500 flex items-center gap-2">
                    <span className="text-4xl">👑</span> Admin Dashboard
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${showSettings ? 'bg-pink-100 text-pink-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        <UserCog size={18} /> Settings
                    </button>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl flex items-center gap-2 transition-all"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {showSettings && (
                <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100 animate-slide-up">
                    <h3 className="text-xl font-bold text-brown-700 mb-4 flex items-center gap-2">
                        <UserCog size={20} /> Update Credentials
                    </h3>
                    <form onSubmit={handleUpdateCredentials} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-gray-400 mb-1">Username</label>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={e => setNewUsername(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-gray-400 mb-1">Password</label>
                            <input
                                type="text"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <button type="submit" className="bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600 flex items-center gap-2">
                            <Save size={18} /> Save
                        </button>
                    </form>
                    {msg && <p className="text-green-500 mt-2 text-sm font-bold animate-pulse">{msg}</p>}
                </div>
            )}

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

                {/* Active Month Configuration - Spans 2 cols */}
                <div className="md:col-span-2 bg-pink-50 rounded-2xl p-6 border border-pink-100">
                    <h3 className="text-xl font-bold text-brown-700 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🍲</span> Active Month Details ({months.find(m => m.id === activeMonthId)?.name})
                    </h3>
                    <FoodDetailsForm monthId={activeMonthId} />
                </div>
            </div>
        </div>
    );
};
