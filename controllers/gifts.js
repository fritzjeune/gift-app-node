const Gift = require("../models/Gift");
const User = require("../models/User");

// @desc             Add a new gift to Our Profile
// @routes           POST /apiv1/gifts 
// @Access           Private, Auth required
// @Condition        the loggedin user will be the Author.

exports.addGift = async (req, res, next) => {
    try {
        //Using the JWT module to verify by the token the owner of the gift.

        const loggedin = res.locals.user;
        req.body.author = loggedin.id;

        const gift = await Gift.create(req.body);
        loggedin.gifts = loggedin.gifts.concat(gift.id);
        loggedin.save();
    
        
        res.status(201).json({
            succes: true,
            message: "gift added successfully",
            data: gift.populate({path: 'author', select: 'username lastname surname'})
        })


    } catch (error) {
        res.status(401).json({
            succes: false,
            message: error.message//`error adding the gift in the list`
        })
    }
}

// @desc             Get a user gifts
// @routes           GET /apiv1/gifts/:username
// @Access           Private, Auth required
// @Condition        Only a friend or a followers can see our Gifts

exports.getGifts = async (req, res, next) => {
    try {
        // get the loggedIn User from the Auth middleware
        const loggedin = res.locals.user;
        
        // get the requested User from the database
        if (req.query.username == null) {
            req.query = {author: loggedin.id}
        } else {
            // verify if i am in the requested user followers
            const requestedUser = await User.findOne({username: req.query.username});

            if(!requestedUser) {
                return res.status(404).json({
                    success: false,
                    message: "user not found"
                })
            }
            if (loggedin.id == requestedUser.id) {
                req.query = {author: loggedin.id}
            } else {
                let followers = requestedUser.followers;

                if (!followers || !followers.includes(loggedin.id)) {
                    return res.status(401).json({
                        success: false,
                        message: `Unauthorized to see ${requestedUser.username} Gifts list`
                    })
                }
                req.query = {author: requestedUser.id}
            }

            
        }   

        const gifts = await Gift.find(req.query)
            .populate({path: 'author likes shares', select: 'username lastname surname'});

        res.status(201).json({
            success: true,
            message: "successfully get the user Gifts",
            data: gifts
        })
    } catch (err) {
        if (err) throw err;
    }
}

// @desc             Update a user gifts details
// @routes           GET /apiv1/gifts/:id
// @Access           Private, Auth required
// @Condition        Only the gift Author can update it

exports.editGift = async (req, res, next) => {
    try {
        // verify if the user is the gift Author
        const loggedin = res.locals.user;

        const gift = await Gift.findById(req.params.id);

        if (!gift) {
            return res.status(404).json({
                success: false,
                message: "Gift not found"
            });
        }

        if (gift.author != loggedin.id) {
            return res.status(401).json({
                success: false,
                message: "You are not Authorized to edit that Gift"
            })
        }
        //TODO: prevent user from changing the Gift Author 
        const giftUpdated = await Gift.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate({path: 'author likes shares', select: 'username lastname surname'});

        res.status(201).json({
            success: true,
            message: "Successfully update the gift",
            data: giftUpdated
        })


    } catch (err) {
        // if (err) throw err;
        res.status(501).json({
            success: false,
            message: err.message
        })
    }
}

// @desc             Get a user gifts
// @routes           GET /apiv1/gifts/:username
// @Access           Private, Auth required
// @Condition        Only a friend or a followers can see our Gifts

exports.reactToGift = async (req, res, next) => {
    const loggedin = res.locals.user;

    try {
        const gift = await Gift.findById(req.params.id);
        if (!gift) {
            return res.status(404).json({
                success: false,
                message: "Gift not found"
            });
        }

        // verify what kind if reaction the user would like to have
        if (req.body.reaction == "like") { // to lowercase may be a great idea
            if (gift.likes.includes(loggedin.id)) {
                return res.status(400).json({
                    success: false,
                    message: "You already like the post"
                })
            }
            gift.likes = gift.likes.concat(loggedin.id);
            gift.save();
        } else if (req.body.reaction == "share") {
            req.body.shares.forEach(userId => {
                if (!gift.shares.includes(userId)) {
                    gift.shares = gift.shares.concat(userId);
                    gift.save()
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Please choose a reaction or Correct the syntax"
            })
        }

        res.status(201).json({
            success: true,
            message: `you successfully ${req.body.reaction} the Gift`,
            data: gift.populate({path: 'author likes shares', select: 'username lastname surname'})
        });

        
    } catch (err) {
        res.status(501).json({
            success: false,
            message: err.message
        })
    }
}