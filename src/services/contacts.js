import createError from 'http-errors';
import mongoose from 'mongoose';
import ContactModel from '../models/contact.js';

// Отримати всі контакти
export const getContacts = async (userId, page, limit) => {
  const skip = (page - 1) * limit;
  const contacts = await ContactModel.find({ userId })
    .skip(skip)
    .limit(limit);

  const totalItems = await ContactModel.countDocuments({ userId });

  return { contacts, totalItems };
};

// Отримати контакт за ID
export const getContactById = async (contactId, userId) => {
  validateObjectId(contactId);

  const contact = await ContactModel.findOne({ _id: contactId, userId });
  if (!contact) throw createError(404, 'Contact not found');

  return contact;
};

// Створити новий контакт
export const createContact = async (data) => {
  const { name, phoneNumber, contactType, userId, photo } = data;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Name, phoneNumber, and contactType are required fields.');
  }

  // Зберігаємо фото разом із контактом
  return ContactModel.create({ name, phoneNumber, contactType, userId, photo });
};

// Оновити контакт за ID
export const updateContact = async (contactId, userId, data) => {
  validateObjectId(contactId);

  const updatedContact = await ContactModel.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    {
      new: true, 
      runValidators: true, 
    }
  );

  if (!updatedContact) throw createError(404, 'Contact not found');

  return updatedContact;
};

// Видалити контакт за ID
export const deleteContact = async (contactId, userId) => {
  validateObjectId(contactId);

  const deletedContact = await ContactModel.findOneAndDelete({ _id: contactId, userId });
  if (!deletedContact) throw createError(404, 'Contact not found');

  return deletedContact;
};

// Валідація ObjectId
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'Invalid contact ID');
  }
};
