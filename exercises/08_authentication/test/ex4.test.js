const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, exportEvents } = require('../app');
const { expect } = chai;

chai.use(chaiHttp);
let agent;

describe('Admin middleware (8.4)', () => {
    let eventId;

    beforeEach(async () => {
        agent = chai.request.agent(app);
        await agent
        .post('/login')
        .send({ email: 'test@test.com', password: 'secret1' });
    });

    afterEach(() => {
        agent.close();
    });

    it('should persist valid events', async () => {
        const res = await agent
        .post('/events')
        .send({ name: 'Test Event', date: 'Oct 8, 2024', description: 'Test Description' });

        expect(res).to.have.status(200);
        expect(res.text).to.include('Test Event');
        expect(res.text).to.include('Oct 8, 2024');
        expect(res.text).to.include('planned');

        const events = exportEvents();
        const event = events.find(e => e.name === 'Test Event');
        expect(event).to.exist;
        eventId = event._id;
    });

    it('should not allow normal users to remove events', async () => {
        const res = await agent
        .post(`/events/${eventId}/delete`);

        expect(res).to.redirectTo(/\/events/);

        const events = exportEvents();
        const event = events.find(e => e._id === eventId);
        expect(event).to.exist;
    });

    it('should allow admins to delete an event', async () => {
        let superagent = chai.request.agent(app);
        await superagent
        .post('/login')
        .send({ email: 'test2@test.com', password: 'secret2' });

        const res = await superagent
        .post(`/events/${eventId}/delete`);

        expect(res).to.have.status(200);

        const res2 = await superagent
        .get(`/events/${eventId}`);

        expect(res2).to.have.status(404);

        superagent.close();

        const events = exportEvents();
        const event = events.find(e => e._id === eventId);
        expect(event).to.not.exist;
    });
});
