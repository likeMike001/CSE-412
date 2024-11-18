import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MovieList from "./components/movielist/movie.list.component";
import SearchBar from "./components/searchbar/searchbar.component";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import './App.css';

function App() {
    const isAuthenticated = () => {
        return localStorage.getItem('user') !== null;
    };

    const PrivateRoute = ({ children }) => {
        return isAuthenticated() ? children : <Navigate to="/login" />;
    };

    return (
        <Router>
            <div className="app-container">
                <header className="app-header">
                    <h1>Movie Recommender</h1>
                </header>
                <main>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route 
                            path="/search" 
                            element={
                                <PrivateRoute>
                                    <SearchPage />
                                </PrivateRoute>
                            } 
                        />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
const SearchPage = () => {
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
    );
};

export default App;