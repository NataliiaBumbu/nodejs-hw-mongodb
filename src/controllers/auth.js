import { createUserService, loginUserService, refreshSessionService, logoutUserService } from '../services/auth.js';

// Реєстрація користувача
export const registerUser = async (req, res, next) => {
  try {
    const newUser = await createUserService(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Логін користувача
export const loginUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await loginUserService(req.body);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
      })
      .status(200)
      .json({
        status: 200,
        message: 'Successfully logged in user!',
        data: { accessToken },
      });
  } catch (error) {
    next(error);
  }
};

// Оновлення сесії
export const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        message: 'Refresh token is missing',
      });
    }

    const { accessToken, newRefreshToken } = await refreshSessionService(refreshToken);

    res
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
      })
      .status(200)
      .json({
        status: 200,
        message: 'Successfully refreshed session!',
        data: { accessToken },
      });
  } catch (error) {
    next(error);
  }
};

// Логаут користувача
export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ status: 401, message: 'Refresh token is missing' });
    }

    await logoutUserService(refreshToken); 
    res.clearCookie('refreshToken').status(204).send(); 
  } catch (error) {
    next(error);
  }
};
