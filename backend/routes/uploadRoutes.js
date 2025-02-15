import express from "express";
import multer from "multer";
import { uploadQuestions } from "../controlllers/uploadController.js";
import userAuth from "../middleware/userAuth.js";

const uploadRoutes = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Excel file
uploadRoutes.post("/", upload.single("file"),userAuth, uploadQuestions);

export default uploadRoutes;