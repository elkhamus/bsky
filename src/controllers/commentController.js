const prisma = require('../utils/prismaClient');

// Controller for creating a comment
const createCommentController = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from JWT token
    const { content, postId } = req.body;

    // Create a new comment in the database
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });

    res.status(201).json({ comment: newComment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller for fetching all comments for a post
const getCommentsController = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);

    // Get all comments for the given post
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(200).json(comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      author: comment.author.username,
      createdAt: comment.createdAt,
    })));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createCommentController, getCommentsController };
