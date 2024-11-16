const mongoose = require('mongoose');

const postModel = new mongoose.Schema(
    {
        title: {type: String, required: true},
        content: {type: String, required: true},
        sender: {type: String, required: true},
        comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
    },
    {timestamps: true}
);

module.exports = mongoose.model('Post', postModel);
