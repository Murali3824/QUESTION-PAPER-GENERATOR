import express from "express";
import { generatePaper, getSubjectsByFile } from "../controlllers/generateController.js";
import userAuth from '../middleware/userAuth.js';

const generateRoutes = express.Router();

generateRoutes.get("/subjects/:fileId", userAuth, getSubjectsByFile);
generateRoutes.post("/generate-paper", userAuth, generatePaper);

export default generateRoutes;