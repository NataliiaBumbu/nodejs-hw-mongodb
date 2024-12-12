import createError from 'http-errors'; 
import ContactModel from '../models/contact.js'; 
import ctrlWrapper from '../utils/ctrlWrapper.js'; 

// Отримати всі контакти з пагінацією, сортуванням і фільтрацією
const getAllContactsHandler = async (req, res) => {
  const { 
    page = 1, 
    perPage = 10, 
    sortBy = "name", 
    sortOrder = "asc", 
    type, 
    isFavourite 
  } = req.query; // Отримуємо параметри запиту

  const pageNumber = Number(page); // Перетворюємо на число
  const itemsPerPage = Number(perPage);
  const sortDirection = sortOrder.toLowerCase() === "desc" ? -1 : 1;

  // Формуємо фільтр
  const filter = {};
  if (type) {
    filter.contactType = type; // Фільтрація за типом
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === "true"; // Фільтрація за обраними
  }

  const totalItems = await ContactModel.countDocuments(filter); // Загальна кількість елементів
  const totalPages = Math.ceil(totalItems / itemsPerPage); // Загальна кількість сторінок

  if (pageNumber > totalPages && totalItems > 0) {
    throw createError(400, "Page number exceeds total pages.");
  }

  const contacts = await ContactModel.find(filter) // Застосовуємо фільтр
    .sort({ [sortBy]: sortDirection }) // Сортування
    .skip((pageNumber - 1) * itemsPerPage) // Пропускаємо елементи для попередніх сторінок
    .limit(itemsPerPage); // Обмежуємо кількість елементів

  res.status(200).json({
    status: 200,
    message: "Successfully retrieved all contacts",
    data: {
      data: contacts, // Масив контактів
      page: pageNumber, // Поточна сторінка
      perPage: itemsPerPage, // Кількість елементів на сторінці
      totalItems, // Загальна кількість елементів
      totalPages, // Загальна кількість сторінок
      hasPreviousPage: pageNumber > 1, // Чи є попередня сторінка
      hasNextPage: pageNumber < totalPages, // Чи є наступна сторінка
    },
  });
};

// Отримати контакт за ID
const getContactByIdHandler = async (req, res) => {
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
const createContactHandler = async (req, res) => {
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
const updateContactHandler = async (req, res) => {
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
const deleteContactHandler = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await ContactModel.findByIdAndDelete(contactId);
  if (!deletedContact) {
    throw createError(404, "Contact not found");
  }
  res.status(204).send(); 
};

// Експортуємо контролери, обгорнуті у ctrlWrapper
export const getAllContacts = ctrlWrapper(getAllContactsHandler);
export const getContactById = ctrlWrapper(getContactByIdHandler);
export const createContact = ctrlWrapper(createContactHandler);
export const updateContact = ctrlWrapper(updateContactHandler);
export const deleteContact = ctrlWrapper(deleteContactHandler);
