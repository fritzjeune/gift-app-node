const User = require("../models/User");
const bcrypt = require("bcrypt");

//create a user       **no login require
//@/apiv1/user
//Method: GET request
exports.signUpUser = async (req, res , next) => {
    try {
        const user = await User.create(req.body);
        const token = user.generateToken();
        // console.log(token);

        res.status(200).json({
            success: true,
            data: user,
            token: token
        })
    } catch (error) {
        if(error) {
            res.status(400).json({
                success: false,
                data: error.message
            })
        }
    }
    

}

exports.loginUser = async (req, res, next) => {
    try {
        // verify if user is login with a username or an email
        const re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

        var query;

        if (re.test(req.body.username)) {
            query = {email: req.body.username}
        } else {
            query = {username: req.body.username}
        }

        const user = await User.findOne(query);

        // compare given password with the encrypted password
        if (!user) {
            return res.status(400).json({
                succes: false,
                message: "username or password incorrect" //dont want to let pirats know if the account really existe
            }); 
        }

        if (!req.body.password) {
            return res.status(400).json({
                succes: false,
                message: "you must provide a password"
            })
        } else {
            bcrypt.compare(req.body.password, user.password, (err, isMatch)=>{
                if (err) {
                    throw err
                }
                if (isMatch == false) {
                    return res.status(400).json({
                        succes: false,
                        message: "username or password incorrect"
                    })
                } else {
                    const token = user.generateToken();

                    res.status(200).json({
                        succes: true,
                        message: "login successfull",
                        token: token
                    })
                }
            })
        }

    } catch (error) {
        res.status(400).json({
            succes: false,
            data: error.message
        })
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.params.username})

        //TODO verify if the user who make the update request is the account owner
        // using the JWT module to verify that by the token
        
        if (user) { 
            const userloggedin = res.locals.user;
            // console.log(user.id == userloggedin.id);
            if (user.id == userloggedin.id) {
                const userUpdated = await User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true, runValidators: true });

                res.status(201).json({
                    succes: true,
                    data: userUpdated
                })
            } else {
                return res.status(405).json({
                    succes: false,
                    message: "you are not authorized to perfome this updates"
                })
            }
            
        }

        res.status(403).json({
            succes: false,
            data: "can't find that user in our database"
        })

    } catch (error) {
        console.log(error)
    }
}

//retrieve a user profile       **login require
//@/apiv1/user/:username
//Method: GET request
exports.getUser = async (req, res, next) => {
    try {
        const userloggedin = res.locals.user;
        // console.log(req.params)
        const user = await User.findOne(req.params)
            .populate({ path: 'posts', select: 'postDescription postURL' })
            .populate({ path: 'followers', select: 'username firstname lastname' })
            .populate({ path: 'followings', select: 'username firstname lastname' });

        // console.log(user)
        if (!user) {
            return res.status(404).json({
                succes: false,
                message: "can't find that user."
            })
        }

        res.status(201).json({
            succes: true,
            message: "successfully get the user Profile",
            data: user
        })


    } catch (error) {
        res.status(403).json({
            succes: false,
            message: "cannot get the user info, please loggin first."
        })
    }
}

exports.followUser = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.params.username});
        const loggedin = res.locals.user;
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }
        user.followers = user.followers.concat(loggedin.id);
        user.save();

        loggedin.followings = loggedin.followings.concat(user.id);
        loggedin.save();

        res.status(201).json({
            success: true,
            message: `successfully follow ${user.username}`
        })

    } catch (error) {
        if (error) throw error;
    }

    
}
