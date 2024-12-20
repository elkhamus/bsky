const prisma = require('../utils/prismaClient');

const checkPostOwnership = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to modify this post' });
    }

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkPostOwnership };
