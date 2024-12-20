const prisma = require('../utils/prismaClient');

const checkFollowValidity = async (req, res, next) => {
  try {
    const followerId = req.user.userId;
    const followingId = parseInt(req.params.id, 10);

    if (followerId === followingId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    // Check if the user to follow exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!userToFollow) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkFollowValidity };
