const Post = require("../models/Post");
const User = require("../models/User");


// @desc             Adding a post 
// @routes           POST /apiv1/user/:username/posts
// @Access           Private, Auth required

exports.addPost = async (req, res, next) => {
    try {
        const loggedin = res.locals.user;
        // const user = req.params.username;

        if (!loggedin.id) {
            return res.status(401).json({
                success: false,
                message: "Authentification failed, please log in"
            })
        };

        const author = loggedin.id;
        req.body.author = author;

        const hashtags = req.body.hashTags;
        let newHashlist = []
        if (hashtags != []) {    
            hashtags.forEach((tags)=>{
                const hashedtag = `#${tags}`;
                newHashlist.push(hashedtag);
            });
            req.body.hashTags = newHashlist;
        }

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

        if (loggedin.username == req.params.username) {
            req.query = {author: loggedin.id}
        } else {
            req.query = {author: loggedin.id, private: false}
        }
        const posts = await Post.find(req.query).populate({ path: 'author', select: 'username' });

        if (!posts) {
            return res.status(403).json({
                success: false,
                message: "no posts were found"
            })
        }
        const postCount = posts.length;
        res.status(201).json({
            success: true,
            message: "successfully fetch user posts",
            count: postCount,
            data: posts
        })

    } catch (err) {
        if (err) throw err;
    }
}


// @desc             get a specific post 
// @routes           GET /apiv1/posts/:postId
// @Access           Private, Auth required
exports.getPost = async (req, res, next) => {
    try {
        const loggedin = res.locals.user;

        if (loggedin.username != req.params.username) {
            req.query.private = false
        }

        console.log(req.query)
        const post = await Post.find(req.query)
            .populate({ path: 'author', select: 'username' })
            .populate({ path: 'shares', select: 'username' })
            .populate({ path: 'likes', select: 'username' });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "unable to retrieve that post"
            })
        }

        res.status(201).json({
            success: true,
            message: "successfully fetch the post",
            count: post.length,
            data: post
        })

    } catch (err) {
        if (err) throw err;
    }
}


// @desc             Updateding a user loggedin specific post 
// @routes           PUT /apiv1/user/:username/posts/:postId
// @Access           Private, Auth required

exports.reactToPost = async (req, res, next) => {
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


exports.editPost = async (req, res, next) => {
    try {
        const loggedin = res.locals.user;

        let post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        if (loggedin.id != post.author) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized to Update this Post"
            });
        }

        if (req.body.hashTags) {
            const hashtags = req.body.hashTags;
            let newHashlist = []
            if (hashtags != []) {    
                hashtags.forEach((tags)=>{
                    const hashedtag = `#${tags}`;
                    newHashlist.push(hashedtag);
                });
                req.body.hashTags = newHashlist;
            }
        }
        

        post = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true, runValidators: true })
            .populate({ path: 'author', select: 'username' })
            .populate({ path: 'shares', select: 'username' })
            .populate({ path: 'likes', select: 'username' });

        res.status(202).json({
            success: true,
            message: "successfully update the post",
            data: post 
        })

    } catch (err) {
        if (err) throw err;
    }
}


exports.deletePost = async (req, res, next) => {
    try {
        const loggedin = res.locals.user;

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status.json({
                success: false,
                message: "Post not found"
            });
        };

        if (loggedin.id != post.author) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized to delete this Post"
            });
        }

        post.remove();

        res.status(201).json({
            success: true, 
            message: "Successfully delete the Post"
        })
    } catch (err) {
        if (err) throw err;
    }
}