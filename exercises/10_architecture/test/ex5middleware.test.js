/**
 * Remember, that these tests do not cover the application as a whole,
 * only one exercise. Make sure that the whole application still works.
 */

const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

describe('Ex5 - Middleware', () => {
    const filePath = path.join(__dirname, '../middleware', 'tokenAuthMiddleware.js');

    describe('tokenAuthMiddleware.js', () => {
        it('should exist', () => {
            expect(fs.existsSync(filePath)).to.be.true;
        });

        it('should export a function', () => {
            expect(fs.existsSync(filePath)).to.be.true;
            const middlewareModule = require(filePath);
            expect(middlewareModule).to.be.a('function');
        });
    });

    describe('JWT Middleware Test', () => {
        const secret = 'testsecret';
        let token;
        const app = express();
        if(fs.existsSync(filePath)) {
            const middlewareModule = require(filePath);
            app.use(middlewareModule);
        }
        app.get('/protected', (req, res) => res.send('Protected route'));

        before(() => {
            process.env.JWT_SECRET = secret;
            token = jwt.sign({ user: 'testuser' }, secret);
        });

        it('should allow access to protected route with valid token', (done) => {
            request(app)
                .get('/protected')
                .set('Authorization', `Bearer ${token}`)
                .expect(200, done);
        });

        it('should return 401 if token is missing', (done) => {
            request(app)
                .get('/protected')
                .expect(401)
                .expect(res => {
                    expect(res.body).to.have.property('message', 'Invalid token');
                })
                .end(done);
        });

        it('should return 401 if token is invalid', (done) => {
            request(app)
                .get('/protected')
                .set('Authorization', 'Bearer invalidtoken')
                .expect(401)
                .expect(res => {
                    expect(res.body).to.have.property('message', 'Access denied');
                })
                .end(done);
        });
    });
});
