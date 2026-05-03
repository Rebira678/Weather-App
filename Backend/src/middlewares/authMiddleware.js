import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';
import env from '../config/env.js';

export const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const err = new Error('You are not logged in! Please log in to get access.');
      err.statusCode = 401;
      throw err;
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, env.jwtSecret);

    // Handle Mock User for Demo purposes
    if (decoded.id === '507f1f77bcf86cd799439011') {
      req.user = { id: '507f1f77bcf86cd799439011', _id: '507f1f77bcf86cd799439011', name: 'Weather Explorer', email: 'explorer@weatherapp.com' };
      return next();
    }

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      const err = new Error('The user belonging to this token no longer exists.');
      err.statusCode = 401;
      throw err;
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};
