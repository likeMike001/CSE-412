const express = require('express');
require('dotenv').config();
const cors = require('cors');
const pool = require('./db');
const { spawn } = require('child_process');
const path = require('path');
const { error } = require('console');
const redis = require('redis');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Set up redis client
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://redis:6379'
});
redisClient.on('error', (err) => console.error('Redis error', err));
redisClient.connect();



const app = express();
const multer = require('multer');


// Middleware
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log("I am working");

// Routes
app.get('/api/movies', async (req, res) => {
    try {
        const cacheKey = 'movies:all';
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

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
                    actors: []

                };
            }
            const genres = row.genre_name ? row.genre_name.split(',').map(g => g.trim()) : [];
            genres.forEach(genre => {
                if (!movies[title].genres.includes(genre)) {
                    movies[title].genres.push(genre);
                }
            });

            const actors = row.actors ? row.actors.split(',').map(a => a.trim()) : [];
            actors.forEach(actor => {
                if (!movies[title].actors.includes(actor)) {
                    movies[title].actors.push(actor);
                }
            });
        });
        const movieArray = Object.values(movies);
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(movieArray));
        res.json(movieArray);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/recommendations/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const { limit = 7, type = 'general' } = req.query;

        const cacheKey = `rec:${type}:${title}:${limit}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

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
                redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
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

        const cacheKey = `rec:actor:${name}:${limit}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

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
                redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
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

        const cacheKey = `rec:genre:${genre}:${limit}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

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
                redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
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


// updated api for user - registration 
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, first_name, last_name, email, password } = req.body;

        const userExists = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const newUser = await pool.query(
            'INSERT INTO users (username, first_name, last_name, email, password_hash, favourites) VALUES ($1, $2, $3, $4, crypt($5, gen_salt(\'bf\')), $6) RETURNING user_id, username, first_name, last_name',
            [username, first_name, last_name, email, password, '[]']
        );

        res.json(newUser.rows[0])

    } catch (err) {
        console.error("Some wrong in the registration api - server.js");
        res.status(500).json({ error: err.message });
    }
});


// user login 
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await pool.query(
            'SELECT user_id, username, first_name, last_name, is_admin FROM users WHERE username = $1 AND password_hash = crypt($2, password_hash)',
            [username, password]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        res.json(user.rows[0]);
    } catch (err) {
        console.log("The error is coming from login - server js");
        res.status(500).json({ error: err.message });
    }
});


// getting user - profiles 
app.get('/api/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await pool.query(
            'SELECT user_id, username, first_name, last_name, favourites FROM users WHERE user_id = $1',
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// adding a movie to favorite 
app.post('/api/users/:username/favorites', async (req, res) => {
    try {
        const username = req.params.username;
        const { movieTitle } = req.body;

        if (!movieTitle) {
            return res.status(400).json({ error: "Movie title is required" });
        }

        // Check if user exists
        const userCheck = await pool.query('SELECT favourites FROM users WHERE username = $1', [username]);

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update favorites
        const updateResult = await pool.query(
            `UPDATE users 
             SET favourites = CASE 
                WHEN NOT favourites @> $1::jsonb 
                THEN COALESCE(favourites, '[]'::jsonb) || $1::jsonb
                ELSE favourites 
             END
             WHERE username = $2 
             RETURNING favourites`,
            [JSON.stringify(movieTitle), username]
        );

        res.json({
            success: true,
            message: updateResult.rows[0].favourites.includes(movieTitle)
                ? "Movie already in favorites"
                : "Movie added to favorites",
            favorites: updateResult.rows[0].favourites,
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete('/api/users/:username/favorites', async (req, res) => {
    try {
        const username = req.params.username;
        const { movieTitle } = req.body;

        if (!movieTitle) {
            return res.status(400).json({ error: "Movie title is required" });
        }

        console.log('Movie to remove:', movieTitle); // Debugging log

        // Check if user exists
        const userCheck = await pool.query('SELECT favourites FROM users WHERE username = $1', [username]);

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Remove movie from favourites
        const updateResult = await pool.query(
            `UPDATE users
             SET favourites = (
                 SELECT jsonb_agg(value)
                 FROM jsonb_array_elements(favourites) AS value
                 WHERE value != $1::jsonb
             )
             WHERE username = $2
             RETURNING favourites`,
            [JSON.stringify(movieTitle), username] // Fix: Use JSON.stringify for movieTitle
        );

        console.log('Update result:', updateResult.rows); // Debugging log

        if (updateResult.rows.length === 0) {
            return res.status(404).json({ error: "Failed to update favorites" });
        }

        res.json({
            success: true,
            message: "Movie removed from favorites",
            favorites: updateResult.rows[0].favourites,
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Internal server error" });
    }
});




// getting the user's favorites + with thumbnail 
app.get('/api/users/:username/favorites', async (req, res) => {
    try {
        const username = req.params.username; 

      
        const userResult = await pool.query('SELECT favourites FROM users WHERE username = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const favorites = userResult.rows[0].favourites || [];

        // If the user has no favorites, return an empty array
        if (favorites.length === 0) {
            return res.json({ success: true, favorites: [] });
        }

        const placeholders = favorites.map((_, index) => `$${index + 1}`).join(','); // Create placeholders for SQL query
        const movieResult = await pool.query(
            `SELECT title, year, thumbnail FROM movie WHERE title IN (${placeholders})`,
            favorites
        );

        res.json({
            success: true,
            favorites: movieResult.rows, 
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Internal server error" });
    }
});




// set up for file upload (image or avatar in our case lol)
const storage = multer.diskStorage({
    destination: './uploads/avatars',
    filename: (req, file, cb) => {
        cb(null, `user-${req.params.userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});


const upload = multer({ storage });

app.post('/api/users/:userId/avatar', upload.single('avatar'), async (req, res) => {
    try {
        const { userId } = req.params;
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        const result = await pool.query(
            'UPDATE users SET avatar_url = $1 WHERE user_id = $2 RETURNING *',
            [avatarUrl, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ avatar_url: avatarUrl });
    }
    catch (err) {
        console.log("error form avatar api - server.js");
        res.status(500).json({ error: err.message });
    }
});

app.use('/uploads', express.static('uploads'));





// getting admin analytics 
app.get('/api/admin/analytics', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                user_id,
                username,
                first_name,
                last_name,
                email,
                favourites, -- JSONB field
                created_at,
                EXTRACT(MONTH FROM created_at) as signup_month,
                EXTRACT(YEAR FROM created_at) as signup_year
            FROM users 
            WHERE is_admin = FALSE
            ORDER BY created_at DESC
        `);

        const analyticsData = result.rows.map(user => ({
            userId: user.user_id,
            username: user.username,
            fullName: `${user.first_name} ${user.last_name}`,
            email: user.email,
            favorites: user.favourites || [], // Use the JSONB field directly
            favoritesCount: (user.favourites || []).length,
            signupDate: user.created_at,
            signupMonth: user.signup_month,
            signupYear: user.signup_year,
        }));

        res.json({
            totalUsers: analyticsData.length,
            userData: analyticsData,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// deleting a user from the db - by admin 
app.delete('/api/admin/users/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const userCheck = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND is_admin = FALSE',
            [username]
        );

        if (userCheck.rows.length == 0) {
            return res.status(404).json({ error: "user not found " });
        }

        await pool.query('DELETE FROM users WHERE username = $1', [username]);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error("Error in deleting the user");
        res.status(500).json({ error: 'internal error looooool  :(' });
    }
});


app.put('/api/admin/users/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const { fullName, email, favorites } = req.body;

        // Validate required fields
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Prepare fields to update
        const updates = [];
        if (fullName) {
            const [firstName, ...lastNameParts] = fullName.split(' ');
            updates.push(`first_name = '${firstName}'`);
            updates.push(`last_name = '${lastNameParts.join(' ')}'`);
        }
        if (email) {
            updates.push(`email = '${email}'`);
        }
        if (favorites) {
            updates.push(`favourites = '${JSON.stringify(favorites)}'::jsonb`);
        }

        // If no fields to update, return an error
        if (updates.length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }

        // Build the SQL query dynamically
        const updateQuery = `
            UPDATE users
            SET ${updates.join(', ')}
            WHERE username = $1
            RETURNING user_id, username, first_name, last_name, email, favourites
        `;
        const updatedUser = await pool.query(updateQuery, [username]);

        res.json({
            success: true,
            message: "User details updated successfully",
            updatedUser: updatedUser.rows[0],
        });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: "Internal server error" });
    }
});


// api to update the extract from the admin side 

app.put('/api/admin/movies/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const { extract } = req.body;

        // Validate the required fields
        if (!title || !extract) {
            return res.status(400).json({ error: "Both title and extract are required" });
        }

        // Check if the movie exists in the 'movie' table
        const movieCheck = await pool.query(
            'SELECT * FROM movie WHERE title = $1',
            [title]
        );

        if (movieCheck.rows.length === 0) {
            return res.status(404).json({ error: "Movie not found" });
        }

        // Update the 'extract' field
        const updateQuery = `
            UPDATE movie
            SET extract = $1
            WHERE title = $2
            RETURNING title, year, thumbnail, href, extract
        `;
        const updatedMovie = await pool.query(updateQuery, [extract, title]);

        // Respond with the updated movie details
        res.json({
            success: true,
            message: "Movie extract updated successfully",
            updatedMovie: updatedMovie.rows[0],
        });
    } catch (err) {
        console.error("Error updating movie extract:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});



// planing to add an api for updating from admin - side 

// Add a new movie - only admin should be able to add this 
// app.post('/api/movies', async (req, res) => {
//     try {
//         const { title, genre, release_year, rating, plot } = req.body;
//         const result = await pool.query(
//             'INSERT INTO movies (title, genre, release_year, rating, plot) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//             [title, genre, release_year, rating, plot]
//         );
//         res.json(result.rows[0]);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });


// Add a new movie - only admin should be able to add this
app.post('/api/admin/movies', async (req, res) => {
    try {
        const { title, year, thumbnail, href, extract } = req.body;

        // Validate required fields
        if (!title || !year || !thumbnail || !href || !extract) {
            return res.status(400).json({ error: "All fields (title, year, thumbnail, href, extract) are required." });
        }

        // Check for duplicate movie title
        const movieCheck = await pool.query('SELECT * FROM movie WHERE title = $1', [title]);
        if (movieCheck.rows.length > 0) {
            return res.status(409).json({ error: "A movie with this title already exists." });
        }

        // Insert the new movie
        const result = await pool.query(
            `INSERT INTO movie (title, year, thumbnail, href, extract) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, year, thumbnail, href, extract]
        );

        // Respond with the newly created movie details
        res.status(201).json({
            success: true,
            message: "Movie added successfully.",
            movie: result.rows[0],
        });
    } catch (err) {
        console.error("Error adding new movie:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});



// AmericanPsycho

