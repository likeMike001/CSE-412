// import React, { useEffect, useState } from 'react';
// // import { Carousel } from '../carousel/carousel.component';
// import Carousel from '../carousel/carousel.component';

// const MovieList = ({ searchTerm, searchType }) => {
//     const [movies, setMovies] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchMovies = async () => {
//             setLoading(true);
//             try {
//                 let url = 'http://localhost:3001/api/movies';
                
//                 if (searchTerm) {
//                     if (searchType === 'actor') {
//                         url = `http://localhost:3001/api/recommendations/actor/${encodeURIComponent(searchTerm)}`;
//                     } else if (searchType === 'genre') {
//                         url = `http://localhost:3001/api/recommendations/genre/${encodeURIComponent(searchTerm)}`;
//                     }
//                 }

//                 const response = await fetch(url);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
//                 const data = await response.json();
          
//                 let movieArray;
//                 if (data.movies) {
                   
//                     movieArray = data.movies;
//                 } else if (Array.isArray(data)) {
//                     movieArray = data;
//                 } else {
//                     movieArray = [];
//                 }

//                 console.log('Processed movies:', movieArray);
//                 setMovies(movieArray);
//                 setError(null);
//             } catch (err) {
//                 console.error('Fetch error:', err);
//                 setError(err.message);
//                 setMovies([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMovies();
//     }, [searchTerm, searchType]);

//     if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Thinking....</p></div>;
//     if (error) return <div className="min-h-screen flex items-center justify-center"><p>Error: {error}</p></div>;
//     if (!movies || movies.length === 0) return <div className="min-h-screen flex items-center justify-center"><p>No movies found.</p></div>;

//     return <Carousel items={movies} />;
// };

// export default MovieList;

import React, { useEffect, useState } from 'react';
import Carousel from '../carousel/carousel.component';

const MovieList = ({ searchTerm, searchType }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                let url = 'http://localhost:3001/api/movies';

                // Dynamically construct the API URL based on search criteria
                if (searchTerm) {
                    if (searchType === 'actor') {
                        url = `http://localhost:3001/api/recommendations/actor/${encodeURIComponent(searchTerm)}`;
                    } else if (searchType === 'genre') {
                        url = `http://localhost:3001/api/recommendations/genre/${encodeURIComponent(searchTerm)}`;
                    }
                }

                console.log('Fetching movies from:', url);
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                // Ensure the data structure matches what the Carousel expects
                const movieArray = Array.isArray(data.movies) ? data.movies : Array.isArray(data) ? data : [];
                console.log('Processed movies:', movieArray);

                setMovies(movieArray);
                setError(null);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError(err.message);
                setMovies([]); // Clear movies on error
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [searchTerm, searchType]);

    // Conditional rendering for different states
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Thinking....</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Error: {error}</p>
            </div>
        );
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>No movies found.</p>
            </div>
        );
    }

    // Pass movies to Carousel component
    return <Carousel items={movies} />;
};

export default MovieList;

