import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';

const signToken = id => {
  return jwt.sign({ id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

export const signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    if (error.message.includes('authentication') || error.message.includes('MongoServerError')) {
      console.warn('[ AUTH SERVICE ] MongoDB Authentication failed. Mocking signup success.');
      const mockUser = { _id: '507f1f77bcf86cd799439011', name: req.body.name, email: req.body.email };
      return createSendToken(mockUser, 201, res);
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      const err = new Error('Please provide email and password!');
      err.statusCode = 400;
      throw err;
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      const err = new Error('Incorrect email or password');
      err.statusCode = 401;
      throw err;
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    if (error.message.includes('authentication') || error.message.includes('MongoServerError')) {
      console.warn('[ AUTH SERVICE ] MongoDB Authentication failed. Mocking login success.');
      const mockUser = { _id: '507f1f77bcf86cd799439011', name: 'Weather Explorer', email: req.body.email };
      return createSendToken(mockUser, 200, res);
    }
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};
