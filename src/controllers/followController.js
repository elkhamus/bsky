const prisma = require('../utils/prismaClient');

// Follow a user
const followUserController = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from JWT token
    const { followingId } = req.body;

    // Check if the user is already following the target user
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId,
      },
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Create a new follow record
    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId,
      },
    });

    res.status(200).json({ message: 'Followed user successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Unfollow a user
const unfollowUserController = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from JWT token
    const { followingId } = req.body;

    // Check if the user is following the target user
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId,
      },
    });

    if (!existingFollow) {
      return res.status(400).json({ message: 'You are not following this user' });
    }

    // Delete the follow record (unfollow)
    await prisma.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });

    res.status(200).json({ message: 'Unfollowed user successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all followers of a user
const getFollowersController = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // Retrieve followers for the given user
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(200).json(followers.map((f) => f.follower));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all users that a user is following
const getFollowingController = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // Retrieve users that the given user is following
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(200).json(following.map((f) => f.following));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  followUserController,
  unfollowUserController,
  getFollowersController,
  getFollowingController,
};
