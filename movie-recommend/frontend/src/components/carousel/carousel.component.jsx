import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './carousel.css';
import MovieCard from './movie.card.component';

const Carousel = ({ items }) => {
    const [rotation, setRotation] = useState(0);
    const [favorites, setFavorites] = useState([]);

    const radius = 500; // Distance from center to items
    const theta = (2 * Math.PI) / items.length; // Angle between items

    useEffect(() => {
        const fetchFavorites = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return;

            try {
                const response = await fetch(
                    `http://localhost:3001/api/users/${user.username}/favorites`
                );
                if (response.ok) {
                    const data = await response.json();
                    setFavorites(data.favorites || []);
                }
            } catch (err) {
                console.error('Error fetching favorites:', err);
            }
        };

        fetchFavorites();
    }, []);

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

    const handleFavoriteToggle = async (movie) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('You must be logged in to add or remove favorites!');
            return;
        }

        const isFavorite = favorites.includes(movie.title);

        try {
            const response = await fetch(
                `http://localhost:3001/api/users/${user.username}/favorites`,
                {
                    method: isFavorite ? 'DELETE' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ movieTitle: movie.title }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setFavorites(data.favorites || []);
            } else {
                const error = await response.json();
                console.error('Failed to update favorites:', error);
            }
        } catch (err) {
            console.error('Error updating favorites:', err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-#121212">
            <div className="relative w-[900px] h-[500px]">
                <div className="absolute inset-0 flex items-center justify-center perspective-1000">
                    <div className="relative w-full h-full">
                        {items.map((item, index) => {
                            const { x, z, scale, rotateY } = calculatePosition(index);
                            const isActive = Math.abs(rotateY % 360) < 30;

                            return (
                                <div
                                    key={item.title}
                                    className="relative flex flex-col items-center"
                                >
                                    {/* Card Animation */}
                                    <motion.div
                                        animate={{
                                            x,
                                            z,
                                            scale,
                                            rotateY,
                                            opacity: scale,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            ease: 'easeInOut',
                                        }}
                                        className={`absolute top-1/2 left-[39%] transform -translate-x-1/2 -translate-y-1/2 ${isActive ? 'z-10' : 'z-0'}`}
                                    >
                                        <MovieCard
                                            movie={item}
                                            isActive={isActive}
                                            isFavorite={favorites.includes(item.title)}
                                            onFavoriteToggle={() => handleFavoriteToggle(item)}
                                        />
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Rotation Controls */}
                <button
                    onClick={() => setRotation(rotation + theta)}
                    className="absolute left-[15%] top-1/2 -translate-y-1/2 z-20 
                        bg-white/10 hover:bg-white/20 text-white rounded-full p-2
                        transition-all duration-200"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                <button
                    onClick={() => setRotation(rotation - theta)}
                    className="absolute right-[5%] top-1/2 -translate-y-1/2 z-20 
                        bg-white/10 hover:bg-white/20 text-white rounded-full p-2
                        transition-all duration-200"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Carousel;



