import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import initMongoConnection from './db/initMongoConnection.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js'; 
import apiDocsRouter from './routers/apiDocs.js'; // Swagger Router
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRouter); // Authorization and Registration
app.use('/contacts', contactsRouter); // Contacts
app.use('/api-docs', apiDocsRouter); // Swagger Documentation

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4002;

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

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

startServer();

export default app;
