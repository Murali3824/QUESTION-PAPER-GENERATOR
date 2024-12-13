import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controlllers/authController.js';
import userAuth from '../middleware/userAuth.js';


const authRouters = express.Router();

authRouters.post('/register',register)
authRouters.post('/login',login)
authRouters.post('/logout',logout)
authRouters.post('/send-verify-otp',userAuth, sendVerifyOtp)
authRouters.post('/verify-account',userAuth, verifyEmail)
authRouters.post('/is-auth',userAuth, isAuthenticated)
authRouters.post('/send-reset-otp', sendResetOtp)
authRouters.post('/reset-password',resetPassword)


export default authRouters;