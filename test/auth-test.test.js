const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../app').app;

describe('Auth test suite', () => {
    it('Should return 401 when no jwt token is available', (done) => {
        // when the request does not have the correct jwt key
        chai.request(app)
            .get('/team')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 401);
                done();
            })
    });

    it('Should return 200 when jwt is valid', (done) => {
        chai.request(app)
            .get('/team')
            .set('Authorization', 'JWT Token')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 200);
                done();
            });
    });
});