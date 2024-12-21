const request = require('supertest');
const app = require('../src/index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Like Endpoints', () => {
  let authToken;
  let userId;
  let postId;

  beforeAll(async () => {
    // Create a test user and get auth token
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'likeuser',
        email: 'like@example.com',
        password: 'password123',
        gender: 'MALE'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'like@example.com',
        password: 'password123'
      });

    authToken = loginRes.body.token;
    userId = loginRes.body.user.id;

    // Create a test post
    const postRes = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'Test post for likes'
      });

    postId = postRes.body.post.id;
  });

  describe('POST /api/likes/:id/like', () => {
    it('should like a post', async () => {
      const res = await request(app)
        .post(`/api/likes/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Post liked successfully');
    });

    it('should unlike a previously liked post', async () => {
      const res = await request(app)
        .post(`/api/likes/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Post unliked successfully');
    });

    it('should not like post without auth', async () => {
      const res = await request(app)
        .post(`/api/likes/${postId}/like`);
      
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/likes/:id/likes', () => {
    it('should get all likes for a post', async () => {
      // First like the post
      await request(app)
        .post(`/api/likes/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      const res = await request(app)
        .get(`/api/likes/${postId}/likes`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return empty array for post with no likes', async () => {
      const newPostRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Post without likes'
        });

      const res = await request(app)
        .get(`/api/likes/${newPostRes.body.post.id}/likes`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });
});
