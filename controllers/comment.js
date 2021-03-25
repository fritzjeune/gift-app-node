const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc             Adding a comment to a Publication
// @routes           POST /apiv1/posts/:postId/comment
// @routes           POST /apiv1/posts/:postId/comment
// @Access           Private, Auth required


// for now , i will assume that request is comming from a post.
exports.addComment = async (req, res, next) => {
    try {
        const ref = req.params.postId;
        const loggedin = res.locals.user;
        if (req.params.postId) {
            req.body.postRef = ref;
        }
        req.body.author = loggedin.id;

        const post = await Post.findById(ref);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        } else {
            const comment = await Comment.create(req.body);
            console.log(post)

            post.comments = post.comments.concat(comment._id);
            post.save();
        }
        console.log(Comment);

        res.status(201).json({
            success: true,
            message: "Successfulle add your comment",
            data: post
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
} 