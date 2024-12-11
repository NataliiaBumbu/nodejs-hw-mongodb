import { createUserService, loginUserService, refreshSessionService, logoutUserService  } from '../services/auth.js';

export const registerUser = async (req, res, next) => {
  try {
    const newUser = await createUserService(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await loginUserService(req.body);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, 
      })
      .status(200)
      .json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: { accessToken },
      });
  } catch (error) {
    next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await refreshSessionService(req.cookies.refreshToken);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, 
      })
      .status(200)
      .json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: { accessToken },
      });
  } catch (error) {
    next(error);
  }
};
export const logoutUser = async (req, res, next) => {
    try {
      await logoutUserService(req.cookies.refreshToken);
      res.clearCookie('refreshToken').status(204).send();
    } catch (error) {
      next(error);
    }
  };
