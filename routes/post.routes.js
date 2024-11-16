const postController = require('../controllers/post.controller');
const commentController = require('../controllers/comment.controller');
const router = require('express').Router();

// Routes for Posts
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.addPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

// Routes for Comments under Posts
router.get('/:postId/comments', commentController.getAllComments);
router.get('/:postId/comments/:commentId', commentController.getCommentById);
router.post('/:postId/comments', commentController.createComment);
router.put('/:postId/comments/:commentId', commentController.updateComment);
router.delete('/:postId/comments/:commentId', commentController.deleteComment);
router.delete('/:postId/comments', commentController.deleteAllCommentsByPostId);

module.exports = router;
