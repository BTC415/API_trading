// import jwt from 'jsonwebtoken'

// export const verifyToken = (req, res,next) => {
//    const {token} = req.header
//    if (!token) {
      
//       return res.status(401).json({ success: false, message: "You are not authorize!" })
//    }

//    // if token is exist then verify the token
//    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
//       if (err) {
//          return res.status(401).json({ success: false, message: "Token is invalid" })
//       }
//       req.user = user
//       next()
//    })
// }


// export const verifyUser = (req, res, next) => {
//    const {id}=req.query
//    verifyToken(req, res, next, () => {
//       if ((":"+req.user.id) === req.query.id || req.user.role === 'admin') {
//          next()
//       } else {
//          return res.status(401).json({ success: false, message: "You are not authenticated" })
//       }
//    })
// }


// export const verifyAdmin = (req, res, next) => {
//    verifyToken(req, res, next, () => {
//       if (req.user.role === 'admin') {
//          next()
//       } else {
//          return res.status(401).json({ success: false, message: "You are not authorize" })
//       }
//    })
// } 


const jwt = require('jsonwebtoken');

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
    const { id } = req.query;
    verifyToken(req, res, () => {
        if (req.user.id === id || req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({ success: false, message: "You are not authenticated" });
        }
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