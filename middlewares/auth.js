const User = require("../models/user_account");
const jwt = require("jsonwebtoken");


const userAuth = async (req, res, next) => {
    try {
        // console.log(req.params)
        const token = req.header('Authorization').replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                succes: false,
                message: "route protected, please provide Auth Header info"
            })
        }

        var userId;
        jwt.verify(token, 'supersecret', (err, decoded) => {
            if (err) {
                return res.status(405).json({
                    succes: false,
                    message: err.message
                })
            }
            userId = decoded
            // console.log(userId)
        });

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(405).json({
                succes: false,
                message: "Request Unauthorized"
            })
        }
        
        // console.log(user);
        res.locals.user = user;
        // next()
    } catch (err) {
        if (err) {
            res.status(405).json({
                succes: false,
                message: err.message
            })
        }
    }
    next()  
}


module.exports = userAuth;