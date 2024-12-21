const express = require('express');
const {
  followUserController,
  unfollowUserController,
  getFollowersController,
  getFollowingController,
} = require('../controllers/followController');
const { authenticateUser } = require('../middlewares/userMiddleware');
const { validateFollowUser, validateCheckFollowing, checkFollowValidity } = require('../middlewares/followMiddleware');

const router = express.Router();

// Route to follow a user
router.post('/:id/follow', authenticateUser, validateFollowUser, checkFollowValidity, followUserController);

// Route to unfollow a user
router.post('/:id/unfollow', authenticateUser, validateFollowUser, checkFollowValidity, unfollowUserController);

// Route to get all followers of a user
router.get('/:id/followers', validateCheckFollowing, getFollowersController);

// Route to get all users a user is following
router.get('/:id/following', validateCheckFollowing, getFollowingController);

module.exports = router;
