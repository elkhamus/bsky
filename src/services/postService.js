const prisma = require('../utils/prismaClient');
const { createPostSchema } = require('../validations/postValidation');

const createPost = async (data, userId) => {
  createPostSchema.parse(data); // Validate the post content

  const post = await prisma.post.create({
    data: {
      content: data.content,
      authorId: userId,
    },
  });

  return post;
};

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { id: true, username: true } },
      likes: true,
      comments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return posts;
};

const getPostById = async (postId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, username: true } },
      likes: true,
      comments: {
        include: { author: { select: { id: true, username: true } } },
      },
    },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
};

const deletePost = async (postId, userId) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    throw new Error('Post not found');
  }

  if (post.authorId !== userId) {
    throw new Error('You are not authorized to delete this post');
  }

  await prisma.post.delete({ where: { id: postId } });

  return { message: 'Post deleted successfully' };
};

module.exports = { createPost, getAllPosts, getPostById, deletePost };