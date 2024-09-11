const express = require("express");
const authController = require('../controllers/auth');
const isLoggedIn = require('../middleware/isLoggedIn'); // Import the isLoggedIn middleware

const router = express.Router();

// Route for registration
router.post('/register', authController.register);

// Route for login
router.post('/login', authController.login);

// Route for updating profile
router.post('/update-profile', isLoggedIn, authController.updateProfile); // Protect this route with isLoggedIn

// Route for logout
router.get('/logout', (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 1 * 1000), // Set expiry to a past date to clear the cookie
        httpOnly: true
    });
    res.redirect('/');
});

module.exports = router;
