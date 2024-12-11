import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import UserModel from '../models/User.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw createHttpError(401, 'Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw createHttpError(401, 'Bearer token is missing');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user; 
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
