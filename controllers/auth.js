// Importing Database to our controllers
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

// Function to handle user registration
exports.register = (req, res) => {
    console.log(req.body);

    // Getting from the form
    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        // Encrypting the password
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User Registered'
                });
            }
        });
    });
};

// Function to handle user login
exports.login = (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length === 0) {
            return res.render('login', {
                message: 'Email is not registered'
            });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login', {
                message: 'Incorrect password'
            });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Set expiresIn to '1h' (1 hour)
        res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('/tasks'); // Redirect to tasks page after login
    });
};

// Function to handle profile update
exports.updateProfile = (req, res) => {
    const { name, email } = req.body;

    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.user.id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/profile');
        }
    });
};

// Function to handle user logout
exports.logout = (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.redirect('/');
};
