import React, { useState } from 'react';

const MovieCard = ({ movie, isActive, isFavorite, onFavoriteToggle }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleCardClick = () => {
        setIsFlipped((prev) => !prev);
    };

    return (
        <div
            className={`relative w-[200px] h-[300px] bg-gray-800/90 rounded-lg overflow-hidden transition-transform duration-500 ${
                isActive ? 'shadow-2xl scale-105' : 'shadow-lg scale-90'
            }`}
            style={{
                perspective: '1000px',
            }}
        >
            <div
                className="absolute inset-0 w-full h-full transition-transform duration-500"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
                onClick={handleCardClick}
            >
                {/* Front Side */}
                <div
                    className="absolute inset-0 w-full h-full flex flex-col justify-between rounded-lg"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(0deg)',
                        backgroundImage: `url(${movie.thumbnail})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Favorite Icon */}
                    <div className="absolute top-2 right-2 z-10">
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card flip
                                onFavoriteToggle();
                            }}
                            className="p-1 rounded-full bg-black/50 hover:bg-black/70"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={isFavorite ? 'red' : 'none'}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="w-6 h-6 text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6.51 6.51 0 0117.5 3C20.58 3 23 5.42 23 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Card Content */}
                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-4 text-white">
                        <h3 className="text-lg font-bold mb-1">{movie.title}</h3>
                        <p className="text-sm text-gray-300">Year: {movie.year}</p>

                        {/* Genres */}
                        <div className="mt-2 flex flex-wrap gap-2">
                            {movie.genres?.slice(0, 2).map((genre, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-200"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div
                    className="absolute inset-0 w-full h-full bg-gray-900 rounded-lg flex flex-col items-center justify-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <div className="p-3 text-white w-full h-full overflow-y-auto text-center text-xs">
                        <h3 className="text-sm font-bold mb-2">{movie.title}</h3>
                        <p className="text-xs text-gray-300">Year: {movie.year}</p>

                        {/* Genres */}
                        <div className="mt-2 flex flex-wrap justify-center gap-2">
                            {movie.genres?.map((genre, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-200"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* Extract */}
                        <div className="mt-4">
                            <p className="text-xs text-gray-400">
                                {movie.extract ? movie.extract : 'No description available.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;


