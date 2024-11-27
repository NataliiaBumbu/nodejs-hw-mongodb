export const getAllContacts = (req, res) => {
    res.json({ message: 'Get all contacts' });
  };
  
  export const getContactById = (req, res) => {
    const { contactId } = req.params;
    res.json({ message: `Get contact with ID ${contactId}` });
  };
  
  export const createContact = (req, res) => {
    const newContact = req.body;
    res.status(201).json({ message: 'Contact created', contact: newContact });
  };
  
  export const updateContact = (req, res) => {
    const { contactId } = req.params;
    const updatedContact = req.body;
    res.json({ message: `Contact with ID ${contactId} updated`, contact: updatedContact });
  };
  
  export const deleteContact = (req, res) => {
    const { contactId } = req.params;
    res.json({ message: `Contact with ID ${contactId} deleted` });
  };
  