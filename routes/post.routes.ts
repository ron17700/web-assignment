import express from 'express';
import postController from '../controllers/post.controller';
import commentController from '../controllers/comment.controller';

const router = express.Router();

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.addPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

router.get('/:postId/comment', commentController.getAllComments);
router.get('/:postId/comment/:commentId', commentController.getCommentById);
router.post('/:postId/comment', commentController.createComment);
router.put('/:postId/comment/:commentId', commentController.updateComment);
router.delete('/:postId/comment/:commentId', commentController.deleteComment);
router.delete('/:postId/comment', commentController.deleteAllCommentsByPostId);

export default router;
