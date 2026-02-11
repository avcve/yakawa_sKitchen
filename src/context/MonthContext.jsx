import { createContext, useContext, useState, useEffect } from 'react';

const MonthContext = createContext();

const INITIAL_MONTHS = [
    { id: 'jan-2026', name: 'January 2026', status: 'closed' },
    { id: 'feb-2026', name: 'February 2026', status: 'active' },
];

const INITIAL_REVIEWS = []; // Start empty or mock data

export const MonthProvider = ({ children }) => {
    const [months, setMonths] = useState(() => {
        const saved = localStorage.getItem('yakawa_months');
        return saved ? JSON.parse(saved) : INITIAL_MONTHS;
    });

    const [reviews, setReviews] = useState(() => {
        const saved = localStorage.getItem('yakawa_reviews');
        return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    });

    const [activeMonthId, setActiveMonthId] = useState(() => {
        // Default to first active month or just the latest
        const active = months.find(m => m.status === 'active');
        return active ? active.id : months[0]?.id;
    });

    const [isAdmin, setIsAdmin] = useState(false); // Simple toggle for MVP

    useEffect(() => {
        localStorage.setItem('yakawa_months', JSON.stringify(months));
    }, [months]);

    useEffect(() => {
        localStorage.setItem('yakawa_reviews', JSON.stringify(reviews));
    }, [reviews]);

    const addReview = (review) => {
        const newReview = {
            ...review,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            monthId: activeMonthId,
            isFeatured: false,
        };
        setReviews(prev => [newReview, ...prev]);
    };

    const addMonth = (name) => {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        setMonths(prev => [...prev, { id, name, status: 'upcoming' }]);
    };

    const updateMonthStatus = (id, status) => {
        setMonths(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    };

    const toggleFeaturedReview = (reviewId) => {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isFeatured: !r.isFeatured } : r));
    };

    const deleteReview = (reviewId) => {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
    };

    const getReviewsForMonth = (monthId) => {
        return reviews.filter(r => r.monthId === monthId);
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
            toggleFeaturedReview,
            deleteReview,
            getReviewsForMonth,
            getActiveMonth,
            isAdmin,
            setIsAdmin
        }}>
            {children}
        </MonthContext.Provider>
    );
};

export const useMonth = () => useContext(MonthContext);
