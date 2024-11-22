import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import dotenv from 'dotenv';
dotenv.config();

async function startApp() {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Failed to start the application', error);
    process.exit(1);
  }
}

startApp();
