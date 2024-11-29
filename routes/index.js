const router = require('express').Router();
const postRoutes = require('./post.routes');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

router.use('/post', postRoutes);
router.use('/user', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
