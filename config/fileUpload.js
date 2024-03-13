import cloudinaryPackage from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary
const cloudinary = cloudinaryPackage.v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});

// Create storage engine for Multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "blog-api",
        allowed_formats: ["jpg", "png"] // Note: Use allowed_formats instead of allowedFormats
    }
});

// Initialize Multer with the storage engine
const upload = multer({ storage:storage});

export default upload;
