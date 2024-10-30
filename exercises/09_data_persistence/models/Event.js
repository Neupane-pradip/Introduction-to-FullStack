const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    //TODO: Fill in the schema
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
