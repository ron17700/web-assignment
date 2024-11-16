const {default: mongoose} = require('mongoose');
const Schema = require('mongoose').Schema;

const postModel = new Schema(
    {
        title: {type: String, required: true},
        content: {type: String, required: true},
        sender: {type: String, required: true}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Post', postModel);
