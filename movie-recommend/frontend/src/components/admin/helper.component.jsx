
import React, { useState } from 'react';
import './helper.css';

const Helper = () => {
    const [title, setTitle] = useState('');
    const [newExtract, setNewExtract] = useState('');
    const [message, setMessage] = useState('');

    const [newMovie, setNewMovie] = useState({
        title: '',
        year: '',
        thumbnail: '',
        href: '',
        extract: '',
    });
    const [newMovieMessage, setNewMovieMessage] = useState('');

    const handleExtractSubmit = async (e) => {
        e.preventDefault();

        if (!title || !newExtract) {
            setMessage('Please provide both the title and the new extract!');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/admin/movies/${title}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ extract: newExtract }),
            });

            if (!response.ok) {
                throw new Error('Failed to update extract');
            }

            const result = await response.json();
            setMessage(`Extract updated successfully for "${result.updatedMovie.title}"!`);
            setTitle('');
            setNewExtract('');
        } catch (error) {
            setMessage(`Error updating extract: ${error.message}`);
        }
    };

    const handleNewMovieSubmit = async (e) => {
        e.preventDefault();

        const { title, year, thumbnail, href, extract } = newMovie;

        if (!title || !year || !thumbnail || !href || !extract) {
            setNewMovieMessage('All fields are required to add a new movie!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/admin/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMovie),
            });

            if (!response.ok) {
                throw new Error('Failed to add new movie');
            }

            const result = await response.json();
            setNewMovieMessage(`Movie "${result.movie.title}" added successfully!`);
            setNewMovie({
                title: '',
                year: '',
                thumbnail: '',
                href: '',
                extract: '',
            });
        } catch (error) {
            setNewMovieMessage(`Error adding new movie: ${error.message}`);
        }
    };

    const handleNewMovieChange = (e) => {
        const { name, value } = e.target;
        setNewMovie({ ...newMovie, [name]: value });
    };

    return (
        <div className="helper-container">
            <h1>Movie Management</h1>

            <div className="sections-container">
                {/* Edit Movie Extract Section */}
                <div className="section">
                    <h2>Edit Movie Extract</h2>
                    <form onSubmit={handleExtractSubmit}>
                        <div>
                            <label htmlFor="title">Movie Title:</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter movie title"
                            />
                        </div>
                        <div>
                            <label htmlFor="extract">New Extract:</label>
                            <textarea
                                id="extract"
                                value={newExtract}
                                onChange={(e) => setNewExtract(e.target.value)}
                                placeholder="Enter new extract"
                            />
                        </div>
                        <button type="submit">Update Extract</button>
                    </form>
                    {message && <p className={message.includes('Error') ? 'error' : ''}>{message}</p>}
                </div>

                {/* Add New Movie Section */}
                <div className="section">
                    <h2>Add New Movie</h2>
                    <form onSubmit={handleNewMovieSubmit}>
                        <div>
                            <label htmlFor="new-title">Title:</label>
                            <input
                                type="text"
                                id="new-title"
                                name="title"
                                value={newMovie.title}
                                onChange={handleNewMovieChange}
                                placeholder="Enter movie title"
                            />
                        </div>
                        <div>
                            <label htmlFor="year">Year:</label>
                            <input
                                type="number"
                                id="year"
                                name="year"
                                value={newMovie.year}
                                onChange={handleNewMovieChange}
                                placeholder="Enter release year"
                            />
                        </div>
                        <div>
                            <label htmlFor="thumbnail">Thumbnail URL:</label>
                            <input
                                type="text"
                                id="thumbnail"
                                name="thumbnail"
                                value={newMovie.thumbnail}
                                onChange={handleNewMovieChange}
                                placeholder="Enter thumbnail URL"
                            />
                        </div>
                        <div>
                            <label htmlFor="href">Details URL:</label>
                            <input
                                type="text"
                                id="href"
                                name="href"
                                value={newMovie.href}
                                onChange={handleNewMovieChange}
                                placeholder="Enter movie details URL"
                            />
                        </div>
                        <div>
                            <label htmlFor="extract">Extract:</label>
                            <textarea
                                id="extract"
                                name="extract"
                                value={newMovie.extract}
                                onChange={handleNewMovieChange}
                                placeholder="Enter movie extract"
                            />
                        </div>
                        <button type="submit">Add Movie</button>
                    </form>
                    {newMovieMessage && (
                        <p className={newMovieMessage.includes('Error') ? 'error' : ''}>{newMovieMessage}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Helper;
