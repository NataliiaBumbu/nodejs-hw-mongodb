import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import initMongoConnection from './db/initMongoConnection.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import apiDocsRouter from './routers/apiDocs.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import serverMiddleware from './middlewares/serverMiddleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Маршрути
app.use('/api-docs', apiDocsRouter); // API документація
app.use('/auth', authRouter); // Авторизація та реєстрація
app.use('/contacts', contactsRouter); // Робота з контактами

// Middleware для 404
app.use(notFoundHandler);

// Middleware для обробки помилок
app.use(errorHandler);

const PORT = process.env.PORT || 4002;

// Middleware для запуску сервера
const startApp = serverMiddleware(async () => {
  await initMongoConnection(); // Підключення до MongoDB
});

// Запуск сервера
app.listen(PORT, startApp);

export default app;
