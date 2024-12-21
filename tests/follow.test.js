const request = require('supertest');
const app = require('../src/index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Follow Endpoints', () => {
  let authToken1, authToken2;
  let user1Id, user2Id;

  beforeEach(async () => {
    // Delete all related records first
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.user.deleteMany();

    // Create first test user
    const signup1Res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'followuser1',
        email: 'follow1@example.com',
        password: 'password123',
        gender: 'MALE'
      });

    const login1Res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'follow1@example.com',
        password: 'password123'
      });

    authToken1 = login1Res.body.token;
    user1Id = login1Res.body.user.id;

    // Create second test user
    const signup2Res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'followuser2',
        email: 'follow2@example.com',
        password: 'password123',
        gender: 'MALE'
      });

    const login2Res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'follow2@example.com',
        password: 'password123'
      });

    authToken2 = login2Res.body.token;
    user2Id = login2Res.body.user.id;
  });

  describe('POST /api/follow/:id/follow', () => {
    it('should follow another user', async () => {
      const res = await request(app)
        .post(`/api/follow/${user2Id}/follow`)
        .set('Authorization', `Bearer ${authToken1}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Successfully followed user');
    });

    it('should not allow following oneself', async () => {
      const res = await request(app)
        .post(`/api/follow/${user1Id}/follow`)
        .set('Authorization', `Bearer ${authToken1}`);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'You cannot follow yourself');
    });

    it('should not follow without auth', async () => {
      const res = await request(app)
        .post(`/api/follow/${user2Id}/follow`);
      
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/follow/:id/unfollow', () => {
    beforeEach(async () => {
      // Follow user2 before trying to unfollow
      await request(app)
        .post(`/api/follow/${user2Id}/follow`)
        .set('Authorization', `Bearer ${authToken1}`);
    });

    it('should unfollow a followed user', async () => {
      const res = await request(app)
        .post(`/api/follow/${user2Id}/unfollow`)
        .set('Authorization', `Bearer ${authToken1}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Successfully unfollowed user');
    });
  });

  describe('GET /api/follow/:id/followers', () => {
    beforeEach(async () => {
      // Make user1 follow user2
      await request(app)
        .post(`/api/follow/${user2Id}/follow`)
        .set('Authorization', `Bearer ${authToken1}`);
    });

    it('should get all followers of a user', async () => {
      const res = await request(app)
        .get(`/api/follow/${user2Id}/followers`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].id).toBe(user1Id);
    });
  });

  describe('GET /api/follow/:id/following', () => {
    beforeEach(async () => {
      // Make user1 follow user2
      await request(app)
        .post(`/api/follow/${user2Id}/follow`)
        .set('Authorization', `Bearer ${authToken1}`);
    });

    it('should get all users a user is following', async () => {
      const res = await request(app)
        .get(`/api/follow/${user1Id}/following`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].id).toBe(user2Id);
    });
  });
});
