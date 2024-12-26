import nodemailer from 'nodemailer';

// Створюємо Nodemailer транспортер
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Використовуємо secure лише для порту 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Експортуємо функцію відправки листів
export function sendMail(message) {
  return transporter.sendMail(message);
}
