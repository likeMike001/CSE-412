import React, { useState } from 'react';
import './helper.css';

const Helper = () => {
    const [title, setTitle] = useState('');
    const [newExtract, setNewExtract] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
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

    return (
        <div className="helper-container">
            <h1>Edit Movie Extract</h1>

            <form onSubmit={handleSubmit}>
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
    );
};

export default Helper;
