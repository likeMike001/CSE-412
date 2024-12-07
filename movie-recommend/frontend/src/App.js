import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MovieList from './components/movielist/movie.list.component';
import SearchBar from './components/searchbar/searchbar.component';
import Register from './components/auth/register';
import Login from './components/auth/login';
import LoadingAnimation from './components/animation/animation';
import UserMenu from './components/userMenu/usermenu';
import AdminDashBoard from './components/admin/admindashboard';
import UserFavorites from './components/userMenu/user.favorites';

import './App.css';

function App() {
    const [loading, setLoading] = useState(true);
    const [authenticatedUser, setAuthenticatedUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);

    const isAuthenticated = () => authenticatedUser !== null;

    const isAdmin = () => authenticatedUser && authenticatedUser.is_admin;

    const logout = () => {
        localStorage.removeItem('user');
        setAuthenticatedUser(null);
    };

    const PrivateRoute = ({ children, adminRequired = false }) => {
        if (!isAuthenticated()) {
            return <Navigate to="/login" />;
        }
        if (adminRequired && !isAdmin()) {
            return <Navigate to="/search" />;
        }
        return children;
    };

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <LoadingAnimation key="loading" />
            ) : (
                <Router>
                    <div className="app-container">
                        <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} authenticatedUser={authenticatedUser} logout={logout} />
                        <main>
                            <Routes>
                                <Route
                                    path="/login"
                                    element={<Login setAuthenticatedUser={setAuthenticatedUser} />}
                                />
                                <Route path="/register" element={<Register />} />
                                <Route
                                    path="/search"
                                    element={
                                        <PrivateRoute>
                                            <SearchPage />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/favorites"
                                    element={
                                        <PrivateRoute>
                                            <UserFavorites user={authenticatedUser} />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/admin"
                                    element={
                                        <PrivateRoute adminRequired={true}>
                                            <AdminDashBoard />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/"
                                    element={
                                        isAuthenticated() ? (
                                            <Navigate to={isAdmin() ? '/admin' : '/search'} />
                                        ) : (
                                            <Navigate to="/login" />
                                        )
                                    }
                                />
                            </Routes>
                        </main>
                    </div>
                </Router>
            )}
        </AnimatePresence>
    );
}

const Header = ({ isAuthenticated, isAdmin, authenticatedUser, logout }) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <header className="app-header">
            <h1 onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                Movie Recommender
            </h1>
            {isAuthenticated() && <UserMenu user={authenticatedUser} onLogout={logout} />}
        </header>
    );
};

const SearchPage = () => {
    const [searchParams, setSearchParams] = useState({
        term: '',
        type: 'genre',
    });
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = (searchTerm, searchType) => {
        setSearchParams({
            term: searchTerm,
            type: searchType,
        });
        setHasSearched(true);
    };

    return (
        <>
            <SearchBar onSearch={handleSearch} />
            {hasSearched ? (
                <MovieList searchTerm={searchParams.term} searchType={searchParams.type} />
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
