CREATE DATABASE movies_db;

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    release_year INTEGER,
    rating DECIMAL(3,1),
    plot TEXT
);

CREATE TABLE user_ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    movie_id INTEGER,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- Add an index for faster queries
CREATE INDEX idx_movies_title ON movies(title);