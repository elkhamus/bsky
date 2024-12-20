const { likePost, getLikesForPost } = require('../services/likeService');

// Controller to like or unlike a post
const likePostController = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from JWT token
    const postId = parseInt(req.params.id, 10);

    const result = await likePost(userId, postId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to get all likes for a post
const getLikesController = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const likes = await getLikesForPost(postId);
    res.status(200).json(likes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { likePostController, getLikesController };
