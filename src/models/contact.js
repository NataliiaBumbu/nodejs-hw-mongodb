import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Обов'язкове поле
    phoneNumber: { type: String, required: true }, // Обов'язкове поле
    email: { type: String }, // Не обов'язкове поле
    isFavourite: { type: Boolean, default: false }, // Не обов'язкове поле
    contactType: { type: String, required: true }, // Обов'язкове поле
  },
  { timestamps: true } // Додає createdAt і updatedAt
);

const ContactModel = mongoose.model('Contact', contactSchema);

export default ContactModel;
