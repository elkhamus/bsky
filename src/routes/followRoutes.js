const express = require('express');
const {
  followUserController,
  unfollowUserController,
  getFollowersController,
  getFollowingController,
} = require('../controllers/followController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkUserExists } = require('../middlewares/userMiddleware');
const { followUserSchema, checkFollowingSchema } = require('../validations/followValidation');

const router = express.Router();

// Middleware to validate followingId (for follow/unfollow actions)
const validateFollowUser = (req, res, next) => {
  const result = followUserSchema.safeParse(req.body); // Validate body (followingId)
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }
  next();
};

// Middleware to validate followingId (for check following)
const validateCheckFollowing = (req, res, next) => {
  const result = checkFollowingSchema.safeParse(req.params); // Validate params (followingId)
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }
  next();
};

// Route to follow a user
router.post('/:id/follow', authMiddleware, checkUserExists, validateFollowUser, followUserController);

// Route to unfollow a user
router.post('/:id/unfollow', authMiddleware, checkUserExists, validateFollowUser, unfollowUserController);

// Route to get all followers of a user
router.get('/:id/followers', validateCheckFollowing, getFollowersController);

// Route to get all users a user is following
router.get('/:id/following', validateCheckFollowing, getFollowingController);

module.exports = router;
