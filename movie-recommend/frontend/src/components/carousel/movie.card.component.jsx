import React from 'react'

const MovieCard = ({ movie, isActive, isFavorite }) => {
    return (
        <div
            className={`w-[280px] bg-gray-800/90 rounded-lg overflow-hidden transition-all duration-300 backdrop-blur-sm flex flex-col items-center ${
                isActive ? 'shadow-2xl scale-110' : 'shadow-lg scale-90'
            }`}
        >
            {/* Card Image */}
            <div className="relative h-[300px] w-full">
                <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
            </div>

            {/* Card Content */}
            <div className="p-4 text-white w-full text-center">
                <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-300">Year: {movie.year}</p>

                {/* Genres */}
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {movie.genres?.slice(0, 2).map((genre, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-200"
                        >
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;


