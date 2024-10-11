const { expect } = require('chai');
const { thenable } = require('../f_skeleton');

describe('thenable', function() {
  it('should resolve with 👍 using Promise.resolve', function() {
    return Promise.resolve(thenable).then(value => {
      expect(value).to.equal("👍");
    });
  });

  it('should resolve with 👍 using async/await', async function() {
    const result = await Promise.resolve(thenable);
    expect(result).to.equal("👍");
  });
});