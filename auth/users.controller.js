const uuid = require('uuid');
const crypto = require('../tools/crypto.js');
const teams = require('../teams/teams.controller');
const mongoose = require('mongoose');
const { to } = require('../tools/to');

const UserModel = mongoose.model('UserModel', 
    { userName: String, password: String, userId: String });

const cleanUpUsers = () => {
    return new Promise(async (resolve, reject) => {
        await UserModel.deleteMany({}).exec();
        resolve();
    })
}

const registerUser = (userName, password) => {
    return new Promise(async (resolve, reject) => {
        let hashedPwd = crypto.hashPasswordSync(password);
        // Guardar en la base de datos nuestro usuario
        let userId = uuid.v4();
        let newUser = new UserModel({
            userId: userId,
            userName: userName,
            password: hashedPwd
        });
        await newUser.save();
        await teams.bootstrapTeam(userId);
        resolve();
    });
}

const getUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({userId: userId}).exec());
        if (err) {
            return reject(err);
        }
        resolve(result);
    });
}

const getUserDataFromUserName = (userName) => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({userName: userName}).exec());
        // making sure the result is either empty or the query from mongoDB
        if (err || !result) {
            return resolve({});
        }
        resolve(result);
    });
}

const checkUserCredentials = (userData, password) => {
    return new Promise( (resolve, reject) => {
        if(userData.userName && userData.userId && userData.password) {
            crypto.comparePassword(password, userData.password, (err, result) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        } else {
            reject('user data is incomplete');
        }
    });
}
exports.registerUser = registerUser;
exports.checkUserCredentials = checkUserCredentials;
exports.getUserDataFromUserName = getUserDataFromUserName;
exports.getUser = getUser;
exports.cleanUpUsers = cleanUpUsers;