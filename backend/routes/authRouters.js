import express from 'express';
import userAuth, { checkAccountVerification } from '../middleware/userAuth.js';
import { 
    getProfile,
    isAuthenticated, 
    login, 
    logout, 
    register, 
    resetPassword, 
    sendResetOtp, 
    sendVerifyOtp, 
    updatePassword, 
    updateProfileName, 
    verifyEmail 
} from '../controlllers/authController.js';

const authRouters = express.Router();

authRouters.post('/register', register);
authRouters.post('/login', login);
authRouters.post('/logout', logout);

// Routes for sending and verifying OTP
authRouters.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouters.post('/verify-account', userAuth, verifyEmail);
// Routes that require authentication and verified account
authRouters.get('/is-auth', userAuth, checkAccountVerification, isAuthenticated);
authRouters.get('/profile', userAuth, getProfile);
authRouters.put('/update-profile', userAuth,updateProfileName );
authRouters.put('/update-password', userAuth, updatePassword);
// Routes for password reset and OTP
authRouters.post('/send-reset-otp', sendResetOtp);
authRouters.post('/reset-password', resetPassword);

export default authRouters;