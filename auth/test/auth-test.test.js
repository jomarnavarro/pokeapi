const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const usersController = require('../users.controller');
const teamsController = require('../../teams/teams.controller');

const app = require('../../app').app;

beforeEach(async () => {
    await usersController.registerUser('bettatech', '1234');
    await usersController.registerUser('mastermind', '4321');
})

afterEach(async () => {
    await usersController.cleanUpUsers();
    await teamsController.cleanUpTeam();
});

describe('Suite de pruebas auth', () => {
    it('should return 401 when no jwt token available', (done) => {
        // Cuando la llamada no tiene correctamente la llave
        chai.request(app)
            .get('/teams')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 401);
                done();
            });
    });

    it('should return 400 when no data is provided', (done) => {
        chai.request(app)
            .post('/auth/login')
            .end((err, res) => {
                //Expect valid login
                chai.assert.equal(res.statusCode, 400);
                chai.assert.property(res.body, 'message');
                chai.assert.equal(res.body.message, 'Missing credentials');
                done();
            });
    });

    it('should return 400 when blank user and password are provided', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: '', password: ''})
            .end((err, res) => {
                //expect invalid login
                chai.assert.equal(res.statusCode, 400);
                chai.assert.property(res.body, 'message');
                chai.assert.equal(res.body.message, 'Missing credentials');
                done();
            })

    });
    it('should return 400 when correct user and blank password are provided', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'bettatech', password: ''})
            .end((err, res) => {
                //expect invalid login
                chai.assert.equal(res.statusCode, 400);
                chai.assert.property(res.body, 'message');
                chai.assert.equal(res.body.message, 'Missing credentials');
                done();
            });

    });

    it('should return 401 when a bad username is provided', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'invalid', password: '1234'})
            .end((err, res) => {
                //Expect invalid login
                chai.assert.equal(res.statusCode, 401);
                chai.assert.property(res.body, 'message');
                chai.assert.equal(res.body.message, 'Invalid credentials');
                done();
            });
    });

    it('should return 400 when neither user nor password is provided', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({})
            .end((err, res) => {
                //Expect invalid login
                chai.assert.equal(res.statusCode, 400);
                chai.assert.property(res.body, 'message');
                chai.assert.equal(res.body.message, 'Missing credentials');
                done();
            });
    });

    it('should return 400 when no password is provided', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({username: 'bettatech'})
            .end((err, res) => {
                //Expect invalid login
                chai.assert.equal(res.statusCode, 400);
                chai.assert.property(res.body, 'message');
                chai.assert.equal(res.body.message, 'Missing credentials');
                done();
            });
    });

    it('should return 200 and token for succesful login', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'bettatech', password: '1234'})
            .end((err, res) => {
                //Expect valid login
                chai.assert.equal(res.statusCode, 200);
                chai.assert.property(res.body, 'token');
                done();
            });
    });

    it('should return 200 when jwt is valid', (done) => {
        let user = 'mastermind';
        let password = '4321';
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: user, password: password})
            .end((err, res) => {
                //Expect valid login
                chai.assert.equal(res.statusCode, 200);
                chai.assert.property(res.body, 'token');

                chai.request(app)
                    .get('/teams')
                    .set('Authorization', `JWT ${res.body.token}`)
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200);
                        chai.assert.property(res.body, 'trainer');
                        chai.assert.property(res.body, 'team');
                        chai.assert.equal(res.body.trainer, user);
                        chai.assert.equal(res.body.team.length, 0);

                        done();
                    });
            });
    });
});

