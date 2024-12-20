const { z } = require('zod');

const createPostSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty'),
});

module.exports = { createPostSchema };
