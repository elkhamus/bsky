const { z } = require('zod');

// Validation for following a user
const followUserSchema = z.object({
  followingId: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'Following ID must be a valid number',
    })
    .transform((val) => parseInt(val, 10))
    .refine((id) => id !== parseInt(val, 10), { // Ensure the user cannot follow themselves
      message: 'You cannot follow yourself',
    }),
});

// Validation for checking if a user is following another user
const checkFollowingSchema = z.object({
  followingId: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'Following ID must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),
});

module.exports = { followUserSchema, checkFollowingSchema };
