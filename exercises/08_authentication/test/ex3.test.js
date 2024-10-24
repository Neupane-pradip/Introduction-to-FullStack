const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, exportUsers } = require('../app');
const { expect } = chai;

chai.use(chaiHttp);
let agent;
let visitor;

describe('Registering users (8.3)', () => {

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

    it('should validate user details', async () => {
        const res = await visitor
        .post('/register');

        expect(res).to.have.status(200);
        expect(res.text).to.include('Name is required!');
        expect(res.text).to.include('Email is required!');
        expect(res.text).to.include('Password is required!');
    });

    /**
     * In these last two tests, notice a minute detail:
     * this first test uses chai.request(app).post(...)
     * while the second uses visitor.post(...)
     * 
     * There's a small, but important difference:
     * agents maintain state and the validation errors are stored inside the session!
     * chai.request(app).. cannot show validation details out of the session,
     * (unless you manually send the session cookie using HTTP headers)
     * visitor.post... maintains the session and even though visitor
     * is NOT a logged in user, we can still use the session to store, e.g., validation errors
     * 
     * But! Always using agents consumes extra resources and may sometimes
     * hide the true cause of some hard-to-find bug, as there may be, for example,
     * several redirects happening, etc. Not using agents may sometimes force the
     * potential errors to surface more quickly.
     */
    it('should persist a new user', async () => {
        const user = { name: 'User From Test', email: 'user_from_test@example.com', password: 'TestPass' };
        const res = await chai
        .request(app)
        .post('/register')
        .send(user);

        expect(res).to.have.status(200);
        expect(res).to.redirectTo(/\//);

        //Make sure the user got persisted
        const users = exportUsers();
        const found = users.find(u => u.name === user.name);
        expect(found).to.not.equal(undefined);

        //Make sure the user got the correct role
        expect(found.role).to.not.equal(undefined);
        expect(found.role).to.equal('user');

        //Make sure something was done to the password
        expect(found.password).to.not.equal(undefined);
        expect(found.password).to.not.equal('TestPass');
    });

    it('should not allow two users with same email', async () => {
        const user = { name: 'Another User With Same Email', email: 'user_from_test@example.com', password: 'TestPass' };
        const res = await visitor
        .post('/register')
        .send(user);

        expect(res).to.have.status(200);
        expect(res.text).to.include('Email is already in use!');
        const users = exportUsers();
        const found = users.find(u => u.name === user.name);
        expect(found).to.equal(undefined);
    });
});
