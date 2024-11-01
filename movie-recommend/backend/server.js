const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log("I am working");

// Routes
app.get('/api/movies', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                movie.title,
                movie.year,
                movie.thumbnail,
                movie.href,
                movie.extract,
                genre.genre_name,
                cast_member.actors

            FROM 
                movie
            LEFT JOIN 
                genre 
            ON 
                movie.title = genre.g_title
            LEFT JOIN 
                cast_member
            ON 
               movie.title = cast_member.c_title
        `);

        // Group the genres for each movie title
        const movies = {};
        result.rows.forEach(row => {
            const title = row.title;

            if (!movies[title]) {
                movies[title] = {
                    title: row.title,
                    year: row.year,
                    thumbnail: row.thumbnail,
                    href: row.href,
                    extract: row.extract,
                    genres: [],
                    actors:[]

                };
            }
             const genres = row.genre_name ? row.genre_name.split(',').map(g => g.trim()) : [];
             genres.forEach(genre => {
                 if (!movies[title].genres.includes(genre)) {
                     movies[title].genres.push(genre);
                 }
             });

             const actors = row.actors ? row.actors.split(',').map(a=>a.trim()) : [];
             actors.forEach(actor =>{
                if(!movies[title].actors.includes(actor)){
                    movies[title].actors.push(actor);
                }
             });
         });
        res.json(Object.values(movies));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Add a new movie
app.post('/api/movies', async (req, res) => {
    try {
        const { title, genre, release_year, rating, plot } = req.body;
        const result = await pool.query(
            'INSERT INTO movies (title, genre, release_year, rating, plot) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, genre, release_year, rating, plot]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});