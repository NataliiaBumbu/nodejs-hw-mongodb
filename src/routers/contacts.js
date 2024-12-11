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

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContacts);
router.get('/:contactId', isValidId, getContactById);
router.post('/', validateBody(createContactSchema), createContact);
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), updateContact);
router.delete('/:contactId', isValidId, deleteContact);

export default router;
