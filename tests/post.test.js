const request = require('supertest');
const app = require('../src/index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Post Endpoints', () => {
  let authToken;
  let userId;
  let postId;

  beforeAll(async () => {
    // Create a test user and get auth token
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'postuser',
        email: 'post@example.com',
        password: 'password123',
        gender: 'MALE'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'post@example.com',
        password: 'password123'
      });

    authToken = loginRes.body.token;
    userId = loginRes.body.user.id;
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test post content'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('post');
      expect(res.body.post.content).toBe('Test post content');
      postId = res.body.post.id;
    });

    it('should not create post without auth', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          content: 'Test post content'
        });
      
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/posts', () => {
    it('should get all posts', async () => {
      const res = await request(app)
        .get('/api/posts');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should get post by id', async () => {
      const res = await request(app)
        .get(`/api/posts/${postId}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', postId);
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app)
        .get('/api/posts/99999');
      
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete own post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
    });

    it('should not delete post without auth', async () => {
      const res = await request(app)
        .delete(`/api/posts/${postId}`);
      
      expect(res.statusCode).toBe(401);
    });
  });
});
