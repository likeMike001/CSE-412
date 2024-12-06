import React, { useEffect, useState } from 'react';
import './userfavorites.css';

const UserFavorites = ({ user }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/users/${user.username}/favorites`);

                if (!response.ok) {
                    throw new Error('Failed to fetch favorites');
                }

                const data = await response.json();
                setFavorites(data.favorites || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user.username]);

    if (loading) {
        return <div className="favorites-loading">Loading your favorites...</div>;
    }

    if (error) {
        return <div className="favorites-error">{error}</div>;
    }

    return (
        <div className="favorites-page">
            <h1>{user.first_name}'s Favorite Movies</h1>
            {favorites.length === 0 ? (
                <p className="no-favorites">You don't have any favorite movies yet.</p>
            ) : (
                <div className="favorites-grid">
                    {favorites.map((favorite) => (
                        <div key={favorite.title} className="favorite-card">
                            <div className="favorite-thumbnail">
                                <img
                                    src={favorite.thumbnail}
                                    alt={favorite.title}
                                    className="thumbnail-image"
                                />
                            </div>
                            <div className="favorite-details">
                                <h3>{favorite.title}</h3>
                                <p>Year: {favorite.year}</p>
                                <button
                                    className="details-button"
                                    onClick={() => alert(`More details about ${favorite.title} coming soon!`)}
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserFavorites;
