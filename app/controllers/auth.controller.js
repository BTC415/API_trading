const jwtEncode = require('jwt-encode')
const db = require("../models");
const Auth = db.authentications;

//Regiseter Account
exports.register = async (req, res) => {
    try {
        console.log("regiester");
        const {name, email} = req.query;
        const accountId = req.params.accountId;
        // const token = getAccountAccessToken(accountId);
        if(token) {
            const auth = new Auth({accountId: accountId, token: token, name: name, email: email, logined: true});
            await auth.save();
            res.status(200).json({message: "Successfully Regisetered", token: token});
        }
        else {
            res.status(400).json({message: "Error! Cannot find account."})
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
        const accountId = req.params.accountId;
        const {name, email} = req.query;
        const isUser = await Auth.findOne({accountId: accountId, email: email});
        if (isUser) {
            const token = getAccountAccessToken(accountId);
            if (token) {
                const updateUser = await Auth.updateOne({accountId: accountId}, {$set: {token: token, logined: true}});
                res.status(200).json({message: "Successfully Logined!", token: token});
            }
            else {
                res.status(400).json({message: "Account Error!"})
            }
        }
        else {
            res.status(400).json({message: "User Not Found! Please Register First."})
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
        const accountId = req.params.accountId;
        const logoutUser = await Auth.updateOne({accountId: accountId}, {$set: {token: token, logined: false}});
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "An Error Occured!"});
    }
}

