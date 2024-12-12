import createError from 'http-errors'; 
import ContactModel from '../models/contact.js'; 
import ctrlWrapper from '../utils/ctrlWrapper.js';
import createHttpError from 'http-errors';

// Отримати всі контакти користувача
const getAllContactsHandler = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    type,
    isFavourite,
  } = req.query;
  const { _id: userId } = req.user;

  const pageNumber = Number(page);
  const itemsPerPage = Number(perPage);
  const sortDirection = sortOrder.toLowerCase() === "desc" ? -1 : 1;

  const filter = { userId };
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === "true";

  const totalItems = await ContactModel.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (pageNumber > totalPages && totalItems > 0) {
    throw createError(400, "Page number exceeds total pages.");
  }

  const contacts = await ContactModel.find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip((pageNumber - 1) * itemsPerPage)
    .limit(itemsPerPage);

  res.status(200).json({
    status: 200,
    message: "Successfully retrieved all contacts",
    data: {
      contacts,
      page: pageNumber,
      perPage: itemsPerPage,
      totalItems,
      totalPages,
      hasPreviousPage: pageNumber > 1,
      hasNextPage: pageNumber < totalPages,
    },
  });
};

// Отримати контакт за ID
const getContactByIdHandler = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user; 

  const contact = await ContactModel.findOne({ _id: contactId, userId }); // Пошук одночасно за contactId та userId
  if (!contact) throw createHttpError(404, "Contact not found");

  res.status(200).json({
    status: 200,
    message: `Successfully retrieved contact with ID ${contactId}`,
    data: contact,
  });
};


// Створити новий контакт
const createContactHandler = async (req, res) => {
  const { body, user } = req;
  const newContact = await ContactModel.create({ ...body, userId: user._id });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
};

// Оновити контакт за ID
const updateContactHandler = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const updatedContact = await ContactModel.findOneAndUpdate(
    { _id: contactId, userId }, 
    req.body,
    { new: true } 
  );
  if (!updatedContact) throw createHttpError(404, "Contact not found");

  res.status(200).json({
    status: 200,
    message: `Successfully updated contact with ID ${contactId}`,
    data: updatedContact,
  });
};


// Видалити контакт за ID
const deleteContactHandler = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const deletedContact = await ContactModel.findOneAndDelete({
    _id: contactId, 
    userId, 
  });
  if (!deletedContact) throw createHttpError(404, "Contact not found");

  res.status(204).send(); 
};


// Експорт
export const getAllContacts = ctrlWrapper(getAllContactsHandler);
export const getContactById = ctrlWrapper(getContactByIdHandler);
export const createContact = ctrlWrapper(createContactHandler);
export const updateContact = ctrlWrapper(updateContactHandler);
export const deleteContact = ctrlWrapper(deleteContactHandler);
