import express from "express";
import multer from "multer";
import { getSavedPapers, getUploadedFiles, savePaper, uploadQuestions } from "../controlllers/uploadController.js";
import userAuth from "../middleware/userAuth.js";

const uploadRoutes = express.Router();

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
uploadRoutes.post("/", userAuth, upload.single("file"), uploadQuestions);
uploadRoutes.post('/paper/save', userAuth, savePaper);
uploadRoutes.get('/papers', userAuth, getSavedPapers);
uploadRoutes.get('/files', userAuth, getUploadedFiles);

export default uploadRoutes;