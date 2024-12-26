import dotenv from 'dotenv';
dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

import express from 'express';
import cors from 'cors';
import initMongoConnection from './db/initMongoConnection.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js'; 
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';



const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Підключення маршрутів
app.use('/auth', authRouter); // Авторизація та реєстрація
app.use('/contacts', contactsRouter); // Робота з контактами

// Middleware для обробки 404
app.use(notFoundHandler);

// Middleware для обробки помилок
app.use(errorHandler);

const PORT = process.env.PORT || 3003;

async function startServer() {
  try {
    console.log('Starting the server...');
    await initMongoConnection();
    console.log('MongoDB connection established!');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error.message);
  }
}

startServer();

export default startServer;
