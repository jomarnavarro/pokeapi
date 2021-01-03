const { assert } = require("chai");

var add = (x, y) => x + y;

describe('course test suite', () => {
    it('should return 4', () => {
        assert.equal(add(2, 2), 4);
    });
});