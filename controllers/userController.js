const bcrypt = require('bcryptjs'); // Import bcrypt
const db = require('../app'); // Import the db connection from app.js

// Get user profile information
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const [user] = await req.db.query('SELECT name, email FROM users WHERE id = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).send('User not found');
        }

        res.render('profile', { user: user[0], isLoggedIn: true });
    } catch (error) {
        console.error('Error fetching user profile: ', error);
        res.status(500).send('Server Error');
    }
};

// Function to handle profile update
exports.updateProfile = async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;
    const userId = req.user.id;

    try {
        if (password && password !== passwordConfirm) {
            req.flash('error_msg', 'Passwords do not match');
            return res.redirect('/profile');
        }

        let updateQuery = 'UPDATE users SET name = ?, email = ?';
        const queryParams = [name, email];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 8);
            updateQuery += ', password = ?';
            queryParams.push(hashedPassword);
        }

        updateQuery += ' WHERE id = ?';
        queryParams.push(userId);

        await req.db.query(updateQuery, queryParams);
        req.flash('success_msg', 'Profile updated successfully');
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile: ', error);
        req.flash('error_msg', 'Error updating profile');
        res.redirect('/profile');
    }
};
