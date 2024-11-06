/**
 * Remember, that these tests do not cover the application as a whole,
 * only one exercise. Make sure that the whole application still works.
 */

const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const express = require('express');

describe('Ex3 - Routes test', () => {
    const eventsFilePath = path.join(__dirname, '../routes', 'events.js');
    const usersFilePath = path.join(__dirname, '../routes', 'users.js');

    const getRoutes = (stack) => {
        const routes = [];
        stack.forEach(layer => {
            if (layer.route) {
                // Route layer
                layer.route.stack.forEach(routeLayer => {
                    routes.push({
                        path: layer.route.path,
                        method: routeLayer.method
                    });
                });
            } else if (layer.name === 'router' && layer.handle.stack) {
                // Router layer
                routes.push(...getRoutes(layer.handle.stack));
            }
        });
        return routes;
    };

    it('should have Event routes', () => {
        expect(fs.existsSync(eventsFilePath)).to.be.true;
        const app = express();
        const eventRoutes = require(eventsFilePath);
        app.use('/events', eventRoutes);
        const routes = getRoutes(app._router.stack);
        const expectedRoutes = [
            { path: '/events', method: 'get' },
            { path: '/events/create', method: 'get' },
            { path: '/events', method: 'post' },
            { path: '/events/:id', method: 'get' },
            { path: '/events/:id', method: 'post' },
            { path: '/events/:id/delete', method: 'post' }
        ];
        expectedRoutes.forEach(route => {
            expect(routes).to.deep.include(route);
        });
    });

    it('should have User routes', () => {
        expect(fs.existsSync(usersFilePath)).to.be.true;
        const app = express();
        const userRoutes = require(usersFilePath);
        app.use('/users', userRoutes);
        const routes = getRoutes(app._router.stack);
        const expectedRoutes = [
            { path: '/login', method: 'get' },
            { path: '/logout', method: 'post' },
            { path: '/register', method: 'get' },
            { path: '/register', method: 'post' }
        ];
        expectedRoutes.forEach(route => {
            expect(routes).to.deep.include(route);
        });
    });
});

