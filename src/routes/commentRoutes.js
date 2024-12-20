const express = require('express');
const { createCommentController, getCommentsController } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { createCommentSchema } = require('../validations/commentValidation');
const prisma = require('../utils/prismaClient');

const router = express.Router();

// Middleware to validate the comment input (content and postId)
const validateCreateComment = (req, res, next) => {
  const result = createCommentSchema.safeParse(req.body); // Validate body (content, postId)
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }
  next();
};

// Middleware to check if post exists before allowing a comment
const checkPostExists = async (req, res, next) => {
    const postId = parseInt(req.params.id, 10);
    const post = await prisma.post.findUnique({ where: { id: postId } });
  
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
  
    next();
  };
  

// Route to create a comment on a post
router.post('/:id/comments', authMiddleware, checkPostExists, validateCreateComment, createCommentController);

// Route to get all comments for a post
router.get('/:id/comments', getCommentsController);

module.exports = router;
