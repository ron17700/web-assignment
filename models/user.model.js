const mongoose = require('mongoose');

const userModel = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        age: { type: Number, required: true, min: [18, "You should be at least 18 years old!"], max: [120, "Please enter a valid age!"] },
        password: { type: String, required: true,  select: false },
        refreshToken: { type: String,  select: false }
    },
    {timestamps: true}
);

module.exports = mongoose.model('User', userModel);