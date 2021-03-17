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


// @desc             Updateding a user loggedin specific post 
// @routes           PUT /apiv1/user/:username/posts/:postId
// @Access           Private, Auth required

exports.likePost = async (req, res, next) => {
    try {
        var post = await Post.findById(req.params.postId);
        console.log(req.body.reaction)

        if (req.body.reaction == "like") {
            post.likes = post.likes.concat(res.locals.user.id);
            await post.save();
        } else if (req.body.reaction == "share") {
            req.body.to.forEach(element => {
                post.shares = post.shares.concat(element);
            });
            // post.shares = post.shares.concat(res.locals.user.id);
            await post.save();
        } else {
            return res.status(400).json({
                success: false,
                message: "please you must select a reaction"
            })
        }
        


        post = await Post.findById(req.params.postId)
            .populate({ path: 'author', select: 'username' })
            .populate({ path: 'shares', select: 'username' })
            .populate({ path: 'likes', select: 'username' });

        res.status(201).json({
            success: true,
            message: `successfully ${req.body.reaction} the post`,
            data: post
        });
    } catch (err) {
        if (err) throw err;
    }
}