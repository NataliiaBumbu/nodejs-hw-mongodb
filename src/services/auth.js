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

  // Видалення існуючої сесії
  await SessionModel.findOneAndDelete({ userId: user._id });

  // Створення нової сесії
  try {
    await SessionModel.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
      refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(409, 'Duplicate session error');
    }
    throw error;
  }

  return { accessToken, refreshToken };
};

// Оновлення сесії
export const refreshSessionService = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is missing');
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Refresh token expired');
    }
    throw createHttpError(401, 'Invalid refresh token');
  }

  const session = await SessionModel.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  const newRefreshToken = jwt.sign({ userId: decoded.userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });

  // Видалення старої сесії
  await SessionModel.findOneAndDelete({ refreshToken });

  // Створення нової сесії
  try {
    await SessionModel.create({
      userId: decoded.userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
      refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(409, 'Duplicate session error');
    }
    throw error;
  }

  return { accessToken, refreshToken: newRefreshToken };
};

// Видалення сесії
export const logoutUserService = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is missing');
  }

  const session = await SessionModel.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
};
