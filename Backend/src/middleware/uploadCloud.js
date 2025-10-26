import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from '../config/cloudinary.js'

const storage = new CloudinaryStorage ({
    cloudinary,
    params: {
        folder: "hotel_rooms", // folder name in cloudinary
        allowed_format: ["jpg", "jpeg", "png", "webp"],
    },
});

export const uploadCloud = multer({storage});