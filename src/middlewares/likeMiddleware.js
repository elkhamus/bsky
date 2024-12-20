const prisma = require('../utils/prismaClient');

// Middleware to check if the post exists
const checkPostExists = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkPostExists };
