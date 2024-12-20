const { z } = require('zod');

// Validation for liking/unliking a post
const likePostSchema = z.object({
  id: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'Post ID must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),
});

// Validation for getting likes for a post
const getLikesSchema = z.object({
  id: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'Post ID must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),
});

module.exports = { likePostSchema, getLikesSchema };
