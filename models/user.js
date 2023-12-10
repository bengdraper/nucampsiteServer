/*
user.js
just a mongoose model mudule
 */

const passportLocalMongoose = require('passport-local-mongoose');  // for user auth
// const Schema = mongoose.Schema;
const mongoose = require('mongoose');  // for user data db schema
// const userSchema = new Schema({
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    }
});

// activate passport - adds a selection of passport methods to model
userSchema.plugin(passportLocalMongoose);

// mongoose names new model 'user' after 'User' specified, use userSchema above
// model(name, schema)

// User = mongoose.model('User', userSchema)
// module.exports = User;

module.exports = mongoose.model('User', userSchema);