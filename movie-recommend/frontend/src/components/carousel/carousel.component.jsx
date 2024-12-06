// // components/Carousel/Carousel.jsx
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';

// const Carousel = ({ items }) => {
//     const [rotation, setRotation] = useState(0);
//     const radius = 500;
//     const theta = (2 * Math.PI) / items.length;

//     const calculatePosition = (index) => {
//         const angle = theta * index + rotation;
//         const z = radius * Math.cos(angle);
//         const x = radius * Math.sin(angle);
//         const scale = (z + radius) / (2 * radius);

//         return {
//             x,
//             z,
//             scale,
//             rotateY: (angle * 180) / Math.PI,
//         };
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-black ">
//             <div className="relative w-[900px] h-[500px]">
//                 <div className="absolute inset-0 flex items-center justify-center perspective-1000">
//                     <div className="relative w-full h-full">
//                         {items.map((item, index) => {
//                             const { x, z, scale, rotateY } = calculatePosition(index);
//                             const isActive = Math.abs(rotateY % 360) < 30;

//                             return (
//                                 <motion.div
//                                     key={index}
//                                     animate={{
//                                         x,
//                                         z,
//                                         scale,
//                                         rotateY,
//                                         opacity: scale,
//                                     }}
//                                     transition={{
//                                         duration: 0.5,
//                                         ease: "easeInOut"
//                                     }}
//                                     className={`absolute top-1/5 left-[45%]  -translate-x-1/2 -translate-y-1/2
//                                         ${isActive ? 'z-10' : 'z-10'}`}
//                                 >
//                                     <MovieCard movie={item} isActive={isActive} />
//                                 </motion.div>
//                             );
//                         })}
//                     </div>
//                 </div>
//                 <button
//                     onClick={() => setRotation(rotation + theta)}
//                     className="absolute left-[15%] top-1/2 -translate-y-1/2 z-20 
//         bg-white/10 hover:bg-white/20 text-white rounded-full p-2
//         transition-all duration-200"
//                 >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                     </svg>
//                 </button>

//                 <button
//                     onClick={() => setRotation(rotation - theta)}
//                     className="absolute right-[5%] top-1/2 -translate-y-1/2 z-20 
//         bg-white/10 hover:bg-white/20 text-white rounded-full p-2
//         transition-all duration-200"
//                 >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                 </button>
//             </div>
//         </div>
//     );
// };

// const MovieCard = ({ movie, isActive }) => {
//     return (
//         <div
//             className={`
//                 w-[280px] bg-gray-800/90 rounded-lg overflow-hidden
//                 transition-all duration-300 backdrop-blur-sm

//                 ${isActive ? 'shadow-2xl scale-110' : 'shadow-lg scale-90'}
//             `}
//         >
//             <div className="relative h-[400px] w-full"> {/* Increased height */}
//                 <img
//                     src={movie.thumbnail}
//                     alt={movie.title}
//                     className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />

//                 <div className="absolute bottom-0 left-0 right-0 p-6 text-white"> {/* Increased padding */}
//                     <h3 className="text-xl font-bold mb-2">{movie.title}</h3> {/* Increased text size */}
//                     <p className="text-sm text-gray-300">Year: {movie.year}</p>

//                     <div className="mt-3 flex flex-wrap gap-2"> {/* Increased gap */}
//                         {movie.genres?.slice(0, 2).map((genre, idx) => (
//                             <span
//                                 key={idx}
//                                 className="px-2 py-1 bg-white/20 rounded-full text-sm" // Increased text size
//                             >
//                                 {genre}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Carousel;

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import './carousel.css'

// const Carousel = ({ items }) => {
//     const [rotation, setRotation] = useState(0);
//     const [favorites, setFavorites] = useState([]);

//     const radius = 500;
//     const theta = (2 * Math.PI) / items.length;

//     console.log('Carousel received items:', items); // Debug log

//     const calculatePosition = (index) => {
//         const angle = theta * index + rotation;
//         const z = radius * Math.cos(angle);
//         const x = radius * Math.sin(angle);
//         const scale = (z + radius) / (2 * radius);

//         return {
//             x,
//             z,
//             scale,
//             rotateY: (angle * 180) / Math.PI,
//         };
//     };

//     const handleFavoriteToggle = async (movie) => {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (!user) {
//             alert("You must be logged in to add favorites!");
//             return;
//         }

//         const isFavorite = favorites.includes(movie.title);

//         try {
//             const response = await fetch(
//                 `http://localhost:3001/api/users/${user.username}/favorites`,
//                 {
//                     method: isFavorite ? 'DELETE' : 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ movieTitle: movie.title }),
//                 }
//             );

//             if (response.ok) {
//                 setFavorites((prevFavorites) =>
//                     isFavorite
//                         ? prevFavorites.filter((title) => title !== movie.title)
//                         : [...prevFavorites, movie.title]
//                 );
//             } else {
//                 const error = await response.json();
//                 console.error("Failed to update favorites:", error);
//             }
//         } catch (err) {
//             console.error("Error updating favorites:", err);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-black">
//             <div className="relative w-[900px] h-[500px]">
//                 <div className="absolute inset-0 flex items-center justify-center perspective-1000">
//                     <div className="relative w-full h-full">
//                         {items.map((item, index) => {
//                             const { x, z, scale, rotateY } = calculatePosition(index);
//                             const isActive = Math.abs(rotateY % 360) < 30;

//                             console.log('Rendering item:', item); // Debug log for each item

//                             return (
//                                 <motion.div
//                                     key={index}
//                                     animate={{
//                                         x,
//                                         z,
//                                         scale,
//                                         rotateY,
//                                         opacity: scale,
//                                     }}
//                                     transition={{
//                                         duration: 0.5,
//                                         ease: "easeInOut",
//                                     }}
//                                     className={`absolute top-1/5 left-[45%]  -translate-x-1/2 -translate-y-1/2 ${isActive ? 'z-10' : 'z-0'
//                                         }`}
//                                 >
//                                     <MovieCard
//                                         movie={item}
//                                         isActive={isActive}
//                                         isFavorite={favorites.includes(item.title)}
//                                         onFavoriteToggle={() => handleFavoriteToggle(item)}
//                                     />
//                                 </motion.div>
//                             );
//                         })}
//                     </div>
//                 </div>
//                 <button
//                     onClick={() => setRotation(rotation + theta)}
//                     className="absolute left-[15%] top-1/2 -translate-y-1/2 z-20 
//                         bg-white/10 hover:bg-white/20 text-white rounded-full p-2
//                         transition-all duration-200"
//                 >
//                     <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 19l-7-7 7-7"
//                         />
//                     </svg>
//                 </button>

//                 <button
//                     onClick={() => setRotation(rotation - theta)}
//                     className="absolute right-[5%] top-1/2 -translate-y-1/2 z-20 
//                         bg-white/10 hover:bg-white/20 text-white rounded-full p-2
//                         transition-all duration-200"
//                 >
//                     <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 5l7 7-7 7"
//                         />
//                     </svg>
//                 </button>
//             </div>
//         </div>
//     );
// };

// const MovieCard = ({ movie, isActive, isFavorite, onFavoriteToggle }) => {
//     console.log('Rendering MovieCard for movie:', movie); // Debug log
//     return (
//         <div
//             className={`w-[280px] bg-gray-800/90 rounded-lg overflow-hidden transition-all duration-300 backdrop-blur-sm ${isActive ? 'shadow-2xl scale-110' : 'shadow-lg scale-90'
//                 }`}
//         >
//             <div className="relative h-[400px] w-full">
//                 <img
//                     src={movie.thumbnail}
//                     alt={movie.title}
//                     className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />

//                 <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                     <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
//                     <p className="text-sm text-gray-300">Year: {movie.year}</p>

//                     <div className="mt-3 flex flex-wrap gap-2">
//                         {movie.genres?.slice(0, 2).map((genre, idx) => (
//                             <span
//                                 key={idx}
//                                 className="px-2 py-1 bg-white/20 rounded-full text-sm"
//                             >
//                                 {genre}
//                             </span>
//                         ))}
//                     </div>

//                     {/* Favorite Button */}
//                     <button
//                         onClick={onFavoriteToggle}
//                         className={`mt-4 px-4 py-2 text-sm rounded-lg transition-all z-10 ${isFavorite
//                             ? 'bg-red-600 text-white hover:bg-red-500'
//                             : 'bg-gray-600 text-white hover:bg-gray-500'
//                             }`}
//                     >
//                         {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
//                     </button>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Carousel;


// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import './carousel.css';

// const Carousel = ({ items }) => {
//     const [rotation, setRotation] = useState(0);
//     const [favorites, setFavorites] = useState([]); // Global favorites list

//     const radius = 500;
//     const theta = (2 * Math.PI) / items.length;

//     // Fetch the user's favorites when the component mounts
//     useEffect(() => {
//         const fetchFavorites = async () => {
//             const user = JSON.parse(localStorage.getItem('user'));
//             if (!user) return;

//             try {
//                 const response = await fetch(
//                     `http://localhost:3001/api/users/${user.username}/favorites`
//                 );
//                 if (response.ok) {
//                     const data = await response.json();
//                     setFavorites(data.favorites || []); // Initialize favorites
//                 }
//             } catch (err) {
//                 console.error('Error fetching favorites:', err);
//             }
//         };

//         fetchFavorites();
//     }, []);

//     const calculatePosition = (index) => {
//         const angle = theta * index + rotation;
//         const z = radius * Math.cos(angle);
//         const x = radius * Math.sin(angle);
//         const scale = (z + radius) / (2 * radius);

//         return {
//             x,
//             z,
//             scale,
//             rotateY: (angle * 180) / Math.PI,
//         };
//     };

//     const handleFavoriteToggle = async (movie) => {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (!user) {
//             alert('You must be logged in to add or remove favorites!');
//             return;
//         }

//         const isFavorite = favorites.includes(movie.title);

//         try {
//             const response = await fetch(
//                 `http://localhost:3001/api/users/${user.username}/favorites`,
//                 {
//                     method: isFavorite ? 'DELETE' : 'POST', // DELETE if removing, POST if adding
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ movieTitle: movie.title }),
//                 }
//             );

//             if (response.ok) {
//                 const data = await response.json();
//                 setFavorites(data.favorites || []); // Update favorites state from API response
//             } else {
//                 const error = await response.json();
//                 console.error('Failed to update favorites:', error);
//             }
//         } catch (err) {
//             console.error('Error updating favorites:', err);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-black">
//             <div className="relative w-[900px] h-[500px]">
//                 <div className="absolute inset-0 flex items-center justify-center perspective-1000">
//                     <div className="relative w-full h-full">
//                         {items.map((item, index) => {
//                             const { x, z, scale, rotateY } = calculatePosition(index);
//                             const isActive = Math.abs(rotateY % 360) < 30;

//                             return (
//                                 <motion.div
//                                     key={item.title} // Use movie title or a unique id as the key
//                                     animate={{
//                                         x,
//                                         z,
//                                         scale,
//                                         rotateY,
//                                         opacity: scale,
//                                     }}
//                                     transition={{
//                                         duration: 0.5,
//                                         ease: 'easeInOut',
//                                     }}
//                                     className={`absolute top-1/5 left-[45%] -translate-x-1/2 -translate-y-1/2 ${isActive ? 'z-10' : 'z-0'
//                                         }`}
//                                 >
//                                     <MovieCard
//                                         movie={item}
//                                         isActive={isActive}
//                                         isFavorite={favorites.includes(item.title)} // Check if the movie is a favorite
//                                         onFavoriteToggle={() => handleFavoriteToggle(item)}
//                                     />
//                                 </motion.div>
//                             );
//                         })}
//                     </div>
//                 </div>
//                 <button
//                     onClick={() => setRotation(rotation + theta)}
//                     className="absolute left-[15%] top-1/2 -translate-y-1/2 z-20 
//                         bg-white/10 hover:bg-white/20 text-white rounded-full p-2
//                         transition-all duration-200"
//                 >
//                     <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 19l-7-7 7-7"
//                         />
//                     </svg>
//                 </button>

//                 <button
//                     onClick={() => setRotation(rotation - theta)}
//                     className="absolute right-[5%] top-1/2 -translate-y-1/2 z-20 
//                         bg-white/10 hover:bg-white/20 text-white rounded-full p-2
//                         transition-all duration-200"
//                 >
//                     <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 5l7 7-7 7"
//                         />
//                     </svg>
//                 </button>
//             </div>
//         </div>
//     );
// };


// const MovieCard = ({ movie, isActive, isFavorite, onFavoriteToggle }) => {
//     return (
//         <div
//             className={`w-[280px] bg-gray-800/90 rounded-lg overflow-hidden transition-all duration-300 backdrop-blur-sm ${isActive ? 'shadow-2xl scale-110' : 'shadow-lg scale-90'
//                 } flex flex-col items-center`}
//         >
//             <div className="relative h-[400px] w-full">
//                 <img
//                     src={movie.thumbnail}
//                     alt={movie.title}
//                     className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
//             </div>

//             <div className="p-4 text-white w-full text-center">
//                 <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
//                 <p className="text-sm text-gray-300">Year: {movie.year}</p>

//                 <div className="mt-3 flex flex-wrap justify-center gap-2">
//                     {movie.genres?.slice(0, 2).map((genre, idx) => (
//                         <span
//                             key={idx}
//                             className="px-2 py-1 bg-white/20 rounded-full text-sm"
//                         >
//                             {genre}
//                         </span>
//                     ))}
//                 </div>
//             </div>

//             {/* Button below the card */}
//             <div className="w-full flex justify-center mb-4">
//                 <button
//                     onClick={onFavoriteToggle}
//                     className={`px-4 py-2 text-sm rounded-lg transition-all z-10 ${isFavorite
//                         ? 'bg-red-600 text-white hover:bg-red-500'
//                         : 'bg-gray-600 text-white hover:bg-gray-500'
//                         }`}
//                 >
//                     {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Carousel;

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import './carousel.css';

// const Carousel = ({ items }) => {
//     const [rotation, setRotation] = useState(0);
//     const [favorites, setFavorites] = useState([]); // Global favorites list

//     const radius = 500;
//     const theta = (2 * Math.PI) / items.length;

//     // Fetch the user's favorites when the component mounts
//     useEffect(() => {
//         const fetchFavorites = async () => {
//             const user = JSON.parse(localStorage.getItem('user'));
//             if (!user) return;

//             try {
//                 const response = await fetch(
//                     `http://localhost:3001/api/users/${user.username}/favorites`
//                 );
//                 if (response.ok) {
//                     const data = await response.json();
//                     setFavorites(data.favorites || []); // Initialize favorites
//                 }
//             } catch (err) {
//                 console.error('Error fetching favorites:', err);
//             }
//         };

//         fetchFavorites();
//     }, []);

//     const calculatePosition = (index) => {
//         const angle = theta * index + rotation;
//         const z = radius * Math.cos(angle);
//         const x = radius * Math.sin(angle);
//         const scale = (z + radius) / (2 * radius);

//         return {
//             x,
//             z,
//             scale,
//             rotateY: (angle * 180) / Math.PI,
//         };
//     };

//     const handleFavoriteToggle = async (movie) => {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (!user) {
//             alert('You must be logged in to add or remove favorites!');
//             return;
//         }

//         const isFavorite = favorites.includes(movie.title);

//         try {
//             const response = await fetch(
//                 `http://localhost:3001/api/users/${user.username}/favorites`,
//                 {
//                     method: isFavorite ? 'DELETE' : 'POST', // DELETE if removing, POST if adding
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ movieTitle: movie.title }),
//                 }
//             );

//             if (response.ok) {
//                 const data = await response.json();
//                 setFavorites(data.favorites || []); // Update favorites state from API response
//             } else {
//                 const error = await response.json();
//                 console.error('Failed to update favorites:', error);
//             }
//         } catch (err) {
//             console.error('Error updating favorites:', err);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-black">
//             <div className="relative w-[900px] h-[500px]">
//                 <div className="absolute inset-0 flex items-center justify-center perspective-1000">
//                     <div className="relative w-full h-full">
//                         {items.map((item, index) => {
//                             const { x, z, scale, rotateY } = calculatePosition(index);
//                             const isActive = Math.abs(rotateY % 360) < 30;

//                             return (
//                                 <motion.div
//                                     key={item.title} // Use movie title or a unique id as the key
//                                     animate={{
//                                         x,
//                                         z,
//                                         scale,
//                                         rotateY,
//                                         opacity: scale,
//                                     }}
//                                     transition={{
//                                         duration: 0.5,
//                                         ease: 'easeInOut',
//                                     }}
//                                     className={`absolute top-1/5 left-[45%] -translate-x-1/2 -translate-y-1/2 ${isActive ? 'z-10' : 'z-0'
//                                         }`}
//                                 >
//                                     <MovieCard
//                                         movie={item}
//                                         isActive={isActive}
//                                         isFavorite={favorites.includes(item.title)} // Check if the movie is a favorite
//                                         onFavoriteToggle={() => handleFavoriteToggle(item)}
//                                     />
//                                 </motion.div>
//                             );
//                         })}
//                     </div>
//                 </div>
//                 <button
//                     onClick={() => setRotation(rotation + theta)}
//                     className="absolute left-[15%] top-1/2 -translate-y-1/2 z-20 
//                         bg-white/10 hover:bg-white/20 text-white rounded-full p-2
//                         transition-all duration-200"
//                 >
//                     <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 19l-7-7 7-7"
//                         />
//                     </svg>
//                 </button>

//                 <button
//                     onClick={() => setRotation(rotation - theta)}
//                     className="absolute right-[5%] top-1/2 -translate-y-1/2 z-20 
//                         bg-white/10 hover:bg-white/20 text-white rounded-full p-2
//                         transition-all duration-200"
//                 >
//                     <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 5l7 7-7 7"
//                         />
//                     </svg>
//                 </button>
//             </div>
//         </div>
//     );
// };
// const MovieCard = ({ movie, isActive, isFavorite, onFavoriteToggle }) => {

//     const handleClick = (e) => {
//         e.stopPropagation();  // Stop event bubbling
//         e.preventDefault();    // Prevent default behavior
//         console.log("Button clicked!");  // Debug log
//         onFavoriteToggle();
//     };

//     return (
//         <div className="flex flex-col items-center" style={{ pointerEvents: 'auto' }}>
//             {/* Card */}
//             <div
//                 className={`w-[280px] bg-gray-800/90 rounded-lg overflow-hidden transition-all duration-300 backdrop-blur-sm flex flex-col items-center ${isActive ? 'shadow-2xl scale-110' : 'shadow-lg scale-90'
//                     }`}
//             >
//                 {/* Card Image */}
//                 <div className="relative h-[300px] w-full">
//                     <img
//                         src={movie.thumbnail}
//                         alt={movie.title}
//                         className="w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
//                 </div>

//                 {/* Card Content */}
//                 <div className="p-4 text-white w-full text-center">
//                     <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
//                     <p className="text-sm text-gray-300">Year: {movie.year}</p>

//                     {/* Genres */}
//                     <div className="mt-3 flex flex-wrap justify-center gap-2">
//                         {movie.genres?.slice(0, 2).map((genre, idx) => (
//                             <span
//                                 key={idx}
//                                 className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-200"
//                             >
//                                 {genre}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//             </div>

         
//             * <div className="w-full flex justify-center mt-4">
//                 <button
//                     onClick={() => {
//                         console.log("Button clicked!");
//                         onFavoriteToggle();
//                     }}
//                     className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${isFavorite
//                         ? 'bg-red-600 text-white hover:bg-red-500'
//                         : 'bg-gray-600 text-white hover:bg-gray-500'
//                         }`}
//                 >
//                     {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
//                 </button>

//             </div> 

//         </div>
//     );
// };

// export default Carousel;



// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import './carousel.css';

// const Carousel = ({ items }) => {
//     const [rotation, setRotation] = useState(0);
//     const [favorites, setFavorites] = useState([]);

//     const radius = 500;
//     const theta = (2 * Math.PI) / items.length;

//     useEffect(() => {
//         const fetchFavorites = async () => {
//             const user = JSON.parse(localStorage.getItem('user'));
//             if (!user) return;

//             try {
//                 const response = await fetch(
//                     `http://localhost:3001/api/users/${user.username}/favorites`
//                 );
//                 if (response.ok) {
//                     const data = await response.json();
//                     setFavorites(data.favorites || []);
//                 }
//             } catch (err) {
//                 console.error('Error fetching favorites:', err);
//             }
//         };

//         fetchFavorites();
//     }, []);

//     const calculatePosition = (index) => {
//         const angle = theta * index + rotation;
//         const z = radius * Math.cos(angle);
//         const x = radius * Math.sin(angle);
//         const scale = (z + radius) / (2 * radius);

//         return {
//             x,
//             z,
//             scale,
//             rotateY: (angle * 180) / Math.PI,
//         };
//     };

//     const handleFavoriteToggle = async (movie) => {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (!user) {
//             alert('You must be logged in to add or remove favorites!');
//             return;
//         }

//         const isFavorite = favorites.includes(movie.title);

//         try {
//             const response = await fetch(
//                 `http://localhost:3001/api/users/${user.username}/favorites`,
//                 {
//                     method: isFavorite ? 'DELETE' : 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ movieTitle: movie.title }),
//                 }
//             );

//             if (response.ok) {
//                 const data = await response.json();
//                 setFavorites(data.favorites || []);
//             } else {
//                 const error = await response.json();
//                 console.error('Failed to update favorites:', error);
//             }
//         } catch (err) {
//             console.error('Error updating favorites:', err);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-black">
//             <div className="relative w-[900px] h-[500px]">
//                 <div className="absolute inset-0 flex items-center justify-center perspective-1000">
//                     <div className="relative w-full h-full">
//                         {items.map((item, index) => {
//                             const { x, z, scale, rotateY } = calculatePosition(index);
//                             const isActive = Math.abs(rotateY % 360) < 30;

//                             return (
//                                 <div key={item.title} className="relative">
//                                     {/* Card Animation */}
//                                     <motion.div
//                                         animate={{
//                                             x,
//                                             z,
//                                             scale,
//                                             rotateY,
//                                             opacity: scale,
//                                         }}
//                                         transition={{
//                                             duration: 0.5,
//                                             ease: 'easeInOut',
//                                         }}
//                                         className={`absolute top-1/5 left-[45%] -translate-x-1/2 -translate-y-1/2 ${isActive ? 'z-10' : 'z-0'
//                                             }`}
//                                     >
//                                         <MovieCard
//                                             movie={item}
//                                             isActive={isActive}
//                                             isFavorite={favorites.includes(item.title)}
//                                         />
//                                     </motion.div>

//                                     {/* Button Section */}
//                                     <div className="w-full flex justify-center mt-4">
//                                         <button
//                                             onClick={() => handleFavoriteToggle(item)}
//                                             className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
//                                                 favorites.includes(item.title)
//                                                     ? 'bg-red-600 text-white hover:bg-red-500'
//                                                     : 'bg-gray-600 text-white hover:bg-gray-500'
//                                             }`}
//                                         >
//                                             {favorites.includes(item.title)
//                                                 ? 'Remove from Favorites'
//                                                 : 'Add to Favorites'}
//                                         </button>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//                 {/* Rotation Controls */}
//                 <button
//                     onClick={() => setRotation(rotation + theta)}
//                     className="absolute left-[15%] top-1/2 -translate-y-1/2 z-20 
//                         bg-white/10 hover:bg-white/20 text-white rounded-full p-2
//                         transition-all duration-200"
//                 >
//                     <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 19l-7-7 7-7"
//                         />
//                     </svg>
//                 </button>

//                 <button
//                     onClick={() => setRotation(rotation - theta)}
//                     className="absolute right-[5%] top-1/2 -translate-y-1/2 z-20 
//                         bg-white/10 hover:bg-white/20 text-white rounded-full p-2
//                         transition-all duration-200"
//                 >
//                     <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 5l7 7-7 7"
//                         />
//                     </svg>
//                 </button>
//             </div>
//         </div>
//     );
// };




// export default Carousel;

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import './carousel.css';
// import MovieCard from './movie.card.component'; // Assuming MovieCard is in the same folder

// const Carousel = ({ items }) => {
//     const [rotation, setRotation] = useState(0);
//     const [favorites, setFavorites] = useState([]);

//     const radius = 500; // Distance from center to items
//     const theta = (2 * Math.PI) / items.length; // Angle between items

//     useEffect(() => {
//         const fetchFavorites = async () => {
//             const user = JSON.parse(localStorage.getItem('user'));
//             if (!user) return;

//             try {
//                 const response = await fetch(
//                     `http://localhost:3001/api/users/${user.username}/favorites`
//                 );
//                 if (response.ok) {
//                     const data = await response.json();
//                     setFavorites(data.favorites || []);
//                 }
//             } catch (err) {
//                 console.error('Error fetching favorites:', err);
//             }
//         };

//         fetchFavorites();
//     }, []);

//     const calculatePosition = (index) => {
//         const angle = theta * index + rotation;
//         const z = radius * Math.cos(angle);
//         const x = radius * Math.sin(angle);
//         const scale = (z + radius) / (2 * radius);

//         return {
//             x,
//             z,
//             scale,
//             rotateY: (angle * 180) / Math.PI,
//         };
//     };

//     const handleFavoriteToggle = async (movie) => {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (!user) {
//             alert('You must be logged in to add or remove favorites!');
//             return;
//         }

//         const isFavorite = favorites.includes(movie.title);

//         try {
//             const response = await fetch(
//                 `http://localhost:3001/api/users/${user.username}/favorites`,
//                 {
//                     method: isFavorite ? 'DELETE' : 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ movieTitle: movie.title }),
//                 }
//             );

//             if (response.ok) {
//                 const data = await response.json();
//                 setFavorites(data.favorites || []);
//             } else {
//                 const error = await response.json();
//                 console.error('Failed to update favorites:', error);
//             }
//         } catch (err) {
//             console.error('Error updating favorites:', err);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-black">
//             <div className="relative w-[900px] h-[500px]">
//                 <div className="absolute inset-0 flex items-center justify-center perspective-1000">
//                     <div className="relative w-full h-full">
//                         {items.map((item, index) => {
//                             const { x, z, scale, rotateY } = calculatePosition(index);
//                             const isActive = Math.abs(rotateY % 360) < 30;

//                             return (
//                                 <div
//                                     key={item.title}
//                                     className="relative flex flex-col items-center"
//                                 >
//                                     {/* Card Animation */}
//                                     <motion.div
//                                         animate={{
//                                             x,
//                                             z,
//                                             scale,
//                                             rotateY,
//                                             opacity: scale,
//                                         }}
//                                         transition={{
//                                             duration: 0.5,
//                                             ease: 'easeInOut',
//                                         }}
//                                         className={`absolute top-1/5 left-[45%] -translate-x-1/2 -translate-y-1/2 ${isActive ? 'z-10' : 'z-0'
//                                             }`}
//                                     >
//                                         <MovieCard
//                                             movie={item}
//                                             isActive={isActive}
//                                             isFavorite={favorites.includes(item.title)}
//                                         />
//                                     </motion.div>

//                                     {/* Button Section */}
//                                     <div className="mt-4">
//                                         <button
//                                             onClick={() => handleFavoriteToggle(item)}
//                                             className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
//                                                 favorites.includes(item.title)
//                                                     ? 'bg-red-600 text-white hover:bg-red-500'
//                                                     : 'bg-gray-600 text-white hover:bg-gray-500'
//                                             }`}
//                                         >
//                                             {favorites.includes(item.title)
//                                                 ? 'Remove from Favorites'
//                                                 : 'Add to Favorites'}
//                                         </button>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* Rotation Controls */}
//                 <button
//                     onClick={() => setRotation(rotation + theta)}
//                     className="absolute left-[15%] top-1/2 -translate-y-1/2 z-20 
//                         bg-white/10 hover:bg-white/20 text-white rounded-full p-2
//                         transition-all duration-200"
//                 >
//                     <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 19l-7-7 7-7"
//                         />
//                     </svg>
//                 </button>

//                 <button
//                     onClick={() => setRotation(rotation - theta)}
//                     className="absolute right-[5%] top-1/2 -translate-y-1/2 z-20 
//                         bg-white/10 hover:bg-white/20 text-white rounded-full p-2
//                         transition-all duration-200"
//                 >
//                     <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 5l7 7-7 7"
//                         />
//                     </svg>
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Carousel;






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
        <div className="flex items-center justify-center min-h-screen bg-black">
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
                                        className={`absolute top-1/5 left-[45%] -translate-x-1/2 -translate-y-1/2 ${isActive ? 'z-10' : 'z-0'
                                            }`}
                                    >
                                        <MovieCard
                                            movie={item}
                                            isActive={isActive}
                                            isFavorite={favorites.includes(item.title)}
                                            onFavoriteToggle={() => handleFavoriteToggle(item)}
                                        />
                                    </motion.div>

                                    {/* Button Section */}
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleFavoriteToggle(item)}
                                            className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
                                                favorites.includes(item.title)
                                                    ? 'bg-red-600 text-white hover:bg-red-500'
                                                    : 'bg-gray-600 text-white hover:bg-gray-500'
                                            }`}
                                        >
                                            {favorites.includes(item.title)
                                                ? 'Remove from Favorites'
                                                : 'Add to Favorites'}
                                        </button>
                                    </div>
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
