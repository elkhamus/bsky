const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient');
const { signUpSchema, loginSchema } = require('../validations/authValidation');

const signUp = async (data) => {
  signUpSchema.parse(data); // Validate data with Zod

  const { username, email, password, gender } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email is already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      gender,
    },
  });

  return user;
};

const login = async (data) => {
  loginSchema.parse(data); // Validate data with Zod

  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user: { id: user.id, username: user.username, email: user.email } };
};

module.exports = { signUp, login };
