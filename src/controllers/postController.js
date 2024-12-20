const {
    createPost,
    getAllPosts,
    getPostById,
    deletePost,
  } = require('../services/postService');
  
  const createPostController = async (req, res) => {
    try {
      const post = await createPost(req.body, req.user.userId);
      res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getAllPostsController = async (req, res) => {
    try {
      const posts = await getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const getPostByIdController = async (req, res) => {
    try {
      const post = await getPostById(parseInt(req.params.id, 10));
      res.status(200).json(post);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  
  const deletePostController = async (req, res) => {
    try {
      const result = await deletePost(parseInt(req.params.id, 10), req.user.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  module.exports = {
    createPostController,
    getAllPostsController,
    getPostByIdController,
    deletePostController,
  };
  