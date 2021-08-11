const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    }
});

/**
 * Passport-Local-Mongoose :
 * Adds username, hash + salt field to store username
 * Password is also added and hashed+salted 
 * in the UserSchema. 
 * Note : This also adds methods to the schema through passport-local-mongoose
 * */ 
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);


