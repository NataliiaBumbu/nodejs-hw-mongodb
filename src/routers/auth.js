import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../utils/authSchemas.js';

const router = express.Router();

router.post('/register', validateBody(registerUserSchema), registerUser);
router.post('/login', validateBody(loginUserSchema), loginUser);

export default router;
