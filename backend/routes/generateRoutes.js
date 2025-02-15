import express from "express";
import { generatePaper, getSubjects } from "../controlllers/generateController.js";
import userAuth from '../middleware/userAuth.js';


const generateRoutes = express.Router();

generateRoutes.post("/",userAuth, generatePaper);
generateRoutes.get("/subjects",userAuth, getSubjects);

export default generateRoutes;
