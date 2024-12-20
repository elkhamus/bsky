const prisma = require('../utils/prismaClient');

const followUser = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself.");
  }

  // Check if the follow relationship already exists
  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId,
      followingId,
    },
  });

  if (existingFollow) {
    // If exists, unfollow
    await prisma.follow.delete({ where: { id: existingFollow.id } });
    return { message: "Unfollowed the user successfully." };
  } else {
    // Otherwise, create follow relationship
    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
    return { message: "Followed the user successfully." };
  }
};

const getFollowers = async (userId) => {
  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: { id: true, username: true, email: true },
      },
    },
  });

  return followers.map((f) => f.follower);
};

const getFollowing = async (userId) => {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: { id: true, username: true, email: true },
      },
    },
  });

  return following.map((f) => f.following);
};

module.exports = { followUser, getFollowers, getFollowing };
