const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const usersController = require('./controllers/users');
usersController.registerUser('bettatech', '1234');
usersController.registerUser('mastermind', '4321');

require('./auth')(passport)

const app = express();
app.use(bodyParser.json());

const port = 3000;

app.get('/', (req, res) => {
    //req es la peticion, 
    //res es la respuesta
    // console.log(req);
    res.status(200).send('Hello World!');
});

app.post('/login', (req, res) => {
    //make sure it has a body
    if(!req.body) {
        return res.status(400).json({message: 'Missing auth data!'});
    } else if(!req.body.user || !req.body.password) {
        return res.status(400).json({message: 'Missing credentials data!'});
    }
    // comprobar credenciales
    usersController.checkUserCredentials(req.body.user, req.body.password, (err, result) => {
        //if credentials are not valid or there's an error,
        if(err || !result) {
            return res.status(401).json({message: "Invalid Credentials."});
        } 
        // if they're valid, we generate a JWT and return it.
        const token = jwt.sign({userId: result}, 'secretPassword');
        res.status(200).json(
            {token: token}
        );
    });
});

app.post('/team/pokemons', (req, res) => {
    res.status(200).send('Hello World!');
});

app.get('/team', 
    passport.authenticate('jwt', {session: false}),
    (req, res, next) => {
        res.status(200).send('Hello World!');
});

app.delete('team/pokemons/:pokeid', (req, res) => {
    res.status(200).send('Hello World!');
});

app.put('/team', (req, res) => {
    res.status(200).send('Hello World!');
});


app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

exports.app = app;