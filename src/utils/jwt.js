import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export const generateToken = (payload, expiresIn = '15m') => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is missing');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token is invalid or expired');
  }
};
