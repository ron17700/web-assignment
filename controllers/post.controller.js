const Post = require('../models/post.model');

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
      const post = await Post.findById(req.params.id);
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
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = postController;
