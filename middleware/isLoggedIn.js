const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


module.exports = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                req.user = decodedToken; // Attach the user information to the request
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};

const isLoggedIn = (req, res, next) => {
    try {
        if (req.cookies.jwt) {
            jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err) {
                    console.log(err);
                    res.locals.isLoggedIn = false;
                    req.user = null; // Ensure req.user is set to null if not authenticated
                    next();
                } else {
                    res.locals.isLoggedIn = true;
                    req.user = { id: decodedToken.id }; // Set req.user with the decoded token's ID
                    next();
                }
            });
        } else {
            res.locals.isLoggedIn = false;
            req.user = null; // Ensure req.user is set to null if not authenticated
            next();
        }
    } catch (err) {
        console.log(err);
        res.locals.isLoggedIn = false;
        req.user = null; // Ensure req.user is set to null if an error occurs
        next();
    }
};

module.exports = isLoggedIn;
