const router = require('express').Router();
const postRoutes = require('./post.routes');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

const isAuthorized = require('../middlewares/authorization');

router.use('/post', isAuthorized, postRoutes);
router.use('/user', isAuthorized, userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
