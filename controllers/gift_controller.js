const Gift = require("../models/Gift");

//add a gift to user Profile       **login require
//@/apiv1/user
//Method: POST request

exports.addGift = async (req, res, next) => {
    try {
        //Using the JWT module to verify by the token the owner of the gift .

        const userloggedin = res.locals.user;
        req.body.owner = userloggedin.id;
        const gift = await Gift.create(req.body);
        

        console.log(gift);
        res.status(201).json({
            succes: true,
            message: "gift added successfully",
            data: gift.populate('owner')
        })


    } catch (error) {
        res.status(401).json({
            succes: false,
            message: "error adding the gift in the list"
        })
    }
}

//retrieve a user Profile       **login require
//@/apiv1/user/:username
//Method: GET request