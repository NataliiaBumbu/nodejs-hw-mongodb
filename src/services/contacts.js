import ContactModel from '../models/contact.js'; 
import mongoose from 'mongoose';
import createError from 'http-errors';

// Отримати всі контакти
export const getContacts = async () => {
  return ContactModel.find(); // Не потрібен `await`, якщо ви передаєте promise далі
};

// Отримати контакт за ID
export const getContactById = async (contactId) => {
  validateObjectId(contactId);

  const contact = await ContactModel.findById(contactId);
  if (!contact) throw createError(404, 'Contact not found');

  return contact;
};

// Створити новий контакт
export const createContact = async (data) => {
  const { name, phoneNumber, contactType } = data;
  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Name, phoneNumber, and contactType are required fields.');
  }

  return ContactModel.create(data);
};

// Оновити контакт за ID
export const updateContact = async (contactId, data) => {
  validateObjectId(contactId);

  const updatedContact = await ContactModel.findByIdAndUpdate(contactId, data, {
    new: true, // Повернути оновлений документ
    runValidators: true, // Запустити валідацію моделі
  });

  if (!updatedContact) throw createError(404, 'Contact not found');

  return updatedContact;
};

// Видалити контакт за ID
export const deleteContact = async (contactId) => {
  validateObjectId(contactId);

  const deletedContact = await ContactModel.findByIdAndDelete(contactId);
  if (!deletedContact) throw createError(404, 'Contact not found');

  return deletedContact;
};

// Валідація ObjectId
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'Invalid contact ID');
  }
};
