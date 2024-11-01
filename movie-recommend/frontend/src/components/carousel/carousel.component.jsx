// components/Carousel/Carousel.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Carousel = ({ items }) => {
    const [rotation, setRotation] = useState(0);
    const radius = 500;
    const theta = (2 * Math.PI) / items.length;

    const calculatePosition = (index) => {
        const angle = theta * index + rotation;
        const z = radius * Math.cos(angle);
        const x = radius * Math.sin(angle);
        const scale = (z + radius) / (2 * radius);

        return {
            x,
            z,
            scale,
            rotateY: (angle * 180) / Math.PI,
        };
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black ">
            <div className="relative w-[900px] h-[500px]">
                <div className="absolute inset-0 flex items-center justify-center perspective-1000">
                    <div className="relative w-full h-full">
                        {items.map((item, index) => {
                            const { x, z, scale, rotateY } = calculatePosition(index);
                            const isActive = Math.abs(rotateY % 360) < 30;

                            return (
                                <motion.div
                                    key={index}
                                    animate={{
                                        x,
                                        z,
                                        scale,
                                        rotateY,
                                        opacity: scale,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeInOut"
                                    }}
                                    className={`absolute top-1/5 left-[45%]  -translate-x-1/2 -translate-y-1/2
                                        ${isActive ? 'z-10' : 'z-10'}`}
                                >
                                    <MovieCard movie={item} isActive={isActive} />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
                <button
                    onClick={() => setRotation(rotation + theta)}
                    className="absolute left-[15%] top-1/2 -translate-y-1/2 z-20 
        bg-white/10 hover:bg-white/20 text-white rounded-full p-2
        transition-all duration-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={() => setRotation(rotation - theta)}
                    className="absolute right-[5%] top-1/2 -translate-y-1/2 z-20 
        bg-white/10 hover:bg-white/20 text-white rounded-full p-2
        transition-all duration-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const MovieCard = ({ movie, isActive }) => {
    return (
        <div
            className={`
                w-[280px] bg-gray-800/90 rounded-lg overflow-hidden
                transition-all duration-300 backdrop-blur-sm
                
                ${isActive ? 'shadow-2xl scale-110' : 'shadow-lg scale-90'}
            `}
        >
            <div className="relative h-[400px] w-full"> {/* Increased height */}
                <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white"> {/* Increased padding */}
                    <h3 className="text-xl font-bold mb-2">{movie.title}</h3> {/* Increased text size */}
                    <p className="text-sm text-gray-300">Year: {movie.year}</p>

                    <div className="mt-3 flex flex-wrap gap-2"> {/* Increased gap */}
                        {movie.genres?.slice(0, 2).map((genre, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 bg-white/20 rounded-full text-sm" // Increased text size
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carousel;