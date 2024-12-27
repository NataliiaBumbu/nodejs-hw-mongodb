import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT), // Перетворюємо на число
  secure: false, // Використовуємо SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
console.log('SMTP Configuration:');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('User:', process.env.SMTP_USER);
console.log('Password:', process.env.SMTP_PASSWORD ? 'Loaded' : 'Missing');
console.log('From:', process.env.SMTP_FROM);

// Додаємо перевірку з'єднання
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error.message);
  } else {
    console.log('SMTP connection verified successfully!');
  }
});

// Коректна функція відправки листів
export const sendMail = async (message) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM, // Встановіть відправника
      ...message,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};
