import express from 'express';
import postRoutes from './post.routes';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import isAuthorized from '../middlewares/authorization';

const router = express.Router();

router.use('/post', isAuthorized, postRoutes);
router.use('/user', isAuthorized, userRoutes);
router.use('/auth', authRoutes);

export default router;
