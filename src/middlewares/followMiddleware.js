const prisma = require('../utils/prismaClient');
const { followUserSchema, checkFollowingSchema } = require('../validations/followValidation');

// Middleware to validate followingId (for follow/unfollow actions)
const validateFollowUser = (req, res, next) => {
  const result = followUserSchema.safeParse({ id: req.params.id });
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }
  req.params.id = result.data.id; // Use the transformed ID
  next();
};

// Middleware to validate followingId (for check following)
const validateCheckFollowing = (req, res, next) => {
  const result = checkFollowingSchema.safeParse({ id: req.params.id });
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }
  req.params.id = result.data.id; // Use the transformed ID
  next();
};

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

module.exports = { validateFollowUser, validateCheckFollowing, checkFollowValidity };
