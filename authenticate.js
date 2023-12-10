/*
authenticate.js
manage auth functions
*/

const passport = require('passport')  // for auth obv
const LocalStrategy = require('passport-local').Strategy;  // also for auth, obv
const User = require('./models/user');  // give passport something to work with

//  add strategy plugin to passport implementation; call auth funciton on
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());