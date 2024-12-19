import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodeMailer.js';
import {VERIFY_TEMPLATE, EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE, WELCOME_TEMPLATE } from '../config/emailTemplates.js'

import dotenv from 'dotenv';
dotenv.config();


// User registration
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if the user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            // If user exists but email is not verified, update the user with new details
            if (!exists.isAccountVerified) {
                // Update the name and password if they are different
                exists.name = name;
                exists.password = await bcrypt.hash(password, 10); // Hash new password
                await exists.save();

                // Send email verification again (this is optional, based on your implementation)
                const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: email,
                    subject: 'Verify Your Email',
                    // text: `Please verify your email by clicking on the following link: ${process.env.FRONTEND_URL}/email-verify`
                    html: VERIFY_TEMPLATE.replace("{{email}}",exists.email).replace("{{verificationLink}}",`${process.env.FRONTEND_URL}/email-verify`)
                };
                await transporter.sendMail(mailOptions);

                return res.json({
                    success: true,
                    message: "User already exists but email is not verified. Please verify your email."
                });
            } else {
                return res.json({
                    success: false,
                    message: "User already exists. Please log in."
                });
            }
        }

        // Hashing user password for the first time registration
        const hashPassword = await bcrypt.hash(password, 10);

        // Save to DB for the first time registration
        const user = new userModel({
            name,
            email,
            password: hashPassword
        });

        await user.save();
       
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            samesite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Send email verification link
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Verify Your Email',
            // text: `Please verify your email by clicking on the following link: ${process.env.FRONTEND_URL}/email-verify`
            html: VERIFY_TEMPLATE.replace("{{email}}",user.email).replace("{{verificationLink}}",`${process.env.FRONTEND_URL}/email-verify`)
        };
        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: 'Registration successful, please verify your email.'
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// User login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await userModel.findOne({ email });

        // Validate user existence
        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exist",
            });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid password"
            });
        }

        // Check if email is verified
        if (!user.isAccountVerified) {
            // If email is not verified, send verification email again
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'Verify Your Email',
                html: VERIFY_TEMPLATE.replace("{{email}}", user.email)
                    .replace("{{verificationLink}}", `${process.env.FRONTEND_URL}/email-verify`)
            };

            await transporter.sendMail(mailOptions);

            return res.json({
                success: false,
                message: "Email not verified. A verification email has been sent to your email. Please verify your email."
            });
        }

        // Generate JWT token if email is verified
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set token in the cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            samesite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Exclude password from the response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAccountVerified: user.isAccountVerified,
        };

        // Respond with user data and success message
        return res.json({
            success: true,
            message: 'Login successful',
            user: userResponse
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};



// User logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            samesite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });


        return res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};


// Send verification OTP to the user's email
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;


        const user = await userModel.findById(userId);


        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Account already verified"
            });
        }


        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24hrs
        await user.save();


        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            // text: `Your OTP is ${otp}. Verify your account using this OTP`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        };


        await transporter.sendMail(mailOption);


        res.json({
            success: true,
            message: "OTP sent to your email"
        });


    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// Verifying OTP
export const verifyEmail = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await userModel.findById(userId);

        // Validate OTP
        if (user.verifyOtp !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Check if OTP expired
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP expired"
            });
        }

        // Mark account as verified
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Welcome to AUTHFLOW',
            // text: `welcome`,
            html: WELCOME_TEMPLATE.replace("{{email}}",user.email).replace("{{dashboardLink}}",`${process.env.FRONTEND_URL}`)
        };
        await transporter.sendMail(mailOption);

        res.json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// Send password reset OTP
export const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;


        if (!email) {
            return res.json({
                success: false,
                message: 'Email is required'
            });
        }


        const user = await userModel.findOne({ email });


        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }


        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();


        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            // text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        };


        await transporter.sendMail(mailOption);


        res.json({
            success: true,
            message: "OTP sent to your email"
        });


    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// Verifying reset OTP and updating password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;


        if (!email || !otp || !newPassword) {
            return res.json({
                success: false,
                message: 'All fields are required'
            });
        }


        const user = await userModel.findOne({ email });


        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }


        // Check if OTP matches and is valid
        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }


        // Check OTP expiry
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP expired"
            });
        }


        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;


        await user.save();


        res.json({
            success: true,
            message: "Password reset successfully"
        });


    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};






