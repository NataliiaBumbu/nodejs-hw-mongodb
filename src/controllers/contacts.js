import createError from 'http-errors'; 
import ContactModel from '../models/contact.js'; 

// Отримати всі контакти
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await ContactModel.find(); 
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all contacts",
      data: contacts,
    });
  } catch (error) {
    next(error); 
  }
};

export const getContactById = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error); 
  }
};

export const createContact = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error); 
  }
};


export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const updatedContact = await ContactModel.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true } 
    );

    if (!updatedContact) {
      throw createError(404, "Contact not found");
    }

    res.status(200).json({
      status: 200,
      message: `Successfully updated contact with ID ${contactId}`,
      data: updatedContact,
    });
  } catch (error) {
    next(error); 
  }
};


export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const deletedContact = await ContactModel.findByIdAndDelete(contactId);

    if (!deletedContact) {
      throw createError(404, "Contact not found");
    }

    res.status(204).send(); 
  } catch (error) {
    next(error); 
  }
};
