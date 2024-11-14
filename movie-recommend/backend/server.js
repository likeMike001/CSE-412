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
            LIMIT 20
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
        const { limit = 7, type = 'general' } = req.query; 

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


// user registration 

app.post('/api/auth/register', async(req,res) =>{
    try{
        const {first_name , last_name} = req.body;
        const newUser = await pool.query('INSERT INTO USERS (first_name,last_name,favourites) VALUES ($1,$2,$3) RETURNING *',
            [first_name , last_name , '[]']
        );
        res.join(newUser.rows[0]);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});

// user - profiles 

app.post('/api/users/:userId', async(req,res) => {
    try{
        const {userId} = req.params;
        const user = await pool.query('SELECT * FROM USERS WHERE user_id = $1',[userId]);

        if(user.rows.length === 0){
            return res.status(404).json({error : "User not found :("});
        }
        res.json(user.rows[0]);
    }catch(err){
        res.status(500).json({error : err.message});
    }
})


// adding movies to favourites 

app.post('/api/users/:userId/favorites', async(req,res) => {
    try{
        const {userId} = req.params;
        const {movieTitle} = req.body;

        const userResult = await pool.query('SELECT favourites FROM USERS WHERE user_id = $1' , [userId]);

        if(userResult.rows.length === 0){
            return res.status(404).json({error : "user not found :("});
        }

        let favorites = JSON.parse(userResult.rows[0].favorites || '[]');
        if (!favorites.includes(movieTitle)) {
            favorites.push(movieTitle);
          
            // updating favorites in the db 
            const updateResult = await pool.query(
                'UPDATE USERS SET favourites = $1 WHERE user_id = $2 RETURNING *',
                [JSON.stringify(favorites), userId]
            );
            res.json(updateResult.rows[0]);
        } else {
            res.json({ message: "Movie already in favorites" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove movie from favourites
app.delete('/api/users/:userId/favorites/:movieTitle', async (req, res) => {
    try {
        const { userId, movieTitle } = req.params;
        
        // getting the curr favorites 
        const userResult = await pool.query(
            'SELECT favourites FROM USERS WHERE user_id = $1',
            [userId]
        );
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
         // parsing and updating the favorites 
        let favorites = JSON.parse(userResult.rows[0].favourites || '[]');
        favorites = favorites.filter(title => title !== movieTitle);
        
        // updating the db 
        const updateResult = await pool.query(
            'UPDATE USERS SET favourites = $1 WHERE user_id = $2 RETURNING *',
            [JSON.stringify(favorites), userId]
        );
        
        res.json(updateResult.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get users  favorites
app.get('/api/users/:userId/favorites', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query('SELECT favourites FROM USERS WHERE user_id = $1', [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const favorites = JSON.parse(result.rows[0].favourites || '[]');
        res.json({ favorites });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// AmericanPsycho