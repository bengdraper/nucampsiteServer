const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');  // for session storage
// call filestore return function with session as return value
const FileStore = require('session-file-store')(session);  // to store session to file
const passport = require('passport');  // for auth
const authenticate = require('./authenticate.js');  // also for auth

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users')
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

//  for session base auth...
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// tag router paths
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', auth, campsiteRouter)
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

// authentication
function auth(req, res, next) {
    console.log(req.user)  // debug

    if (!req.user) {
        const err = new Error('You are not authenticated');
        err.status = 401;
        return next(err);

    } else {
        return next();
    }
}
// };

module.exports = app;