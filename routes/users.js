/*
handling server client interactions @ /users
*/
const express = require('express');  // server
const User = require('../models/user');  // for user data model
const passport = require('passport');  // for auth
const authenticate = require('../authenticate');

const router = express.Router();  // create router from express

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* new user registration
first param to router is path, second is middleware function*/
router.post('/signup', (req, res) => {
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        err => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful'});
                })
            }
        }
    )
});

// post to /users/login
router.post('/login', passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'Your are successfully logged in'});
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');  // session-id is arb name choice
        res.redirect('/');  // redirects to /, not to users/
    } else {
        const err = new Error('You are not logged in');  // create new error object w/message
        err.status = 401;  // set status code to error
        return next(err);  // send error to express with next
    }
})

module.exports = router;  // users.router?