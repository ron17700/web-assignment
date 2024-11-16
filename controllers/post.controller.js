const Post = require('../models/post.model');
const mongoose = require("mongoose");
const Comment = require("../models/comment.model");

const postController = {
  async getAllPosts(req, res) {
    try {
      const sender = req.query.sender;

      if (sender) {
        const posts = await Post.find({ sender });
        res.json(posts);
      } else {
        const posts = await Post.find();
        res.json(posts);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async getPostById(req, res) {
    try {
      const post = await Post.findById(req.params.id).populate('comments');
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async addPost(req, res) {
    try {
      const newPost = new Post(req.body);
      const post = await newPost.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async updatePost(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async deletePost(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;
      const post = await Post.findByIdAndDelete(id).session(session);
      if (!post) {
        await session.abortTransaction();
        return res.status(404).json({ error: "Post not found" });
      }
      await Comment.deleteMany({ postId: id }).session(session);
      await post.deleteOne({ session });
      await session.commitTransaction();
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ error: error.message });
    }
    finally {
      session.endSession();
    }
  }
};

module.exports = postController;
