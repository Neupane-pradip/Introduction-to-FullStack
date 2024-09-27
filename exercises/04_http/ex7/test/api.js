const chai = require('chai');
const fs = require('fs');

// Use 'should' style assertions
const should = chai.should();

// Read the files that the server responses should be equal to
const index = fs.readFileSync('index.html').toString();
const homer = fs.readFileSync('homer.html').toString();
const bradbury = fs.readFileSync('bradbury.html').toString();

// Your server implementation
const server = require('../index.js');

// Asynchronous function to set up the tests
(async () => {
  // Dynamically import chai-http as an ES Module with .js extension
  const { default: chaiHttp } = await import('chai-http/index.js');

  // Tell Chai to use the chai-http middleware
  chai.use(chaiHttp);

  describe('Going through the routes', () => {
    /*
     * Test GET random route, should get an empty 404 response
     */
    describe('GET random path', () => {
      it('it should receive a 404 response', (done) => {
        chai.request(server)
          .get('/just_an_example_random_path_to_get_a_404')
          .end((err, res) => {
            res.should.have.status(404);
            res.text.should.be.eql('');
            done();
          });
      });
    });

    /*
     * Test the / route, should get index.html
     */
    describe('GET / path', () => {
      it('it should GET the index.html', (done) => {
        chai.request(server)
          .get('/')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.html;
            res.text.should.be.eql(index);
            done();
          });
      });
    });

    /*
     * Test the /classical route, should receive homer.html
     */
    describe('GET /classical path', () => {
      it('it should GET the homer.html', (done) => {
        chai.request(server)
          .get('/classical')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.html;
            res.text.should.be.eql(homer);
            done();
          });
      });
    });

    /*
     * Test the /dystopy route, should receive bradbury.html
     */
    describe('GET /dystopy path', () => {
      it('it should GET the bradbury.html', (done) => {
        chai.request(server)
          .get('/dystopy')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.html;
            res.text.should.be.eql(bradbury);
            done();
          });
      });
    });
  });
})();
