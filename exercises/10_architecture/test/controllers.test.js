/**
 * Remember, that these tests do not cover the application as a whole,
 * only one exercise. Make sure that the whole application still works.
 */

const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

describe('Controllers test', () => {
    const controllers = [
        { file: 'eventController.js', methods: ['all', 'create', 'store', 'edit', 'update', 'delete'] },
        { file: 'userController.js', methods: ['renderLoginForm', 'login', 'logout', 'renderRegisterForm', 'register'] }
    ];

    controllers.forEach(controller => {
        describe(controller.file, () => {
            it('should exist', () => {
                const filePath = path.join(__dirname, '../controllers', controller.file);
                expect(fs.existsSync(filePath)).to.be.true;
            });

            controller.methods.forEach(method => {
                it(`should have method ${method}`, () => {
                    const filePath = path.join(__dirname, '../controllers', controller.file);
                    expect(fs.existsSync(filePath)).to.be.true;
                    const controllerModule = require(`../controllers/${controller.file}`);
                    expect(controllerModule).to.have.property(method).that.is.a('function');
                });
            });
        });
    });
});
