/**
 * Remember, that these tests do not cover the application as a whole,
 * only one exercise. Make sure that the whole application still works.
 */

const path = require('path');
const fs = require('fs');
const chai = require('chai');
const { expect } = chai;

const envPath = path.join(__dirname, '../.env');

describe('Environment Variables', () => {
    it('should find an .env file', () => {
        expect(fs.existsSync(envPath)).to.be.true;
    });

    it('should load MONGO_URI from .env file', () => {
        require('dotenv').config({ path: envPath });
        expect(process.env.MONGO_URI).to.exist;
        expect(process.env.MONGO_URI).to.be.a('string');
    });

    it('should load SESSION_SECRET from .env file', () => {
        expect(process.env.SESSION_SECRET).to.exist;
    });

    it('should return min 32 for SESSION_SECRET.length', () => {
        expect(process.env.SESSION_SECRET).to.be.a('string').with.lengthOf.at.least(32);
    });
});
