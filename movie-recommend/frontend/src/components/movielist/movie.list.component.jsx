import React, { useEffect, useState } from 'react';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from your backend
        fetch('http://localhost:3001/api/movies')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setMovies(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading movies...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Movies</h1>
            <ul>
                {movies.map((movie) => (
                    <li key={movie.id}>
                        <h2>{movie.title}</h2>
                        <p>Genre: {movie.genre}</p>
                        <p>Release Year: {movie.year}</p>
                        <p>Extract: {movie.extract}</p>
                        {/* <img>Poster : src ={movie.thumbnail}</img> */}
                        <img src={movie.thumbnail} alt={`${movie.title} Poster`} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MovieList
