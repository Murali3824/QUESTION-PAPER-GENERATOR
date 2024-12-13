import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controlllers/userController.js';


const userRouters = express.Router();

userRouters.get('/data',userAuth,getUserData)

export default userRouters