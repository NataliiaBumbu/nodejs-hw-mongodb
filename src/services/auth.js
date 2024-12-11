import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import UserModel from '../models/User.js';
import SessionModel from '../models/Session.js';

// Створення нового користувача
export const createUserService = async ({ name, email, password }) => {
  if (await UserModel.findOne({ email })) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return UserModel.create({ name, email, password: hashedPassword });
};

// Логін користувача
export const loginUserService = async ({ email, password }) => {
  const user = await UserModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });

  await SessionModel.findOneAndDelete({ userId: user._id });
  await SessionModel.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
    refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};
