const router = require('express').Router();
const postRoutes = require('./post.routes');

router.use('/post', postRoutes);

module.exports = router;
