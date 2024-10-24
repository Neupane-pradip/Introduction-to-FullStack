const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, exportUsers } = require('../app');
const { expect } = chai;

chai.use(chaiHttp);
let agent;
let visitor;

describe('User Management', () => {

    beforeEach(async () => {
        agent = chai.request.agent(app);
        visitor = chai.request.agent(app);
        await agent
        .post('/login')
        .send({ email: 'test@test.com', password: 'secret1' });
    });

    afterEach(() => {
        agent.close();
        visitor.close();
    });

    it('should not authenticate unknown users', async () => {
        const res = await visitor
        .post('/login');

        expect(res).to.redirectTo(/\/login/);
        expect(res.text).to.include('These credentials do not match our records.');
    });

    it('should not accept incorrect login details', async () => {
        const res = await visitor
        .post('/login')
        .send({ email: 'test@test.com', password: '1337Haxxor!' });

        expect(res).to.redirectTo(/\/login/);
        expect(res.text).to.include('These credentials do not match our records.');
    });

    it('should log in when given correct details', async () => {
        //Make sure agent is logged out, since agents maintain their state
        await agent.post('/logout');

        const res = await agent
        .post('/login')
        .send({ email: 'test@test.com', password: 'secret1' });

        expect(res).to.have.status(200);
        expect(res).to.redirectTo(/\/events/);
    });

    it('should log the user out', async () => {
        const res = await agent
        .post('/logout');

        expect(res).to.have.status(200);
        expect(res).to.redirectTo(/\/login/);
    });

    it('should show a form for creating a new user', async () => {
        const res = await chai
        .request(app)
        .get('/register');

        expect(res).to.have.status(200);
        expect(res.text).to.include('Register a new user');
    });
});
