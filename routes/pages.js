const express = require("express");
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn'); // Import the isLoggedIn middleware
const userController = require('../controllers/userController'); // Import the userController

// Home page route
router.get('/', isLoggedIn, async (req, res) => {
    try {
        if (res.locals.isLoggedIn) {
            const [tasks] = await req.db.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
            res.render('index', { isLoggedIn: true, tasks });
        } else {
            res.render('index', { isLoggedIn: false });
        }
    } catch (error) {
        console.error("Error fetching tasks: ", error);
        res.render('index', { isLoggedIn: false });
    }
});

// Registration page route
router.get('/register', (req, res) => {
    res.render('register');
});

// Login page route
router.get('/login', (req, res) => {
    res.render('login');
});

// Profile page route
router.get('/profile', isLoggedIn, userController.getProfile);

// Update profile page route
router.get('/profile/update', isLoggedIn, (req, res) => {
    res.render('profileUpdate', { isLoggedIn: true });
});

// Handle profile update form submission
router.post('/profile/update', isLoggedIn, userController.updateProfile);

// Logout route, which should perform the logout action and then redirect
router.get('/logout', (req, res) => {
    res.redirect('/auth/logout'); // Redirect to the logout route in auth.js
});

module.exports = router;
