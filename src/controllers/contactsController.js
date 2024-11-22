import mongoose from 'mongoose';
import { getContacts, getContactById } from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  console.log('getAllContacts called');
  try {
    const contacts = await getContacts();
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve contacts",
      error: error.message,
    });
  }
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  console.log('Received contactId:', contactId);

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid contact ID format',
    });
  }

  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to retrieve contact',
      error: error.message,
    });
  }
};
