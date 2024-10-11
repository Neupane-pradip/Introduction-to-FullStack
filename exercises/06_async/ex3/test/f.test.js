const expect = require("chai").expect;

const f = require("../f_skeleton");

const assert = require('assert');
const { thenable } = require('../f_skeleton');

describe('thenable', function() {
  it('should resolve with 👍 after 10ms', function(done) {
    thenable.then((value) => {
      assert.strictEqual(value, "👍");
      done();
    });
  });
});

describe("rejectable", () => {
  it("rejects with correct value", (done) => {
    Promise.reject(f.rejectable)
      .catch((err) => err)
      .catch((err) => {
        expect(err).to.equal("👎");
        done();
      });
  });
});