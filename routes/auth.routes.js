const authController = require('../controllers/auth.controller');
const router = require('express').Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.delete('/refresh', authController.refreshToken);

module.exports = router;
