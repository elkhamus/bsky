const request = require('supertest');
const app = require('../src/index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Comment Endpoints', () => {
  let authToken;
  let userId;
  let postId;

  beforeAll(async () => {
    // Create a test user and get auth token
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'commentuser',
        email: 'comment@example.com',
        password: 'password123',
        gender: 'MALE'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'comment@example.com',
        password: 'password123'
      });

    authToken = loginRes.body.token;
    userId = loginRes.body.user.id;

    // Create a test post
    const postRes = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'Test post for comments'
      });

    postId = postRes.body.post.id;
  });

  describe('POST /api/posts/:id/comments', () => {
    it('should create a new comment', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test comment',
          postId: postId
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('comment');
      expect(res.body.comment.content).toBe('Test comment');
    });

    it('should not create comment without auth', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .send({
          content: 'Test comment',
          postId: postId
        });
      
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/posts/:id/comments', () => {
    it('should get all comments for a post', async () => {
      const res = await request(app)
        .get(`/api/posts/${postId}/comments`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return empty array for post with no comments', async () => {
      const newPostRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Post without comments'
        });

      const res = await request(app)
        .get(`/api/posts/${newPostRes.body.post.id}/comments`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });
});
