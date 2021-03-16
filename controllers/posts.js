const { replaceOne } = require("../models/Post");
const Post = require("../models/Post");
const User = require("../models/User");


// @desc             Adding a post 
// @routes           POST /apiv1/user/:username/posts
// @Access           Private, Auth required

exports.addPost = async (req, res, next) => {
    try {
        const loggedinId = res.locals.user.id;
        // const user = req.params.username;

        if (!loggedinId) {
            return res.status(401).json({
                success: false,
                message: "Authentification failed, please log in"
            })
        };

        const author = loggedinId;
        req.body.author = author;

        const post = await Post.create(req.body);

        const user = await User.findById(author);
        user.posts = await user.posts.concat(post.id);
        user.save((err)=>{
            if (err) {
                console.log(err.message)
            }
        });

        console.log(user.posts)

        res.status(200).json({
            success: true,
            message: "successfully add the post",
            data: post.populate('author')
        })


    } catch (error) {
        if (error) throw error;
    }
}

// @desc             Getting all a user loggedin post 
// @routes           GET /apiv1/user/:username/posts
// @Access           Private, Auth required
exports.getPosts = async (req, res, next) => {
    try {
        const loggedin = res.locals.user;
        const posts = await Post.find({author: loggedin.id}).populate({ path: 'author', select: 'username' });

        if (!posts) {
            return res.status(403).json({
                success: false,
                message: "no posts were found"
            })
        }

        res.status(201).json({
            success: true,
            message: "successfully fetch user posts",
            data: posts
        })

    } catch (err) {
        if (err) throw err;
    }
}