const { z } = require('zod');

// Validation schema for creating a comment
const createCommentSchema = z.object({
  content: z.string().min(1, { message: 'Comment content cannot be empty' }),
  postId: z
    .union([z.string(), z.number()]) // Allow postId to be either string or number
    .refine((val) => !isNaN(Number(val)), {
      message: 'Post ID must be a valid number',
    })
    .transform((val) => Number(val)), // Ensure it's a number
});

module.exports = { createCommentSchema };