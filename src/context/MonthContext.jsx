import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const MonthContext = createContext();

export const MonthProvider = ({ children }) => {
    const [months, setMonths] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMonthId, setActiveMonthId] = useState(null);

    // Fetch Initial Data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: monthsData, error: monthsError } = await supabase
                .from('months')
                .select('*')
                .order('created_at', { ascending: false });

            const { data: reviewsData, error: reviewsError } = await supabase
                .from('reviews')
                .select('*')
                .order('timestamp', { ascending: false });

            if (monthsError) throw monthsError;
            if (reviewsError) throw reviewsError;

            setMonths(monthsData || []);
            setReviews(reviewsData || []);

            // Set active month
            const active = monthsData?.find(m => m.status === 'active');
            setActiveMonthId(active ? active.id : monthsData?.[0]?.id);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const addReview = async (review) => {
        try {
            // Upload images to Supabase Storage first if they are base64
            // Note: For simplicity in this migration, we are assuming small base64 for now OR 
            // we should really handle image upload in the form before sending here.
            // OPTION: We will keep Base64 for reviews for now to avoid huge refactor, 
            // BUT Supabase DB has a limit. Best practice is Storage. 
            // For now, let's Insert as is, but if it fails, we know why.

            // ACTUALLY: The plan said "Update AdminDashboard image upload (Storage)".
            // For reviews, users might also upload images. 
            // Let's stick to the current flow but send to DB. 
            // The table has images text[], which can hold URLs or Base64 (if small).

            const { data, error } = await supabase
                .from('reviews')
                .insert([{
                    month_id: review.monthId,
                    nickname: review.nickname,
                    rating: review.rating,
                    specifics: review.specifics,
                    love: review.love,
                    improve: review.improve,
                    images: review.images, // Sending base64/urls directly
                    is_featured: false
                }])
                .select()
                .single();

            if (error) throw error;
            setReviews(prev => [data, ...prev]);
        } catch (error) {
            console.error("Error adding review:", error);
            alert("Failed to submit review. Please try again.");
        }
    };

    const addMonth = async (name) => {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        const newMonth = {
            id,
            name,
            status: 'upcoming',
            description: '',
            images: []
        };

        try {
            const { error } = await supabase.from('months').insert([newMonth]);
            if (error) throw error;
            setMonths(prev => [...prev, newMonth]);
        } catch (error) {
            console.error("Error adding month:", error);
        }
    };

    const updateMonthStatus = async (id, status) => {
        try {
            const { error } = await supabase
                .from('months')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            setMonths(prev => prev.map(m => m.id === id ? { ...m, status } : m));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const updateMonthDetails = async (id, details) => {
        try {
            const { error } = await supabase
                .from('months')
                .update(details)
                .eq('id', id);

            if (error) throw error;
            setMonths(prev => prev.map(m => m.id === id ? { ...m, ...details } : m));
        } catch (error) {
            console.error("Error updating details:", error);
        }
    };

    const toggleFeaturedReview = async (reviewId) => {
        const review = reviews.find(r => r.id === reviewId);
        if (!review) return;

        try {
            const { error } = await supabase
                .from('reviews')
                .update({ is_featured: !review.is_featured })
                .eq('id', reviewId);

            if (error) throw error;
            setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, is_featured: !review.is_featured } : r));
        } catch (error) {
            console.error("Error toggling feature:", error);
        }
    };

    const deleteReview = async (reviewId) => {
        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .eq('id', reviewId);

            if (error) throw error;
            setReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const getReviewsForMonth = (monthId) => {
        return reviews.filter(r => r.month_id === monthId); // Note: Supabase uses snake_case, but we map it back or use as is
    };

    const getActiveMonth = () => months.find(m => m.id === activeMonthId);

    return (
        <MonthContext.Provider value={{
            months,
            activeMonthId,
            setActiveMonthId,
            reviews,
            addReview,
            addMonth,
            updateMonthStatus,
            updateMonthDetails,
            toggleFeaturedReview,
            deleteReview,
            getReviewsForMonth,
            getActiveMonth,
            loading
        }}>
            {children}
        </MonthContext.Provider>
    );
};

export const useMonth = () => useContext(MonthContext);
