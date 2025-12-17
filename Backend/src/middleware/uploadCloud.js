import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import pkg from 'multer-storage-cloudinary';

// Th? l?y CloudinaryStorage theo c? 2 cách ?? ??m b?o không b? sót
const CloudinaryStorage = pkg.CloudinaryStorage || pkg;

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "hotel_rooms",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

export const uploadCloud = multer({ storage });