const jwtEncode = require('jwt-encode')
const db = require("../models");
const { setToken } = require('../utils/verifyToken');
const Auth = db.authentications;

const limitAccNum = 100;
const expirationTime = 2592000;
//Regiseter Account
exports.register = async (req, res) => {
    try {
        console.log("regiester");
        const {name, email, password, accountId} = req.body;
        // const accountId = req.params.accountId;
        const isUser = await Auth.findOne({email: email});
        console.log(isUser);
        if(!isUser) {
            const auth = new Auth({name: name, email: email, password: password, accountId: accountId, logined: true});
            await auth.save();
            const payload = {
                email: email,
                accountId: accountId,
                iat: Math.floor(Date.now() / 1000), // Issued at time
                exp: Math.floor(Date.now() / 1000) + expirationTime // Expiration time
            }
            const token = setToken(payload);
            console.log(token);
            res.status(201).json({message: "Successfully Regisetered", token: token});
        }
        else {
            res.status(409).json({message: "The Email is already registered"})
        }
    } catch(e) {
        console.log(e);
        return res.status(500).json({message: "An Error Occured!"});
    }
}

//Login Account
exports.login = async (req, res) => {
    try {
        console.log("LogIn");
        const {email, password} = req.body;
        const isUser = await Auth.findOne({email: email, password: password});
        if (isUser) {
            
            const payload = {
                email: email,
                accountId: isUser.accountId,
                iat: Math.floor(Date.now() / 1000), // Issued at time
                exp: Math.floor(Date.now() / 1000) + expirationTime // Expiration time
            }
            const token = setToken(payload);
            console.log(token);
            if (token) {
                const updateUser = await Auth.updateOne({email: email}, {$set: {logined: true}});
                res.status(200).json({message: "Successfully Logined!", token: token});
            }
            else {
                res.status(400).json({message: "Cannot logined User!"})
            }
        }
        else {
            res.status(404).json({message: "User Not Found! Please Register First."})
        }
    } catch(e) {
        console.log(e);
        return res.status(500).json({message: "An Error Occured!"})
    }
}

//Logout Account
exports.logout = async (req, res) => {
    try {
        console.log('Logout');
        const email = req.body;
        const logoutUser = await Auth.updateOne({accountId: accountId}, {$set: {logined: false}});
        res.status(200).json({email: email, logined: logined})
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "An Error Occured!"});
    }
}
