var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');  // for session storage
// call filestore return function with session as return value
const FileStore = require('session-file-store')(session);  // to store session to file

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users')
const campsiteRouter = require('./routes/campsiteRouter')
const promotionRouter = require('./routes/promotionRouter')
const partnerRouter = require('./routes/partnerRouter')

const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/nucampsite';

const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
    // family: 4
});

connect.then(() => console.log('Connected to server'),
    err => console.log(err)
)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));

// call session middleware
app.use(session({
    name: 'session-id',  // can be any
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,  // clear session if no data change/aka don't save empty cookies
    resave: false,  // save on all req. /i.e. keep session active
    store: new FileStore()  // create new FileStore for data storage
}));

// authentication
function auth(req, res, next) {
    console.log(req.session)  // session adds 'session' prop to req.

    if(!req.session.user) {  // in case no session.user

        const authHeader = req.headers.authorization;  // pull auth header
        if (!authHeader) {  // if there is not one...
            const err = new Error('User data not found');  // reject loudly
            res.setHeader('WWW-Authenticate', 'Basic');  // request re-auth
            err.status = 401;
            return next(err);
        }  // continue >

        // parse auth header to to array of user and password as text string
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const user = auth[0];
        const pass = auth[1];
        // deal with validation
        if (user === 'admin' && pass === 'password') {
            req.session.user = 'admin';  // set session user
            // res.cookie('user', 'admin', {signed: true});
            return next();  // continue >
        } else {
            // error response with re-auth challenge
            const err = new Error('Invalid user data');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err)
        }
    } else {
        if(res.session.user === 'admin') {  // if session.user is good
        // if (req.signedCookies.user === 'admin') {  // if name property of cookie is admin
            return next();
        } else {
            // error response
            const err = new Error('Invalid user data');
            err.status = 401;
            return next(err)
        }
    }
};
// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

// tag router paths
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', auth, campsiteRouter )
app.use('/promotions', auth, promotionRouter)
app.use('/partners', auth, partnerRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;