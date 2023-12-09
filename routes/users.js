/*
handling server client interactions @ /users
*/


const express = require('express');  // server
const User = require('../models/user');  // for user data model

const router = express.Router();  // create router from express

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* new user registration
first param to router is path, second is middleware function*/
router.post('/signup', (req, res, next) => {
    // db.collection.findOne(query, projection, options) / check for user in system
    User.findOne({ username: req.body.username })
        // returns a promise because its talking to mongo
        // 
        .then(user => {
            if (user) {
                const err = new Error(`User ${req.body.username} already exists`);
                err.status = 403;
                return next(err);  // pass error to express and skip following middleware
            } else {
                // create a new user record
                User.create({
                    username: req.body.username,
                    password: req.body.password
                })
                    // .create return should be new user doc
                    // now for user do
                    .then(user => {
                        // send response:
                        res.statusCode = 200;  // success
                        res.setHeader('Content-Type', 'application/json')
                        res.json({ status: 'Registration Successful', user: user })
                    })
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err));
});

// post to /users/login
router.post('/login', (req, res, next) => {
    // check for login via session cookie user
    if (!req.session.user) {
        const authHeader = req.headers.authorization;  // pull auth header
        if (!authHeader) {  // if there is not one...
            const err = new Error('User data not found');  // reject loudly
            res.setHeader('WWW-Authenticate', 'Basic');  // request re-auth
            err.status = 401;
            return next(err);
        }  // continue >
        // parse auth header to to array of user and password as text string
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = auth[0];
        const password = auth[1];

        User.findOne({username: username})
        .then(user => {
            if (!user) {
                const err = new Error(`User ${username} does not exist`);
                err.status = 401;
                return next(err);
            } else if (user.password !== password) {
                const err = new Error('Your password is incorrect');
                err.status = 401;
            } else if ( user.username === username && user.password === password ) {
                req.session.user = 'authenticated'
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You are authenticated');
            }
        })
        .catch(err => next(err));
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated');
    }
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