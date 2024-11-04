const mongoose = require('./../mongoose');
const bcrypt = require('bcrypt');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        validate: {
            validator: function(email) {
                return emailRegex.test(email);
            },
            message: 'Please fill a valid email address!'
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        validate: {
            validator: function(password) {
                // Only validate password length if it's not hashed
                if (this.isModified('password')) {
                    return password.length >= 6;
                }
                return true;
            },
            message: 'Password needs to be at least 6 characters long!'
        }
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'user'],
            message: 'Invalid role!'
        },
        default: 'user'
    }
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified or is new
    if (!this.isModified('password')) return next();
    
    try {
        // Hash password with bcrypt
        const salt = await bcrypt.hash(this.password, 10);
        this.password = salt;
        next();
    } catch (error) {
        next(error);
    }
});

// Post-save hook to handle duplicate email errors
userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        const validationError = new mongoose.Error.ValidationError();
        validationError.errors.email = new mongoose.Error.ValidatorError({
            message: 'Email is already in use!',
            path: 'email',
            value: doc.email
        });
        next(validationError);
    } else {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;