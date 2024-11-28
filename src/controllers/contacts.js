import createError from 'http-errors'; 
import ContactModel from '../models/contact.js'; 
import ctrlWrapper from '../helpers/ctrlWrapper.js'; 

// Отримати всі контакти
const getAllContacts = async (req, res) => {
  const contacts = await ContactModel.find();
  res.status(200).json({
    status: 200,
    message: "Successfully retrieved all contacts",
    data: contacts,
  });
};

// Отримати контакт за ID
const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await ContactModel.findById(contactId);
  if (!contact) {
    throw createError(404, "Contact not found");
  }
  res.status(200).json({
    status: 200,
    message: `Successfully retrieved contact with ID ${contactId}`,
    data: contact,
  });
};

// Створити новий контакт
const createContact = async (req, res) => {
  const { name, phoneNumber, contactType, email, isFavourite } = req.body;
  if (!name || !phoneNumber || !contactType) {
    throw createError(400, "Name, phoneNumber, and contactType are required fields.");
  }
  const newContact = await ContactModel.create({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
};

// Оновити контакт за ID
const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await ContactModel.findByIdAndUpdate(contactId, req.body, {
    new: true, 
  });
  if (!updatedContact) {
    throw createError(404, "Contact not found");
  }
  res.status(200).json({
    status: 200,
    message: `Successfully updated contact with ID ${contactId}`,
    data: updatedContact,
  });
};

// Видалити контакт за ID
const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await ContactModel.findByIdAndDelete(contactId);
  if (!deletedContact) {
    throw createError(404, "Contact not found");
  }
  res.status(204).send(); 
};

// Експортуємо контролери, обгорнуті у ctrlWrapper
export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
