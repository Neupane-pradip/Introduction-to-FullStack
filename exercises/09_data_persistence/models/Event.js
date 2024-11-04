const mongoose = require('./../mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minlength: 1,
        maxlength: 50
    },
    date: {
        type: String,
        required: [true, 'Date is required!']
    },
    status: {
        type: String,
        enum: {
            values: ['planned', 'completed', 'cancelled', 'rejected'],
            message: 'Status must be either planned, completed, cancelled, or rejected!'
        },
        default: 'planned'
    },
    description: String
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;