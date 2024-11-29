const authController = require('../controllers/auth.controller');
const router = require('express').Router();

const isAuthorized = require('../middlewares/authorization');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', isAuthorized, authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
