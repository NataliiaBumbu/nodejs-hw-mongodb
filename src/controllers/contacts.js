import createError from 'http-errors';
import mongoose from 'mongoose';
import ContactModel from '../models/contact.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

// ======================= GET ALL CONTACTS ==========================
const getAllContactsHandler = async (req, res) => {
  const { _id: userId } = req.user;

  // Перевірка валідності userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.log("Invalid user ID:", userId);
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    // Перевірка наявності контактів із userId
    const filter = { userId };
    console.log("Applying filter:", filter);

    const contacts = await ContactModel.find(filter);
    console.log("Contacts found:", contacts);

    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all contacts",
      data: {
        contacts,
        totalItems: contacts.length,
      },
    });
  } catch (error) {
    console.error("Error retrieving contacts:", error.message);
    res.status(500).json({ message: "Failed to retrieve contacts" });
  }
};

// ======================= CREATE CONTACT ==========================
const createContactHandler = async (req, res) => {
  const { _id: userId } = req.user;
  const { name, phoneNumber, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, "Name, phoneNumber, and contactType are required.");
  }

  try {
    const newContact = await ContactModel.create({
      name,
      phoneNumber,
      contactType,
      userId,
    });

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
  const { _id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, "Invalid contact ID");
  }

  try {
    const contact = await ContactModel.findOne({ _id: contactId, userId });
    if (!contact) throw createError(404, "Contact not found");

    res.status(200).json({
      status: 200,
      message: "Contact retrieved successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error.message);
    throw createError(500, "Failed to retrieve contact");
  }
};

// ======================= UPDATE CONTACT ==========================
const updateContactHandler = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, "Invalid contact ID");
  }

  try {
    const updatedContact = await ContactModel.findOneAndUpdate(
      { _id: contactId, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedContact) throw createError(404, "Contact not found");

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
  const { _id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, "Invalid contact ID");
  }

  try {
    const deletedContact = await ContactModel.findOneAndDelete({ _id: contactId, userId });
    if (!deletedContact) throw createError(404, "Contact not found");

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
