const express = require('express');
const {
  createPostController,
  getAllPostsController,
  getPostByIdController,
  deletePostController,
} = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkPostOwnership } = require('../middlewares/postMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createPostController); // Create a post
router.get('/', getAllPostsController);               // Get all posts
router.get('/:id', getPostByIdController);            // Get a single post by ID
router.delete('/:id', authMiddleware, checkPostOwnership, deletePostController); // Delete a post

module.exports = router;
