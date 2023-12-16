/*
authenticate.js
manage auth functions
*/

const passport = require('passport')  // for auth obv
const LocalStrategy = require('passport-local').Strategy;  // also for auth, obv
const User = require('./models/user');  // give passport something to work with
const JwtStrategy = require('passport-jwt').Strategy;  // web tokens
const ExtractJwt = require('passport-jwt').ExtractJwt;  // web tokens
const jwt = require('jsonwebtoken');  // web tokens

const config = require('./config.js')  // auth key

//  add strategy plugin to passport implementation; call auth funciton on
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set up web token
exports.getToken = user => {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
}

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next()
    }
    const err = new Error('You do not have administrative permission') 
    err.status = 405;
    return next(err)
}