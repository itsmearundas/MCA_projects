const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gd_platform', // Ensure this matches your database name
});

db.connect(err => {
    if (err) {
        console.log('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL!');
    }
});

// Fetch all users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// Handle user registration
app.post('/api/user_registration', (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Insert user into the database
    db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email already exists.' });
                }
                console.error('Database Error:', err);
                return res.status(500).send(err);
            }
            res.json({
                message: 'User registered successfully.',
                user: {
                    id: result.insertId,
                    name,
                    email,
                },
            });
        }
    );
});

app.post('/api/user_login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (err, results) => {
            if (err) {
                console.error('Database Error:', err);
                return res.status(500).send(err);
            }

            if (results.length > 0) {
                res.json({
                    message: 'Login successful!',
                    user: {
                        id: results[0].id,
                        name: results[0].name,
                        email: results[0].email,
                    },
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password.' });
            }
        }
    );
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
