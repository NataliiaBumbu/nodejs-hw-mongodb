
import startServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

async function startApp() {
  try {
    await initMongoConnection();
    startServer();
  } catch (error) {
    console.error('Failed to start the application', error);
    process.exit(1);
  }
}

startApp();
