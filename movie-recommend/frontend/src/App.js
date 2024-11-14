import React, { useState } from "react";
import MovieList from "./components/movielist/movie.list.component";
import SearchBar from "./components/searchbar/searchbar.component";
// import Register from "./components/register.component"; // Import Register
import Register from "./components/auth/register";
import './App.css';

function App() {
  const [isRegistered, setIsRegistered] = useState(false); // Tracks if the user has signed up
  const [searchParams, setSearchParams] = useState({
    term: '',
    type: 'genre'
  });
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (searchTerm, searchType) => {
    setSearchParams({
      term: searchTerm,
      type: searchType
    });
    setHasSearched(true);
  };

  const handleRegistrationSuccess = () => {
    setIsRegistered(true); // Update state when the user successfully registers
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Movie Recommender</h1>
      </header>
      <main>
        {!isRegistered ? (
          // Render Register component until the user signs up
          <Register onRegisterSuccess={handleRegistrationSuccess} />
        ) : (
          // Render the SearchBar and MovieList after registration
          <>
            <SearchBar onSearch={handleSearch} />
            {hasSearched ? (
              <MovieList 
                searchTerm={searchParams.term}
                searchType={searchParams.type}
              />
            ) : (
              <div className="welcome-message">
                <h2>Welcome to Movie Recommender</h2>
                <p>Search for movies by genre or actor to get started!</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
