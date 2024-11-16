const mongoose = require('mongoose');

const commentModel = new mongoose.Schema(
    {
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        content: { type: String, required: true },
        author: { type: String, required: true },
    }, 
    { timestamps: true });

module.exports = mongoose.model('Comment', commentModel);