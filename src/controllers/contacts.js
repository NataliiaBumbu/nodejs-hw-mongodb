import createError from 'http-errors';
import mongoose from 'mongoose';
import ContactModel from '../models/contact.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

// ======================= GET ALL CONTACTS ==========================
const getAllContactsHandler = async (req, res) => {
  const { page = 1, perPage = 10, sortBy = "name", sortOrder = "asc", type, isFavourite } = req.query;
  const { _id: userId } = req.user;

  // Перевірка, чи є userId дійсним ObjectId
  const userObjectId = mongoose.Types.ObjectId(userId);
  if (!mongoose.Types.ObjectId.isValid(userObjectId)) {
    throw createError(400, "Invalid user ID");
  }

  const pageNumber = Math.max(Number(page), 1);
  const itemsPerPage = Math.max(Number(perPage), 5);
  const sortDirection = sortOrder.toLowerCase() === "desc" ? -1 : 1;

  const filter = { userId: userObjectId };
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === "true";

  const totalItems = await ContactModel.countDocuments(filter);
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
      totalPages: Math.ceil(totalItems / itemsPerPage),
      hasPreviousPage: pageNumber > 1,
      hasNextPage: pageNumber < Math.ceil(totalItems / itemsPerPage),
    },
  });
};

// ======================= CREATE CONTACT ==========================
const createContactHandler = async (req, res) => {
  const { _id: userId } = req.user;
  const { name, phoneNumber, contactType } = req.body;

  // Перевірка, чи є userId дійсним ObjectId
  const userObjectId = mongoose.Types.ObjectId(userId);
  if (!mongoose.Types.ObjectId.isValid(userObjectId)) {
    throw createError(400, "Invalid user ID");
  }

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, "Name, phoneNumber, and contactType are required fields.");
  }

  const newContact = await ContactModel.create({ ...req.body, userId: userObjectId });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
};

// ======================= GET CONTACT BY ID ==========================
const getContactByIdHandler = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  // Перевірка ID контактів і userId
  if (!mongoose.Types.ObjectId.isValid(contactId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw createError(400, "Invalid contact ID or user ID format");
  }

  const contact = await ContactModel.findOne({
    _id: mongoose.Types.ObjectId(contactId),
    userId: mongoose.Types.ObjectId(userId),
  });

  if (!contact) throw createError(404, "Contact not found");

  res.status(200).json({
    status: 200,
    message: "Successfully retrieved contact",
    data: contact,
  });
};

// ======================= UPDATE CONTACT ==========================
const updateContactHandler = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(contactId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw createError(400, "Invalid contact ID or user ID format");
  }

  const updatedContact = await ContactModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(contactId), userId: mongoose.Types.ObjectId(userId) },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedContact) throw createError(404, "Contact not found");

  res.status(200).json({
    status: 200,
    message: "Successfully updated contact",
    data: updatedContact,
  });
};

// ======================= DELETE CONTACT ==========================
const deleteContactHandler = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(contactId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw createError(400, "Invalid contact ID or user ID format");
  }

  const deletedContact = await ContactModel.findOneAndDelete({
    _id: mongoose.Types.ObjectId(contactId),
    userId: mongoose.Types.ObjectId(userId),
  });
  if (!deletedContact) throw createError(404, "Contact not found");

  res.status(204).send();
};

// ======================= EXPORT HANDLERS ==========================
export const getAllContacts = ctrlWrapper(getAllContactsHandler);
export const createContact = ctrlWrapper(createContactHandler);
export const getContactById = ctrlWrapper(getContactByIdHandler);
export const updateContact = ctrlWrapper(updateContactHandler);
export const deleteContact = ctrlWrapper(deleteContactHandler);
