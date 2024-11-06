/**
 * Remember, that these tests do not cover the application as a whole,
 * only one exercise. Make sure that the whole application still works.
 */

const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const express = require('express');

describe('Ex5 - Routes test', () => {
    const filePath = path.join(__dirname, '../routes', 'api.js');

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

    it('should have API routes', () => {
        expect(fs.existsSync(filePath)).to.be.true;
        const app = express();
        const apiRoutes = require(filePath);
        app.use('/api', apiRoutes);
        const routes = getRoutes(app._router.stack);
        const expectedRoutes = [
            { path: '/api/events', method: 'get' },
            { path: '/api/events/:id', method: 'get' },
            { path: '/api/events/:id', method: 'put' },
            { path: '/api/login', method: 'post' }
        ];
        expectedRoutes.forEach(route => {
            expect(routes).to.deep.include(route);
        });
    });
});
