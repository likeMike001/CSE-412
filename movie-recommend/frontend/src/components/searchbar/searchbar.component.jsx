// import React, { useState } from 'react';
// import './searchbar.css'; 

// const SearchBar = ({ onSearch }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchType, setSearchType] = useState('genre');

//     const formatInput = (input) => {
//         return input
//             .toLowerCase()
//             .split(' ')
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(' ');
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!searchTerm.trim()) return;

//         const formattedTerm = formatInput(searchTerm.trim());
//         onSearch(formattedTerm, searchType);
//     };

//     return (
//         <div className="search-container">
//             <form onSubmit={handleSubmit} className="search-form">
//                 <select
//                     value={searchType}
//                     onChange={(e) => setSearchType(e.target.value)}
//                     className="search-select"
//                 >
//                     <option value="genre">Search by Genre</option>
//                     <option value="actor">Search by Actor</option>
//                 </select>
//                 <input
//                     type="text"
//                     placeholder={`Enter ${searchType}...`}
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="search-input"
//                 />
//                 <button type="submit" className="search-button">
//                     Search
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default SearchBar;
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('genre');

    const formatInput = (input) => {
        return input
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        const formattedTerm = formatInput(searchTerm.trim());
        onSearch(formattedTerm, searchType);
    };

    const containerStyle = {
        width: '100%',
        maxWidth: '600px',
        margin: '20px auto',
        padding: '0 20px',
    };

    const formStyle = {
        display: 'flex',
        gap: '10px',
    };

    const selectStyle = {
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #444',
        borderRadius: '25px',
        backgroundColor: '#222',
        color: '#f5f5f5',
        outline: 'none',
        transition: 'border-color 0.3s ease',
    };

    const selectHoverFocusStyle = {
        borderColor: '#ff6b00',
    };

    const inputStyle = {
        flex: 1,
        padding: '12px 20px',
        border: '2px solid #444',
        borderRadius: '25px',
        backgroundColor: '#222',
        color: '#f5f5f5',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.3s ease',
    };

    const inputFocusStyle = {
        borderColor: '#ff6b00',
    };

    const buttonStyle = {
        padding: '12px 24px',
        backgroundColor: '#ff6b00',
        color: '#fff',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    };

    const buttonHoverStyle = {
        backgroundColor: '#e65a00',
    };

    return (
        <div style={containerStyle}>
            <form
                onSubmit={handleSubmit}
                style={formStyle}
            >
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{
                        ...selectStyle,
                        ':hover': selectHoverFocusStyle,
                        ':focus': selectHoverFocusStyle,
                    }}
                >
                    <option value="genre">Search by Genre</option>
                    <option value="actor">Search by Actor</option>
                </select>
                <input
                    type="text"
                    placeholder={`Enter ${searchType}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        ...inputStyle,
                        ':focus': inputFocusStyle,
                    }}
                />
                <button
                    type="submit"
                    style={{
                        ...buttonStyle,
                        ':hover': buttonHoverStyle,
                    }}
                >
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
