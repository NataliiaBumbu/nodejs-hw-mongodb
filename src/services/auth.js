import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import UserModel from '../models/User.js';
import SessionModel from '../models/Session.js';

// Хелпер для створення токенів
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });

  return { accessToken, refreshToken };
};

// Створення нового користувача
export const registerUserService = async ({ name, email, password }) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email is already in use');
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

  const { accessToken, refreshToken } = generateTokens(user._id);

  // Оновлення сесії
  await SessionModel.findOneAndUpdate(
    { userId: user._id },
    {
      accessToken,
      refreshToken,
      accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
      refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
    { upsert: true, new: true }
  );

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

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

  // Оновлення сесії
  session.accessToken = accessToken;
  session.refreshToken = newRefreshToken;
  session.accessTokenValidUntil = Date.now() + 15 * 60 * 1000;
  session.refreshTokenValidUntil = Date.now() + 30 * 24 * 60 * 60 * 1000;
  await session.save();

  return { accessToken, refreshToken: newRefreshToken };
};

// Перевірка токену на чорний список
export const isTokenBlacklisted = async (token) => {
  const session = await SessionModel.findOne({ accessToken: token });
  return !session;
};

// Логаут користувача
export const logoutUserService = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is missing');
  }

  const session = await SessionModel.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  console.log('Session deleted successfully');
};

// Скидання пароля
export const resetPasswordService = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw createHttpError(400, 'Token and new password are required');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw createHttpError(401, 'Invalid or expired reset token');
  }

  const user = await UserModel.findOne({ email: decoded.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.sessions = []; // Завжди очищаємо сесії при зміні пароля
  await user.save();

  return 'Password has been successfully reset';
};

// Генерація токену для скидання пароля
export const generateResetPasswordToken = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return resetToken;
};
