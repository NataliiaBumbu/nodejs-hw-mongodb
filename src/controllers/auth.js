import createHttpError from 'http-errors';
import { 
  registerUserService, 
  loginUserService, 
  refreshSessionService, 
  resetPasswordService, 
  generateResetPasswordToken, 
  logoutUserService
} from '../services/auth.js';
import { sendMail } from '../utils/email.js';

// Реєстрація користувача
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await registerUserService({ name, email, password });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered user!',
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

// Логін користувача
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await loginUserService({ email, password });

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
        message: 'Successfully logged in!',
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
      throw createHttpError(401, 'Refresh token is missing');
    }

    const { accessToken, refreshToken: newRefreshToken } = await refreshSessionService(refreshToken);

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
        message: 'Session successfully refreshed!',
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
      throw createHttpError(401, 'Refresh token is missing');
    }

    await logoutUserService(refreshToken); // виправлено на logoutUserService
    res.clearCookie('refreshToken').status(204).send();
  } catch (error) {
    next(error);
  }
};

// Надсилання листа для скиду пароля
export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const resetToken = await generateResetPasswordToken(email);
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

    // Надсилаємо електронний лист з посиланням для скидання пароля
    await sendMail({
      to: email,
      subject: 'Reset your password',
      html: `
        <p>To reset your password, click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>The link is valid for 1 hour.</p>
      `,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
    });
  } catch (error) {
    next(error);
  }
};

// Скидання пароля
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    await resetPasswordService(token, newPassword);

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
    });
  } catch (error) {
    next(error);
  }
};
