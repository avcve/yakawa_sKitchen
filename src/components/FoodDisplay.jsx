import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const FoodDisplay = ({ month }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const images = month.images || [];

    // Auto-slide logic
    useEffect(() => {
        if (images.length <= 1 || isHovered) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [images.length, isHovered]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Touch support (simple swipe)
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();
    };

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-pink-100 mb-12 animate-fade-in mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">

                {/* Image Slider */}
                <div
                    className="relative rounded-2xl overflow-hidden aspect-square shadow-md group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {images.length > 0 ? (
                        <>
                            <img
                                src={images[currentIndex]}
                                alt={`${month.name} food`}
                                className="w-full h-full object-cover transition-transform duration-500 will-change-transform"
                            />

                            {/* Controls - Only show if > 1 image */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronLeft size={20} className="text-brown-700" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronRight size={20} className="text-brown-700" />
                                    </button>

                                    {/* Dots */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {images.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            No image available
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-heading text-pink-500">The Experience</h3>
                    <div className="w-12 h-1 bg-yellow-300 rounded-full"></div>

                    {month.description ? (
                        <p className="text-brown-700 leading-relaxed whitespace-pre-wrap font-sans text-lg">
                            {month.description}
                        </p>
                    ) : (
                        <p className="text-gray-400 italic">
                            Details about this month's special meal are coming soon...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
