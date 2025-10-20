const express = require('express');
const { signup, login, verifyEmail, getUsers, autoLogin, logout } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);

authRouter.get('/verify/:code', verifyEmail);

authRouter.get('/users', getUsers);

authRouter.post('/auto-login', protect , autoLogin);
authRouter.post('/logout', protect, logout);

module.exports = authRouter;