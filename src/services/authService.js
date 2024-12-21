const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient');
const { signUpSchema, loginSchema } = require('../validations/authValidation');

const signUp = async (data) => {
  try {
    const validationResult = signUpSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }

    const { username, email, password, gender } = validationResult.data;

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
      select: {
        id: true,
        username: true,
        email: true,
        gender: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    throw error;
  }
};

const login = async (data) => {
  try {
    const validationResult = loginSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }

    const { email, password } = validationResult.data;

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

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { signUp, login };
