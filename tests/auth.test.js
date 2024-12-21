const request = require('supertest');
const app = require('../src/index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    gender: 'MALE'
  };

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      // Make sure the user doesn't exist
      await prisma.user.deleteMany({
        where: { email: testUser.email }
      });

      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should not allow duplicate email', async () => {
      // Create the user first
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      // Try to create the same user again
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Email is already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Make sure the user doesn't exist
      await prisma.user.deleteMany({
        where: { email: testUser.email }
      });

      // Create a user before trying to log in
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);
    });

    it('should login existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });
  });
});
