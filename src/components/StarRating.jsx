import { Star } from 'lucide-react';

export const StarRating = ({ value, onChange, readOnly = false, size = 24, label = '' }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex items-center gap-1">
            {label && <span className="font-medium mr-4 text-brown-800">{label}</span>}
            <div className="flex">
                {stars.map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => !readOnly && onChange(star)}
                        className={`transition-colors p-1 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                            }`}
                        style={{
                            background: 'transparent',
                            padding: '2px', // Override global button padding
                            boxShadow: 'none',
                            transform: 'scale(1)',
                            border: 'none',
                            color: star <= value ? '#fbbf24' : '#e5e7eb' // Gold vs Gray
                        }}
                        aria-label={`Rate ${star} stars`}
                    >
                        <Star
                            size={size}
                            fill={star <= value ? '#fbbf24' : 'none'}
                            strokeWidth={1.5}
                            stroke={star <= value ? '#fbbf24' : '#d1d5db'}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};
