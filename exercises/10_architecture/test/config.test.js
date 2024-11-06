/**
 * Remember, that these tests do not cover the application as a whole,
 * only one exercise. Make sure that the whole application still works.
 */

const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
require('dotenv').config();

describe('Ex2 - Config files test', () => {
    const configs = [
        { file: 'database.js', method: 'connectDB' },
        { file: 'mongoose.js', require: 'mongoose' },
        { file: 'session.js', sessionConfig: true }
    ];

    configs.forEach(config => {
        describe(config.file, () => {
            it('should exist', () => {
                const filePath = path.join(__dirname, '../config', config.file);
                expect(fs.existsSync(filePath)).to.be.true;
            });

            if (config.method) {
                it(`should return a method`, () => {
                    const filePath = path.join(__dirname, '../config', config.file);
                    expect(fs.existsSync(filePath)).to.be.true;
                    const configModule = require(`../config/${config.file}`);
                    expect(configModule).to.be.a('function');
                });
            }

            if (config.require) {
                it(`should return the same as require('${config.require}')`, () => {
                    const filePath = path.join(__dirname, '../config', config.file);
                    expect(fs.existsSync(filePath)).to.be.true;
                    const configModule = require(`../config/${config.file}`);
                    expect(configModule).to.have.property('connect').that.is.a('function');
                    expect(configModule).to.have.property('model').that.is.a('function');
                    expect(configModule).to.have.property('Schema').that.is.a('function');
                });
            }

            if (config.sessionConfig) {
                it('should export sessionConfig', () => {
                    const filePath = path.join(__dirname, '../config', config.file);
                    expect(fs.existsSync(filePath)).to.be.true;
                    const configModule = require(`../config/${config.file}`);
                    expect(configModule).to.be.a('function');
                });
            }
        });
    });
});
