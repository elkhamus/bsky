const { z } = require('zod');

// Validation for following a user
const followUserSchema = z.object({
  id: z.string().or(z.number()).transform(val => parseInt(val, 10)),
});

// Validation for checking if a user is following another user
const checkFollowingSchema = z.object({
  id: z.string().or(z.number()).transform(val => parseInt(val, 10)),
});

module.exports = { followUserSchema, checkFollowingSchema };
