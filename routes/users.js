const express = require('express');  // server
const User = require('../models/user');  // for user data model
const passport = require('passport');  // for auth
const authenticate = require('../authenticate');
const cors = require('./cors');

const router = express.Router();

/* get  users listing. */
router.get('/',cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
    User.find()
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => next(err))
});

/* new user registration
first param to router is path, second is middleware function*/
router.post('/signup', cors.corsWithOptions, (req, res) => {
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                user.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration Successful'});
                    });
                });
            }
        }
    );
});

// post to /users/login
router.post('/login',cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'Your are successfully logged in'});
    return next()
});

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');  // session-id is arb name choice
        res.redirect('/');  // redirects to /, not to users/
    } else {
        const err = new Error('You are not logged in');
        err.status = 401;
        return next(err);  // send error to express with next
    }
})

router.get('/whoami', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.send(req.user);
    console.log(req.user);
})

module.exports = router;