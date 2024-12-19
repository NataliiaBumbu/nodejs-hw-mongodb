import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import UserModel from '../models/User.js';

const authenticate = async (req, res, next) => {
  try {
    // Отримуємо заголовок Authorization з токеном
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw createHttpError(401, 'Authorization header is missing');
    }

    // Розділяємо Bearer та токен
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw createHttpError(401, 'Bearer token is missing or malformed');
    }

    // Верифікуємо токен за допомогою секретного ключа
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw createHttpError(401, 'Access token expired');
        }
        throw createHttpError(401, 'Invalid access token');
      }
      return decoded;
    });

    // Знаходимо користувача за userId з токену
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    // Додаємо користувача до об'єкта запиту
    req.user = { _id: user._id };

    next(); 
  } catch (error) {
    next(error); 
  }
};

export default authenticate;
