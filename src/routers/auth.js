import express from 'express';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendResetEmail,
  resetPassword,
} from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
} from '../utils/authSchemas.js';

const router = express.Router();

router.post('/register', validateBody(registerUserSchema), registerUser);
router.post('/login', validateBody(loginUserSchema), loginUser);
router.post('/refresh', refreshSession);
router.post('/logout', logoutUser);
router.post('/send-reset-email', validateBody(sendResetEmailSchema), sendResetEmail);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPassword);

export default router;
