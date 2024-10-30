const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * 
 * This regular expression checks the following:
 *
 * Initial part: Can contain letters (uppercase and lowercase), numbers, dots, underscores, 
 * percent signs, plus signs, and hyphens.
 * 
 * @ symbol: Mandatory.
 * 
 * Domain part: Can contain letters, numbers, dots, and hyphens.
 * 
 * TLD part: Can contain letters and must be at least two characters long.
 * 
 * This regular expression covers most common email addresses, 
 * but it’s important to remember that no regular expression can 
 * fully guarantee the validity of all possible email addresses.
 * 
 */

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema({
    //TODO:
    // Fill in the schema
});


//TODO:
//add a pre save hook to user schema and hash the password field with bcrypt
//alternatively, a set-method on that field could be used

//TODO:
//add a post save hook to user schema. Check if the error is duplicate key error (11000).
//If it is, override that error with a ValidationError that has a ValidatorError for the email field

const User = mongoose.model('User', userSchema);

module.exports = User;
