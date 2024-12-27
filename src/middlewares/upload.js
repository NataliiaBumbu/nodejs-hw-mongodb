// middlewares/upload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Завантажуємо змінні середовища
dotenv.config();

// Налаштування Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Налаштування CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'contacts_photos',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

// Ініціалізація multer із CloudinaryStorage
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Обмеження розміру файлу - 5MB
});

export default upload;
