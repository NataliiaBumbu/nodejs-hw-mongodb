import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export const generateToken = (payload, expiresIn = '15m') => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is missing');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token is invalid or expired');
  }
};
