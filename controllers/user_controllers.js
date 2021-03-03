const UserAccount = require("../models/user_account");
const bcrypt = require("bcrypt");

//create a user       **no login require
//@/apiv1/user
//Method: GET request
exports.signUpUser = async (req, res , next) => {
    try {
        const user = await UserAccount.create(req.body);
        const token = user.generateToken();
        // console.log(token);

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

exports.loginUser = async (req, res, next) => {
    try {
        const user = await UserAccount.findOne({username: req.body.username});

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
                        data: user.tokens
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

