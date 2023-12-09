/*
user.js
just a mongoose model mudule
 */


// const Schema = mongoose.Schema;
const mongoose = require('mongoose');  // for user data db schema
// const userSchema = new Schema({
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});




// mongoose names new model 'user' after 'User' specified, use userSchema above
// model(name, schema)

// User = mongoose.model('User', userSchema)
// module.exports = User;

module.exports = mongoose.model('User', userSchema);