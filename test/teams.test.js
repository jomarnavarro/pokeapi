const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../app').app;

describe('Suite de pruebas teams', () => {
    it('should return the team of the given user', (done) => {
        // Cuando la llamada no tiene correctamente la llave
        let team = [{name: 'Charizard'}, {name: 'Blastoise'}, {name: 'Pikachu'}];
        let user = 'mastermind';
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: user, password: '4321'})
            .end((err, res) => {
                chai.assert.property(res.body, 'token');
                let token = res.body.token;
                //Expect valid login
                chai.assert.equal(res.statusCode, 200);
                chai.request(app)
                    .put('/teams')
                    .send({
                        team: team
                    })
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200);
                        chai.request(app)
                            .get('/teams')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                // tiene equipo con Charizard y Blastoise
                                // { trainer: 'mastermind', team: [Pokemon]}
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.trainer, user);
                                chai.assert.equal(res.body.team.length, team.length);
                                for(let i = 0; i < res.body.team.length; i++) {
                                    chai.assert.equal(res.body.team[i].name, team[i].name);
                                }
                                done();
                            });
                    });
            });
    });
});