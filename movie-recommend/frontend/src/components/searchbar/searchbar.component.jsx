import React, { useState } from 'react';
import './searchbar.css'; 

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('genre');

    const formatInput = (input) => {
        return input
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        const formattedTerm = formatInput(searchTerm.trim());
        onSearch(formattedTerm, searchType);
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="search-select"
                >
                    <option value="genre">Search by Genre</option>
                    <option value="actor">Search by Actor</option>
                </select>
                <input
                    type="text"
                    placeholder={`Enter ${searchType}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
