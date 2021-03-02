const UserAccount = require("../models/user_account");

//create a user       **no login require
//@/apiv1/user
//Method: GET request
exports.createUser = async (req, res , next) => {
    try {
        const user = await UserAccount.create(req.body);
        console.log(user);

        res.status(200).json({
            success: true,
            data: user
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

exports.updateUser = async (req, res, next) => {
    try {
        const user = await UserAccount.find({username: req.params.username})
        if (user) {
            const userUpdated = await UserAccount.findOneAndUpdate({ username: req.params.username }, req.body, { new: true, runValidators: true });

            return res.status(201).json({
                succes: true,
                data: userUpdated
            })
        }

        res.status(201).json({
            succes: true,
            data: userUpdated
        })
    } catch (error) {
        console.log(error)
    }



}