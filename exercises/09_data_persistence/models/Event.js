// Import Mongoose
const mongoose = require('mongoose');

// Define the Event Schema
const eventSchema = new mongoose.Schema({
    // Name: required string, 1-50 characters
    name: {
        type: String,
        required: [true, 'Name is required!'], // Custom error message if name is missing
        minlength: 1,  // Minimum length of 1 character
        maxlength: 50, // Maximum length of 50 characters
    },
    
    // Date: required string
    date: {
        type: String,
        required: [true, 'Date is required!'], // Custom error message if date is missing
    },
    
    // Status: optional string, limited to certain values, default 'planned'
    status: {
        type: String,
        enum: {
            values: ['planned', 'completed', 'cancelled', 'rejected'], // Accepted values
            message: 'Status must be either planned, completed, cancelled, or rejected!', // Custom error message
        },
        default: 'planned', // Default value if none provided
    },

    // Description: optional string
    description: {
        type: String,
    },
});

// Create and Export the Event Model
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
