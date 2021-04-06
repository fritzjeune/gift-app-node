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

            post.comments = post.comments.concat(comment._id);
            post.save();
        }

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

// @desc             React to a comment
// @routes           PATCH /apiv1/posts/:postId/comment/:commentId
// @routes           PATCH /apiv1/posts/:postId/comment/:commentId
// @Access           Private, Auth required

exports.reactToComment = async (req, res, next) => {
    try {
        console.log(req.body, req.params);
        // user must not edit the referenced post neigther the comment author
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment does not exist, or has been removed"
            });
        }
        if (req.body.reaction == "like") {
            comment.likes = comment.likes.concat(res.locals.user.id);
            await comment.save();
        } else if (req.body.reaction == "share") {
            req.body.shares.forEach(element => {
                comment.shares = comment.shares.concat(element);
            });
            await comment.save();
        }

        res.status(201).json({
            success: true,
            message: "successfully react to the comment",
            data: comment
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

// @desc             Get a post Comments
// @routes           PATCH /apiv1/posts/:postId/comment/
// @routes           PATCH /apiv1/posts/:postId/comment/
// @Access           Private, Auth required

exports.getComments = async (req, res, next) => {
    
}