const { signUp, login } = require('../services/authService');

const signUpController = async (req, res) => {
  try {
    const user = await signUp(req.body);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ message: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { token, user } = await login(req.body);
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { signUpController, loginController };
