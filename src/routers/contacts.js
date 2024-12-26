import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../utils/contactSchemas.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js'; // Middleware для завантаження файлів

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContacts);
router.get('/:contactId', isValidId, getContactById);
router.post('/', upload.single('photo'), validateBody(createContactSchema), createContact); // Додано завантаження фото
router.patch('/:contactId', isValidId, upload.single('photo'), validateBody(updateContactSchema), updateContact); // Додано завантаження фото
router.delete('/:contactId', isValidId, deleteContact);

export default router;
