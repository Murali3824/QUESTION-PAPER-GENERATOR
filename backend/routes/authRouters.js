import express from 'express';
import userAuth, { checkAccountVerification } from '../middleware/userAuth.js';
import { 
    isAuthenticated, 
    login, 
    logout, 
    register, 
    resetPassword, 
    sendResetOtp, 
    sendVerifyOtp, 
    verifyEmail 
} from '../controlllers/authController.js';

const authRouters = express.Router();

authRouters.post('/register', register);
authRouters.post('/login', login);
authRouters.post('/logout', logout);

// Routes that require authentication and verified account
authRouters.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouters.post('/verify-account', userAuth, verifyEmail);
authRouters.get('/is-auth', userAuth, checkAccountVerification, isAuthenticated);

// Routes for password reset and OTP
authRouters.post('/send-reset-otp', sendResetOtp);
authRouters.post('/reset-password', resetPassword);

export default authRouters;