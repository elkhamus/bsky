const prisma = require('../utils/prismaClient');

// Like or unlike a post
const likePost = async (userId, postId) => {
  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      postId,
    },
  });

  if (existingLike) {
    // If the like exists, remove the like (unlike)
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
    return { message: 'Post unliked successfully.' };
  } else {
    // If the like does not exist, create a new like
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
    return { message: 'Post liked successfully.' };
  }
};

// Get all likes for a post
const getLikesForPost = async (postId) => {
  const likes = await prisma.like.findMany({
    where: { postId },
    include: {
      user: {
        select: { id: true, username: true },
      },
    },
  });
  return likes.map((like) => like.user);
};

module.exports = { likePost, getLikesForPost };
