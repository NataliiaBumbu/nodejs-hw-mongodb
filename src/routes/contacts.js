import express from 'express';
import { getAllContacts, getContactByIdController } from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', getAllContacts);
router.get('/:contactId', getContactByIdController);

export default router;
