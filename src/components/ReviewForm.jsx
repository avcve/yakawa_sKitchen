import { useState } from 'react';
import { StarRating } from './StarRating';
import { useMonth } from '../context/MonthContext';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export const ReviewForm = () => {
    const { addReview, activeMonthId } = useMonth();
    const [formData, setFormData] = useState({
        nickname: '',
        rating: 0,
        specifics: { taste: 0, portion: 0, presentation: 0 },
        love: '',
        improve: '',
        images: [] // Array of { file, preview }
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleRatingChange = (field, value) => {
        if (field === 'overall') {
            setFormData(prev => ({ ...prev, rating: value }));
        } else {
            setFormData(prev => ({
                ...prev,
                specifics: { ...prev.specifics, [field]: value }
            }));
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 3) {
            alert("Maximum 3 images allowed.");
            return;
        }

        // Create previews
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.rating === 0) {
            alert("Please provide an overall rating.");
            return;
        }

        setSubmitting(true);

        try {
            const uploadedImageUrls = [];

            // Upload images to Supabase Storage
            for (const img of formData.images) {
                const file = img.file;
                const fileName = `review-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;

                const { data, error } = await supabase.storage
                    .from('images')
                    .upload(fileName, file);

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(fileName);

                uploadedImageUrls.push(publicUrl);
            }

            await addReview({
                ...formData,
                images: uploadedImageUrls,
                monthId: activeMonthId,
            });

            setSuccess(true);
            setFormData({ nickname: '', rating: 0, specifics: { taste: 0, portion: 0, presentation: 0 }, love: '', improve: '', images: [] });
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("Failed to submit review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-10 fade-in">
                <h2 className="text-2xl text-pink-500 mb-4">Thank you! ✨</h2>
                <p className="text-brown-600">Your feedback helps make the next meal even better.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 bg-pink-300 text-white px-6 py-2 rounded-full hover:bg-pink-400"
                >
                    Submit Another
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-soft border border-pink-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-heading text-pink-500 mb-2">Month Experience Review</h2>
                <p className="text-brown-400">We'd love to hear what you think!</p>
            </div>

            {/* Step 1: Identity & Overall */}
            <div className="section">
                <div className="mb-6">
                    <label className="block text-brown-600 mb-2 font-bold text-sm uppercase tracking-wider">Your Nickname (Optional)</label>
                    <input
                        type="text"
                        value={formData.nickname}
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                        placeholder="e.g. FoodieKing or SecretChef"
                        className="w-full p-3 rounded-xl border border-pink-100 focus:border-pink-300 focus:ring-2 focus:ring-pink-50 outline-none transition-all text-brown-700 bg-pink-50/30"
                    />
                </div>

                <h3 className="text-xl font-bold text-brown-700 mb-4 flex items-center gap-2">
                    <span className="bg-pink-100 text-pink-500 rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                    Overall Rating
                </h3>
                <div className="flex justify-center py-4 bg-pink-50 rounded-xl">
                    <StarRating value={formData.rating} onChange={(v) => handleRatingChange('overall', v)} size={40} />
                </div>
            </div>

            {/* Step 2: Specifics */}
            <div className="section">
                <h3 className="text-xl font-bold text-brown-700 mb-4 flex items-center gap-2">
                    <span className="bg-pink-100 text-pink-500 rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                    Rate the Specifics
                </h3>
                <div className="space-y-4 px-4">
                    <div className="flex justify-between items-center">
                        <span className="text-brown-600 font-medium">Taste</span>
                        <StarRating value={formData.specifics.taste} onChange={(v) => handleRatingChange('taste', v)} size={24} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-brown-600 font-medium">Portion Size</span>
                        <StarRating value={formData.specifics.portion} onChange={(v) => handleRatingChange('portion', v)} size={24} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-brown-600 font-medium">Presentation</span>
                        <StarRating value={formData.specifics.presentation} onChange={(v) => handleRatingChange('presentation', v)} size={24} />
                    </div>
                </div>
            </div>

            {/* Step 3: Written */}
            <div className="section">
                <h3 className="text-xl font-bold text-brown-700 mb-4 flex items-center gap-2">
                    <span className="bg-pink-100 text-pink-500 rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                    Optional Review
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-brown-600 mb-1 font-medium">What did you love most?</label>
                        <textarea
                            className="w-full p-3 rounded-lg border-2 border-pink-100 focus:border-pink-300 focus:ring-0 transition-all text-brown-700"
                            rows="3"
                            placeholder="The dessert was amazing..."
                            value={formData.love}
                            onChange={e => setFormData({ ...formData, love: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-brown-600 mb-1 font-medium">What can be improved?</label>
                        <textarea
                            className="w-full p-3 rounded-lg border-2 border-pink-100 focus:border-pink-300 focus:ring-0 transition-all text-brown-700"
                            rows="3"
                            placeholder="Maybe less salt..."
                            value={formData.improve}
                            onChange={e => setFormData({ ...formData, improve: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Step 4: Upload */}
            <div className="section">
                <h3 className="text-xl font-bold text-brown-700 mb-4 flex items-center gap-2">
                    <span className="bg-pink-100 text-pink-500 rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
                    Snap & Send
                </h3>

                <div className="border-2 border-dashed border-pink-200 rounded-xl p-6 text-center hover:bg-pink-50 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto text-pink-400 mb-2" />
                    <p className="text-sm text-brown-500">Click to upload images (Max 3)</p>
                </div>

                {formData.images.length > 0 && (
                    <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                        {formData.images.map((img, idx) => (
                            <div key={idx} className="relative w-20 h-20 flex-shrink-0">
                                <img src={img.preview} alt="preview" className="w-full h-full object-cover rounded-lg shadow-sm" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-500"
                                    style={{ padding: 0 }}
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 rounded-full shadow-lg transform transition hover:-translate-y-1 flex justify-center items-center gap-2"
            >
                {submitting ? <Loader2 className="animate-spin" /> : 'Submit Review'}
            </button>

        </form>
    );
};
