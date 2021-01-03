const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// Controllers
const usersController = require('./users.controller');

router.route('/')
    .get((req, res) => {
        res.send('GET Auth router');
    })
    .post((req, res) => {
        res.send('POST Auth router');
    })

router.route('/login')
    .post((req, res) => {
        if (!req.body) {
            return res.status(400).json({message: 'Missing data'});
        } else if (!req.body.user || !req.body.password) {
            return res.status(400).json({message: 'Missing credentials'});
        }
        // comprobar credenciales
        usersController.checkUserCredentials(req.body.user, req.body.password, (err, result) => {
            //if credentials are not valid or there's an error,
            if (err || !result) {
                return res.status(401).json({message: 'Invalid credentials'});
            } 
            // if they're valid, we generate a JWT and return it.
            let user = usersController.getUserIdFromUserName(req.body.user);
            const token = jwt.sign({userId: user.userId}, 'secretPassword');
            res.status(200).json(
                {token: token}
            )
        })
    });

    exports.router = router;