const jwt = require('jsonwebtoken');
const db = require("../models");
const Auth = db.authentications;
const expirationTime = 2592000;

const verifyToken = (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(401).json({ success: false, message: "You are not authorized!" });
    }

    // If token exists, verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }
        req.user = user;
        next();
    });
};

const setToken = (tokendata) => {
   const token = jwt.sign(tokendata, process.env.JWT_SECRET_KEY);
   return token;
}


const verifyUser = (req, res, next) => {
    verifyToken(req, res, async () => {
        const isUser = await Auth.findOne({email: req.user.email, accountId: req.user.accountId})
        if (isUser) {
            const currentDate = Math.floor(Date.now() / 1000);
            console.log(currentDate);
            if (currentDate < req.user.exp){
                req.user = isUser;
                next();
            } else {
                res.status(401).json({success: false, message: "Token is expired"})
            }
        }
        else res.status(401).json({success: false, message: "You are not authenticated!"})
    });

};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({ success: false, message: "You are not authorized" });
        }
    });
};

module.exports = {
    verifyToken,
    verifyUser,
    verifyAdmin,
    setToken
};