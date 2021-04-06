const User = require("../models/User");
const bcrypt = require("bcrypt");
// const { request } = require("express");
const { verify } = require("jsonwebtoken");


// @desc             Add a new user Profile
// @routes           POST /apiv1/users/profile
// @Access           Public, Auth not required
// @Condition        User must provide all required info.
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

// @desc             login user
// @routes           POST /apiv1/users/login
// @Access           Public, Auth not required
// @Condition        User must provide all required credentials
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

// @desc             Update user Profile info
// @routes           PUT /apiv1/users/profile
// @Access           Private, Auth required
// @Condition        User can only update his own account info
exports.updateUser = async (req, res, next) => {
    try {
        
        const userloggedin = res.locals.user;
            // console.log(user.id == userloggedin.id);
        if (userloggedin.id != null) {
            const userUpdated = await User.findOneAndUpdate({ _id: userloggedin.id}, req.body, { new: true, runValidators: true });
            
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

        res.status(403).json({
            succes: false,
            data: "can't find that user in our database"
        })

    } catch (error) {
        console.log(error)
    }
}

// @desc             get a user Profile info
// @routes           GET /apiv1/users/profile
// @Access           Private, Auth required
// @Condition        User can get his own profile or query for a foreign Profile
// @TODO             implementing the Bloked user restriction later 
exports.getUser = async (req, res, next) => {
    try {
        const userloggedin = res.locals.user;
    
        if (req.query.username == undefined) {
            req.query.username = userloggedin.username;
        }

        const user = await User.findOne(req.query)
            .populate('posts')
            .populate('gifts')
            .populate({ path: 'friends', select: 'username firstname lastname' })
            .populate({ path: 'friendRequests', select: 'username firstname lastname' });

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

// @desc             Send a Friend request
// @routes           POST /apiv1/users/profile/userId
// @Access           Private, Auth required
// @Condition        User can send friend request to anybody , except to people with block restriction active
exports.sendFriendRequest = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        const loggedin = res.locals.user;
        // verify if the user exist
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }
        // verify if the loggedin user dont have a pending request
        if (user.friendRequests.includes(loggedin.id)) {
            return res.status(400).json({
                success: false,
                message: "You already have a request pending"
            });
        }
        // verify if they are not already friends
        if (user.friends.includes(loggedin.id) && loggedin.friends.includes(user.id)) {
            return res.status(400).json({
                success: false,
                message: `You and ${user.username} are Already Friends`
            })
        }

        user.friendRequests = user.friendRequests.concat(loggedin.id);
        await user.save();


        res.status(201).json({
            success: true,
            message: `successfully sent friend request to ${user.username}`
        })

    } catch (err) {

        if (err) {
            res.status(400).json({
                success: false,
                message: err.message
            })
        }
        
    } 
}

// @desc             Respond to Friend request
// @routes           PUT /apiv1/users/profile/userId
// @Access           Private, Auth required
// @Condition        User can accept or delete a friend request
exports.respondFriendRequest = async (req, res, next) => {
    try {
        const loggedin = res.locals.user;

        const user = await User.findById(req.params.userId);

        // verify if the user sent in params really exist
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `user with the Id:${req.params.userId} cannot be Found`
            })
        }
        // verify if the user exist in the loggedin user friendRequest
        if (!loggedin.friendRequests.includes(req.params.userId)) {
            return res.status(401).json({
                success: false,
                message: "please use a valid Friend request"
            })
        }
        // verify what action the user want to perfom with the friend request
        if (req.body.response == "accepted") {
            if (!loggedin.friends.includes(user.id)) {
                loggedin.friends = loggedin.friends.concat(user.id);
                await loggedin.save();
            }
            
            if (!user.friends.includes(loggedin.id)) {
                user.friends = user.friends.concat(loggedin.id)
                await user.save();
            }
            // removing the user from the friend request list after establishing relationship
            for (var i = 0; i < loggedin.friendRequests.length; i++) {
                if (loggedin.friendRequests[i] == user.id) {
                    loggedin.friendRequests.splice(i, 1);
                    i--;
                    await loggedin.save()
                }
            }

            return res.status(201).json({
                success: true,
                message: `You and ${user.username} are Now Friends`,
                data: loggedin
            })
        } else if (req.body.response == "deleted") {
            for (var i = 0; i < loggedin.friendRequests.length; i++) {
                if (loggedin.friendRequests[i] == user.id) {
                    loggedin.friendRequests.splice(i, 1);
                    i--;
                    await loggedin.save()
                }

                return res.status(200).json({
                    success: true,
                    message: `Successfully deleted ${user.username} from the list`
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Please Provide and action to perfom"
            })
        }
    } catch (err) {
        if (err) {
            res.status(400).json({
                success: false,
                message: err.message
            })
        }
    }
}
