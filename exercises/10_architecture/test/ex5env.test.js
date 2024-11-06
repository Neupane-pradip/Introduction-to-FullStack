/**
 * Remember, that these tests do not cover the application as a whole,
 * only one exercise. Make sure that the whole application still works.
 */

const path = require('path');
const fs = require('fs');
const chai = require('chai');
const { expect } = chai;

const envPath = path.join(__dirname, '../.env');

describe('Ex5 - Environment Variables', () => {
    it('should find an .env file', () => {
        expect(fs.existsSync(envPath)).to.be.true;
    });

    it('should load JWT_SECRET from .env file', () => {
        require('dotenv').config({ path: envPath });
        expect(process.env.JWT_SECRET).to.exist;
    });

    it('should return min 32 for JWT_SECRET.length', () => {
        expect(process.env.JWT_SECRET).to.be.a('string').with.lengthOf.at.least(32);
    });
});
