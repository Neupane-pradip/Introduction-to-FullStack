/**
 * Remember, that these tests do not cover the application as a whole,
 * only one exercise. Make sure that the whole application still works.
 */

require('./test-setup');

const chai = require('chai');
const { expect } = chai;

const Event = require('../models/Event');

describe('Event Model', () => {
    it('should not save an event without any required details', async () => {
        const event = new Event({});
        try {
            await event.save();
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.errors.name).to.exist;
            expect(error.errors.name.message).to.equal('Name is required!');
            expect(error.errors.date).to.exist;
            expect(error.errors.date.message).to.equal('Date is required!');
        }
    });

    it('should limit the possible status of an event', async () => {
        const event = new Event({ name: "Test Event", date: "Oct 8, 2024", status: "Fuubar" });
        try {
            await event.save();
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.errors.status).to.exist;
            expect(error.errors.status.message).to.equal('Status must be either planned, completed, cancelled, or rejected!');
        }
    });

    it('should save a new event if required data is provided', async () => {
        const event = new Event({ name: "Test Event", date: "Oct 8, 2024" });
        const savedEvent = await event.save();

        expect(savedEvent._id).to.exists;
        expect(savedEvent.name).to.equal('Test Event');
        expect(savedEvent.date).to.equal('Oct 8, 2024');
        expect(savedEvent.status).to.equal('planned');
    });

    it('should save a custom status as long as its valid', async() => {
        const event = new Event({ name: "Test Event", date: "Oct 8, 2024", status: "completed" });
        const savedEvent = await event.save();

        expect(savedEvent.status).to.equal('completed');
    });

    it('should save description if such is provided', async () => {
        const event = new Event({ name: "Test Event", date: "Oct 8, 2024", description: "Fuubar event" });
        const savedEvent = await event.save();

        expect(savedEvent.description).to.equal('Fuubar event');
    });
});
