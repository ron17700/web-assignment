const User = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
    async register(req, res, next) {
        const { username, email, password, firstName, lastName, age } = req.body;
        try {
            const existUser = await User.exists({ email });
            if (existUser) {
                res.status(400).json({ error: 'Email already exist!' });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new User({ username, email, password: hashedPassword, firstName, lastName, age });
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully', newUser});
        } catch (ex) {
            res.status(500).json({ error: 'Registration failed: ' + ex.message})
        }
    },

    async login(req, res, next) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email }).select('+password +refreshToken');
            if (!user) return res.status(400).json({ error: 'Invalid credentials' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

            const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

            user.refreshToken = refreshToken;
            await user.save();
            res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
        } catch (err) {
            res.status(500).json({ error: 'Server error' + err.message });
        }
    },

    async logout(req, res, next) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(403).json({ error: 'Refresh token required' });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await User.findById(decoded.userId).select('+refreshToken');

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(400).json({ error: 'Invalid refresh token' });
            }

            user.refreshToken = null;
            await user.save();

            res.status(200).json({ message: 'Logged out successfully' });
        } catch (err) {
            res.status(400).json({ error: 'Invalid refresh token' });
        }
    },

    async refreshToken(req, res, next) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(403).json({ error: 'Refresh token required' });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await User.findById(decoded.userId).select('+refreshToken');

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(403).json({ error: 'Invalid refresh token' });
            }

            const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            res.status(200).json({ accessToken: newAccessToken });
        } catch (err) {
            res.status(400).json({ error: 'Invalid or expired refresh token' });
        }
    }
}

module.exports = authController;