import createError from 'http-errors';
import * as contactService from '../services/contacts.js'; 
import ctrlWrapper from '../utils/ctrlWrapper.js';

// ======================= GET ALL CONTACTS ==========================
const getAllContactsHandler = async (req, res) => {
  const userId = req.user._id; 
  const { page = 1, perPage = 10 } = req.query; 
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(perPage, 10);

  if (pageNumber < 1 || pageSize < 1) {
    throw createError(400, 'Page and perPage must be positive integers.');
  }

  const { contacts, totalItems } = await contactService.getContacts(userId, pageNumber, pageSize);
  const totalPages = Math.ceil(totalItems / pageSize);

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved contacts',
    data: {
      contacts,
      page: pageNumber,
      perPage: pageSize,
      totalItems,
      totalPages,
      hasPreviousPage: pageNumber > 1,
      hasNextPage: pageNumber < totalPages,
    },
  });
};

// ======================= CREATE CONTACT ==========================
const createContactHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, phoneNumber, contactType } = req.body;
    const { path: photoPath } = req.file || {}; // Отримуємо посилання на фото, якщо є

    const newContact = await contactService.createContact({
      name,
      phoneNumber,
      contactType,
      userId,
      photo: photoPath || null, // Зберігаємо посилання на фото
    });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    console.error('Error in createContactHandler:', error.message); // Лог для діагностики
    res.status(500).json({
      status: 500,
      message: error.message || 'Something went wrong',
    });
  }
};

// ======================= GET CONTACT BY ID ==========================
const getContactByIdHandler = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await contactService.getContactById(contactId, userId);

  res.status(200).json({
    status: 200,
    message: 'Contact retrieved successfully',
    data: contact,
  });
};

// ======================= UPDATE CONTACT ==========================
const updateContactHandler = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const updateData = req.body;
  const { path: photoPath } = req.file || {}; // Отримуємо нове фото, якщо воно є

  if (photoPath) {
    updateData.photo = photoPath; // Додаємо нове фото до даних
  }

  const updatedContact = await contactService.updateContact(contactId, userId, updateData);

  res.status(200).json({
    status: 200,
    message: 'Contact updated successfully',
    data: updatedContact,
  });
};

// ======================= DELETE CONTACT ==========================
const deleteContactHandler = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  await contactService.deleteContact(contactId, userId);

  res.status(204).send();
};

// ======================= EXPORT HANDLERS ==========================
export const getAllContacts = ctrlWrapper(getAllContactsHandler);
export const createContact = ctrlWrapper(createContactHandler);
export const getContactById = ctrlWrapper(getContactByIdHandler);
export const updateContact = ctrlWrapper(updateContactHandler);
export const deleteContact = ctrlWrapper(deleteContactHandler);
