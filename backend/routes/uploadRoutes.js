import express from "express";
import multer from "multer";
import { deleteFile, deleteSavedPaper, getSavedPapers, getUploadedFiles, savePaper, uploadQuestions } from "../controlllers/uploadController.js";
import userAuth from "../middleware/userAuth.js";

const uploadRoutes = express.Router();

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
uploadRoutes.post("/", userAuth, upload.single("file"), uploadQuestions);
uploadRoutes.post('/paper/save', userAuth, savePaper);
uploadRoutes.get('/papers', userAuth, getSavedPapers);
uploadRoutes.delete('/papers/:paperId', userAuth, deleteSavedPaper);
uploadRoutes.get('/files', userAuth, getUploadedFiles);
uploadRoutes.delete('/deletefiles/:fileId', userAuth, deleteFile);

export default uploadRoutes;