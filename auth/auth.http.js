const usersController = require('./users.controller');
const jwt = require('jsonwebtoken');
const {to} = require('../tools/to');

const loginUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({message: 'Missing data'});
    } else if (!req.body.user || !req.body.password) {
        return res.status(400).json({message: 'Missing credentials'});
    }
    //check if user exists
    let [err, userData] = await to(usersController.getUserDataFromUserName(req.body.user));
    if(!err && userData.userId) {
        // Comprobamos credenciales
        let [err, resp] = await to(usersController.checkUserCredentials(userData, req.body.password));
        // Si no son validas, error
        if (err || !resp) {
            return res.status(401).json({message: 'Invalid credentials'});
        }
        // Si son validas, generamos un JWT y lo devolvemos
        const token = jwt.sign({userId: userData.userId}, 'secretPassword');
        res.status(200).json(
            {token: token}
        )
    } else {
        return res.status(401).json({message: 'Invalid credentials'});
    } 
}

exports.loginUser = loginUser;