const prisma = require('../utils/prismaClient');

// Follow a user
const followUserController = async (req, res) => {
  try {
    console.log('Follow request:', {
      userId: req.user.userId,
      followingId: req.params.id,
    });

    const userId = req.user.userId; // Extracted from JWT token
    const followingId = req.params.id; // Already validated and transformed

    // Prevent self-following
    if (userId === followingId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    // Check if the user is already following the target user
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId,
      },
    });

    console.log('Existing follow:', existingFollow);

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

    res.status(200).json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Unfollow a user
const unfollowUserController = async (req, res) => {
  try {
    console.log('Unfollow request:', {
      userId: req.user.userId,
      followingId: req.params.id,
    });

    const userId = req.user.userId; // Extracted from JWT token
    const followingId = req.params.id; // Already validated and transformed

    // Check if the user is following the target user
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId,
      },
    });

    console.log('Existing follow:', existingFollow);

    if (!existingFollow) {
      return res.status(400).json({ message: 'You are not following this user' });
    }

    // Delete the follow record
    await prisma.follow.delete({
      where: { id: existingFollow.id },
    });

    res.status(200).json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all followers of a user
const getFollowersController = async (req, res) => {
  try {
    const userId = req.params.id; // Already validated and transformed

    console.log('Getting followers for user:', userId);

    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    console.log('Found followers:', followers);

    res.status(200).json(followers.map((follow) => ({
      id: follow.follower.id,
      username: follow.follower.username,
    })));
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all users that a user is following
const getFollowingController = async (req, res) => {
  try {
    const userId = req.params.id; // Already validated and transformed

    console.log('Getting following for user:', userId);

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    console.log('Found following:', following);

    res.status(200).json(following.map((follow) => ({
      id: follow.following.id,
      username: follow.following.username,
    })));
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  followUserController,
  unfollowUserController,
  getFollowersController,
  getFollowingController,
};
