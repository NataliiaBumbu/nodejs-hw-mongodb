import express from 'express';
import contactsRouter from './routes/contacts.js'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use('/contacts', contactsRouter); 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
