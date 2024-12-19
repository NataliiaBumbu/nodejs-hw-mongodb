import createError from 'http-errors';
import mongoose from 'mongoose';
import ContactModel from '../models/contact.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

// ======================= GET ALL CONTACTS (WITH PAGINATION) ==========================
const getAllContactsHandler = async (req, res) => {
  try {
    const userId = req.user._id; 

    // Отримуємо параметри пагінації
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (pageNumber < 1 || pageSize < 1) {
      return res.status(400).json({ message: "Page and limit must be positive integers." });
    }

    const skip = (pageNumber - 1) * pageSize; 

    // Знаходимо контакти з урахуванням пагінації
    const contacts = await ContactModel.find({ userId })
      .skip(skip)
      .limit(pageSize);

    // Підраховуємо загальну кількість контактів
    const totalItems = await ContactModel.countDocuments({ userId });

    res.status(200).json({
      status: 200,
      message: "Successfully retrieved contacts",
      data: {
        contacts,
        totalItems,
        page: pageNumber,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    });
  } catch (error) {
    console.error("Error retrieving contacts:", error.message);
    throw createError(500, "Failed to retrieve contacts");
  }
};

// ======================= CREATE CONTACT ==========================
const createContactHandler = async (req, res) => {
  const { name, phoneNumber, contactType } = req.body;
  const userId = req.user._id; 

  if (!name || !phoneNumber || !contactType) {
    return res.status(400).json({ message: "Name, phoneNumber, and contactType are required." });
  }

  try {
    const newContact = await ContactModel.create({ name, phoneNumber, contactType, userId });
    res.status(201).json({
      status: 201,
      message: "Contact created successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error.message);
    throw createError(500, "Failed to create contact");
  }
};

// ======================= GET CONTACT BY ID ==========================
const getContactByIdHandler = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id; 

  if (!mongoose.isValidObjectId(contactId)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  try {
    const contact = await ContactModel.findOne({ _id: contactId, userId }); 
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    res.status(200).json({
      status: 200,
      message: "Contact retrieved successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error retrieving contact:", error.message);
    throw createError(500, "Failed to retrieve contact");
  }
};

// ======================= UPDATE CONTACT ==========================
const updateContactHandler = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id; 

  if (!mongoose.isValidObjectId(contactId)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  try {
    const updatedContact = await ContactModel.findOneAndUpdate(
      { _id: contactId, userId }, 
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedContact) return res.status(404).json({ message: "Contact not found" });

    res.status(200).json({
      status: 200,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error.message);
    throw createError(500, "Failed to update contact");
  }
};

// ======================= DELETE CONTACT ==========================
const deleteContactHandler = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id; 

  if (!mongoose.isValidObjectId(contactId)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  try {
    const deletedContact = await ContactModel.findOneAndDelete({ _id: contactId, userId }); // Додаємо фільтрацію за userId
    if (!deletedContact) return res.status(404).json({ message: "Contact not found" });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting contact:", error.message);
    throw createError(500, "Failed to delete contact");
  }
};

// ======================= EXPORT HANDLERS ==========================
export const getAllContacts = ctrlWrapper(getAllContactsHandler);
export const createContact = ctrlWrapper(createContactHandler);
export const getContactById = ctrlWrapper(getContactByIdHandler);
export const updateContact = ctrlWrapper(updateContactHandler);
export const deleteContact = ctrlWrapper(deleteContactHandler);
