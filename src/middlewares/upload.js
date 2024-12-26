import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'contacts_photos', // Папка для збереження
    allowed_formats: ['jpg', 'png', 'jpeg'], // Дозволені формати
  },
});

const upload = multer({ storage });

export default upload;
