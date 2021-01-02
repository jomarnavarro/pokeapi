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

    it('should return 400 when no data is provided', (done) => {
        chai.request(app)
            .post('/login')
            .end((err, res) => {
                //expect invalid login
                chai.assert.equal(res.statusCode, 400);
                done();
            });
    });

    it('should return 200 and token for a succesful login.', (done) => {
        chai.request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({user: 'bettatech', password: '1234'})
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 200);
                chai.assert.isNotNull(res.body.token);
                done();
            });
    });

    it('should return 200 when jwt is valid,', (done) => {
        chai.request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({user: 'mastermind', password: '4321'})
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 200);
                chai.assert.isNotNull(res.body.token);
                chai.request(app)
                    .get('/team')
                        .set('Authorization', `JWT ${res.body.token}`)
                        .end((err, res) => {
                            chai.assert.equal(res.statusCode, 200);
                            done();
                        });
            });
    });
});