import Contact from '../db/contact.js';

export const getContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    throw new Error('Unable to retrieve contacts');
  }
};

export const getContactById = async (id) => {
  try {
    const contact = await Contact.findById(id);
    return contact;
  } catch (error) {
    throw new Error('Unable to retrieve contact');
  }
};
