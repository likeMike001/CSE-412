const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { spawn } = require('child_process');
const path = require('path')


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


app.get('/api/recommendations/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const { limit = 7, type = 'general' } = req.query; // Add type parameter

        const python = spawn('python', [
            path.join(__dirname, 'recommender_service', 'recommend.py'),
            title,
            limit,
            type  // Pass the recommendation type to Python script
        ]);

        let recommendations = '';

        python.stdout.on('data', (data) => {
            recommendations += data.toString();
        });

        python.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        python.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: 'Failed to get recommendations' });
            }
            try {
                const results = JSON.parse(recommendations);
                res.json(results);
            } catch (error) {
                res.status(500).json({ error: 'Failed to parse recommendations' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// actor end point 
app.get('/api/recommendations/actor/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const { limit = 7 } = req.query;

        const python = spawn('python', [
            path.join(__dirname, 'recommender_service', 'recommend.py'),  // Corrected path
            name,
            limit.toString(),  
            'actor'
        ]);

        let recommendations = '';

        python.stdout.on('data', (data) => {
            recommendations += data.toString();
        });

        python.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        python.on('close', (code) => {
            try {
                const results = JSON.parse(recommendations);
                if (results.error) {
                    return res.status(404).json(results);
                }
                res.json(results);
            } catch (error) {
                res.status(500).json({ error: 'Failed to parse recommendations' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// genre end point 
app.get('/api/recommendations/genre/:genre', async (req, res) => {
    try {
        const { genre } = req.params;
        const { limit = 7 } = req.query;

        const python = spawn('python', [
            path.join(__dirname, 'recommender_service', 'recommend.py'),
            genre,
            limit.toString(),
            'genre'
        ]);

        let recommendations = '';

        python.stdout.on('data', (data) => {
            recommendations += data.toString();
        });

        python.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        python.on('close', (code) => {
            try {
                const results = JSON.parse(recommendations);
                if (results.error) {
                    return res.status(404).json(results);
                }
                res.json(results);
            } catch (error) {
                res.status(500).json({ error: 'Failed to parse genre recommendations' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// AmericanPsycho