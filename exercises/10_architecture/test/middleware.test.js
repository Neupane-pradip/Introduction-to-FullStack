/**
 * Remember, that these tests do not cover the application as a whole,
 * only one exercise. Make sure that the whole application still works.
 */

const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

const request = require('supertest');
const express = require('express');
const session = require('express-session');
const filePath = path.join(__dirname, '../middleware', 'sessionAuthMiddleware.js');

describe('Ex4 - Middleware', () => {
    describe('sessionAuthMiddleware.js', () => {
        it('should exist', () => {
            expect(fs.existsSync(filePath)).to.be.true;
        });

        it('should export a function', () => {
            expect(fs.existsSync(filePath)).to.be.true;
            const middlewareModule = require(filePath);
            expect(middlewareModule).to.be.a('function');
        });
    });

    describe('Session authentication middleware', () => {
        let app;

        before(() => {
            app = express();
            app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
            if(fs.existsSync(filePath)) {
                const middlewareModule = require(filePath);
                app.use(middlewareModule);
            }
            app.get('/protected', (req, res) => res.send('Protected route'));
        });

        it('should redirect to /login if session does not exist', (done) => {
            request(app)
                .get('/protected')
                .expect('Location', '/login')
                .expect(302, done);
        });

        it('should redirect to /login if session exists but user is null', (done) => {
            const agent = request.agent(app);
            agent
                .get('/protected')
                .set('Cookie', 'connect.sid=s%3AtestSession')
                .expect('Location', '/login')
                .expect(302, done);
        });
    });
});
