const express = require("express");
const path = require('path');
const mysql = require("mysql2/promise");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');

dotenv.config({ path: './.env' });

const app = express();

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware to set the database connection pool
app.use((req, res, next) => {
    req.db = pool;
    next();
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Setup session and flash messages
app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Middleware to use flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.set('view engine', 'hbs');
app.use(isLoggedIn);

// Create tables if they don't exist
const createTables = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("MYSQL Connected...");

        // Create users table if it doesn't exist
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            )
        `;

        // Create tasks table if it doesn't exist
        const createTasksTable = `
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;

        // Execute table creation queries
        await connection.query(createUsersTable);
        console.log("Users table created or already exists.");

        await connection.query(createTasksTable);
        console.log("Tasks table created or already exists.");

        connection.release();
    } catch (error) {
        console.error("Error creating tables: ", error);
    }
};

// Initialize the tables
createTables();

// Define Routes
app.use('/', require('./routes/pages')); 
app.use('/auth', require('./routes/auth')); 
app.use('/tasks', require('./routes/tasks'));

// Connect to port 3000
app.listen(3000, () => {
    console.log("Server started on port 3000!");
});
