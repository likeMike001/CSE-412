import { useState, useEffect } from 'react';

const FavoritesList = ({ userId }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}/favorites`);
      const data = await response.json();
      setFavorites(data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const removeFavorite = async (movieTitle) => {
    try {
      await fetch(`http://localhost:3001/api/users/${userId}/favorites/${movieTitle}`, {
        method: 'DELETE'
      });
      fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div>
      <h2>My Favorite Movies</h2>
      <div className="favorites-grid">
        {favorites.map((movieTitle) => (
          <div key={movieTitle} className="favorite-item">
            <span>{movieTitle}</span>
            <button onClick={() => removeFavorite(movieTitle)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;