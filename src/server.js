import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import initMongoConnection from './db/initMongoConnection.js';
import contactsRouter from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/contacts', contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 7070;

async function startServer() {
  try {
    console.log("Starting the server...");
    await initMongoConnection(); 
    console.log("MongoDB connection established!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
  }
}

startServer();


export default startServer;
