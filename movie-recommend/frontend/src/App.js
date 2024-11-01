import React, { useState } from "react";
import MovieList from "./components/movielist/movie.list.component";
import SearchBar from "./components/searchbar/searchbar.component";
import './App.css'
function App() {
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

  return (
    <div className="app-container">
      <header className="app-header">
        {/* <h1>Movie Recommender</h1> */}
        <SearchBar onSearch={handleSearch} />
      </header>
      <main>
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
      </main>
    </div>
  );
}

export default App;