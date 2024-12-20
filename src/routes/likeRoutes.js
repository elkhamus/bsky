const express = require('express');
const {
  likePostController,
  getLikesController,
} = require('../controllers/likeController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkPostExists } = require('../middlewares/likeMiddleware');
const { likePostSchema, getLikesSchema } = require('../validations/likeValidation');

const router = express.Router();

// Middleware to validate postId for like/unlike
const validateLikePost = (req, res, next) => {
  const result = likePostSchema.safeParse(req.params); // Validate params (postId) in the URL
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }
  next();
};

// Middleware to validate postId for getting likes
const validateGetLikes = (req, res, next) => {
  const result = getLikesSchema.safeParse(req.params); // Validate params (postId) in the URL
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }
  next();
};

// Like or unlike a post
router.post('/:id/like', authMiddleware, checkPostExists, validateLikePost, likePostController);
// Get all likes for a post
router.get('/:id/likes', validateGetLikes, getLikesController);

module.exports = router;
