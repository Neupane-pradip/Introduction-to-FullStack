const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, exportEvents } = require('../app');
const { expect } = chai;

chai.use(chaiHttp);
let agent;

describe('Event Management', () => {
    let eventId;

    //Agent allows to maintain state across multiple tests
    //Normally, we might not want to log in and out between each test,
    //but not doing so might make it difficult for students to implement
    //features one-by-one
    beforeEach(async () => {
        agent = chai.request.agent(app);
        await agent
        .post('/login')
        .send({ email: 'test@test.com', password: 'secret1' });
    });

    //Agents must be closed, otherwise the Node.js server will not close
    afterEach(() => {
        agent.close();
    });

    it('should not accept events from unknown users', async () => {
        const res = await chai
        .request(app)
        .post('/events')
        .send({ name: 'Should not show', date: 'Oct 8, 2024' });

        expect(res).to.redirectTo(/\/login/);
        const events = exportEvents();
        const event = events.find(e => e.name === 'Should not show');
        expect(event).to.not.exist;
    });

    it('should log in when given correct details', async () => {
        const res = await agent
        .post('/login')
        .send({ email: 'test@test.com', password: 'secret1' });

        expect(res).to.have.status(200);
        expect(res).to.redirectTo(/\/events/);
    });

    it('should not accept events without details', async () => {
        const res = await agent
        .post('/events')
        .send({ name: '', date: '' });

        expect(res).to.have.status(200);
        expect(res.text).to.include('Name is required');
        expect(res.text).to.include('Date is required');
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

    it('should not list events to visitors', async () => {
        const res = await chai
        .request(app)
        .get('/events');

        expect(res).to.redirectTo(/\/login/);
    });

    it('should list all events', async () => {
        await agent
        .post('/events')
        .send({ name: 'New Event', date: 'Oct 8, 2024', description: 'Test Description' });

        const res = await agent
        .get('/events');

        expect(res).to.have.status(200);
        expect(res.text).to.include('Test Event');
        expect(res.text).to.include('New Event');
    });

    it('should not show a form to update a specific event to visitors', async () => {
        const res = await chai
        .request(app)
        .get(`/events/${eventId}`);

        expect(res).to.redirectTo(/\/login/);
    });

    it('should get a form to update a specific event', async () => {
        const res = await agent.get(`/events/${eventId}`);

        expect(res).to.have.status(200);
        expect(res.text).to.include(eventId);
        expect(res.text).to.include('Test Event');
        expect(res.text).to.include('Oct 8, 2024');
        expect(res.text).to.include('Planned');
    });

    it('should not allow event updates from strangers', async () => {
        const res = await chai
        .request(app)
        .post(`/events/${eventId}`)
        .send({ name: 'Updated Event', status: 'completed' });

        expect(res).to.redirectTo(/\/login/);

        const events = exportEvents();
        const event = events.find(e => e._id === eventId);
        expect(event).to.exist;
        expect(event.name).to.not.equal('Updated Event');
        expect(event.status).to.not.equal('completed');
    });

    it('should validate events when updating', async () => {
        const res = await agent
        .post(`/events/${eventId}`)
        .send({ status: 'completed' });

        expect(res).to.have.status(200);
        expect(res.text).to.include('Name is required!');
        expect(res.text).to.include('Date is required!');

        const events = exportEvents();
        const event = events.find(e => e._id === eventId);
        expect(event).to.exist;
        expect(event.name).to.equal('Test Event');
        expect(event.status).to.equal('planned');
    });

    it('should update an event', async () => {
        const res = await agent
        .post(`/events/${eventId}`)
        .send({ name: 'Updated Event', date: 'Oct 8, 2024', status: 'completed' });

        expect(res).to.have.status(200);
        expect(res).to.redirectTo(/\/events/);

        const events = exportEvents();
        const event = events.find(e => e._id === eventId);
        expect(event).to.exist;
        expect(event.name).to.equal('Updated Event');
        expect(event.status).to.equal('completed');
    });

    it('should not allow visitors to remove events', async () => {
        const res = await chai
        .request(app)
        .post(`/events/${eventId}/delete`);

        expect(res).to.redirectTo(/\/login/);

        const events = exportEvents();
        const event = events.find(e => e._id === eventId);
        expect(event).to.exist;
    });
});
