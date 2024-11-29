const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

const commentController = {
    async getAllComments(req, res) {
        try {
            const { postId } = req.params;
            const post = await Post.findById(postId).populate('comments');
            if (!post) return res.status(404).json({ error: 'Post not found' });
            res.status(200).json(post.comments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getCommentById(req, res) {
        try {
            const { commentId } = req.params;
            const comment = await Comment.findById(commentId).populate('author');
            if (!comment) return res.status(404).json({ error: 'Comment not found' });
            res.status(200).json(comment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createComment(req, res) {
        try {
            const { postId } = req.params;
            const { content, author } = req.body;
            const post = await Post.findById(postId);
            if (!post) return res.status(404).json({ error: 'Post not found' });

            const newComment = new Comment({ content, author, postId });
            await newComment.save();

            post.comments.push(newComment._id);
            await post.save();

            res.status(201).json(newComment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateComment(req, res) {
        try {
            const { commentId } = req.params;
            const { content } = req.body;
            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                { content },
                { new: true }
            );
            if (!updatedComment) return res.status(404).json({ error: 'Comment not found' });
            res.status(200).json(updatedComment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteComment(req, res) {
        try {
            const { postId, commentId } = req.params;
            const post = await Post.findById(postId);
            if (!post) return res.status(404).json({ error: 'Post not found' });

            const commentIndex = post.comments.indexOf(commentId);
            if (commentIndex > -1) post.comments.splice(commentIndex, 1);
            await post.save();

            const deletedComment = await Comment.findByIdAndDelete(commentId);
            if (!deletedComment) return res.status(404).json({ error: 'Comment not found' });

            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    async deleteAllCommentsByPostId(req, res) {
        try {
            const { postId } = req.params;
            const post = await Post.findById(postId);
            if (!post) return res.status(404).json({ error: 'Post not found' });

            await Comment.deleteMany({ postId });

            post.comments = [];
            await post.save();

            res.status(200).json({ message: 'All comments deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = commentController;
