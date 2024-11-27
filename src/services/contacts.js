import ContactModel from '../models/contact.js'; 

export const getContacts = async () => {
  return await ContactModel.find(); 
};

export const getContactById = async (contactId) => {
  return await ContactModel.findById(contactId); 
};
