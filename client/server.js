const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Replace with your MySQL password
    database: 'sample', // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database.');
});

// Registration Endpoint
app.post('/register', (req, res) => {
    const { firstName, middleName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'All required fields must be filled out.' });
    }

    const query = 'INSERT INTO user (firstName, middleName, lastName, email, password) VALUES (?, ?, ?, ?, ?)';
    const values = [firstName, middleName, lastName, email, password];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Error creating account. Please try again later.' });
        }
        res.json({ success: true, message: 'Account created successfully.' });
    });
});

// Endpoint for user login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM user WHERE email = ?';

    db.query(sql, [email], (error, results) => {
        if (error) {
            console.error('Error querying database: ', error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            const user = results[0];

            // Directly compare the provided password to the stored plain-text password
            if (user.password === password) {
                const token = 'your-jwt-token'; // Replace with actual token generation logic if needed
                return res.json({ token });
            } else {
                return res.status(401).send('Invalid email or password');
            }
        } else {
            return res.status(401).send('Invalid email or password');
        }
    });
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
