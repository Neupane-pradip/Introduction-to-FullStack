/**
 * Remember, that these tests do not cover the application as a whole,
 * only one exercise. Make sure that the whole application still works.
 */

require('./test-setup');

const chai = require('chai');
const { expect } = chai;
const bcrypt = require('bcrypt');

const User = require('../models/User');

describe('User Model', () => {
    it('should not save a user without any required details', async () => {
        const user = new User({});
        try {
            await user.save();
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.errors.email).to.exist;
            expect(error.errors.email.message).to.equal('Email is required!');
            expect(error.errors.name).to.exist;
            expect(error.errors.name.message).to.equal('Name is required!');
            expect(error.errors.password).to.exist;
            expect(error.errors.password.message).to.equal('Password is required!');
        }
    });

    it('should not save a user with too short password', async () => {
        const user = new User(
            { 
                name: 'Test User', 
                email: 'test@example.com', 
                password: '12345' 
            });
        try {
            await user.save();
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.errors.password).to.exist;
            expect(error.errors.password.message).to.equal('Password needs to be at least 6 characters long!');
        }
    });

    it('should limit what roles are allowed for a user', async () => {
        const user = new User(
            { 
                name: 'Test User', 
                email: 'test@example.com', 
                password: '123456',
                role: 'superuser'
            });
        try {
            await user.save();
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.errors.role).to.exist;
            expect(error.errors.role.message).to.equal('Invalid role!');
        }
    });

    it('should not save a user with a duplicate email', async () => {
        const user1 = new User({ name: 'Test User', email: 'test@example.com', password: '123456' });
        const user2 = new User({ name: 'Test User 2', email: 'test@example.com', password: '123456' });
        await user1.save();

        try {
            await user2.save();
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.errors.email).to.exist;
            expect(error.errors.email.message).to.equal('Email is already in use!');
        }
    });

    it('should save a new user if required data is provided', async () => {
        const user = new User({ name: 'Test User', email: 'test@example.com', password: '123456' });
        const savedUser = await user.save();

        expect(savedUser._id).to.exists;
        expect(savedUser.name).to.equal('Test User');
        expect(savedUser.email).to.equal('test@example.com');
    });

    it('should default to role of user for new users', async () => {
        const user = new User({ name: 'Test User', email: 'test@example.com', password: '123456' });
        const savedUser = await user.save();

        expect(savedUser.role).to.equal('user');
    });

    it('should save a valid user with a hashed password', async () => {
        const user = new User({ name: 'Test User', email: 'test@example.com', password: '123456' });
        const savedUser = await user.save();

        expect(savedUser.password).to.not.equal('123456');
        const isMatch = await bcrypt.compare('123456', savedUser.password);
        expect(isMatch).to.be.true;
    });
});
