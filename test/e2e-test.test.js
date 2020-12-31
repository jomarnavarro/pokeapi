const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../app').app;

describe('End to End poke api test suite.', () => {
    it('should return hello world', (done) => {
       chai.request(app)
        .get('/')
        .end((err, res) => {
            console.log('A');
            chai.assert.equal(res.text, 'Hello World!');
            done();
        });
        console.log('B');
    });
});