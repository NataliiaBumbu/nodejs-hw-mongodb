import express from 'express';
import { swaggerServe, swaggerDocs } from '../middlewares/swaggerDocs.js';

const router = express.Router();

// Роут для документації
router.use('/', swaggerServe, swaggerDocs);

export default router;
