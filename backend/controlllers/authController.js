import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodeMailer.js";
import {
    EMAIL_VERIFY_TEMPLATE,
    LOGIN_SUCCESS_TEMPLATE,
    PASSWORD_RESET_TEMPLATE,
    WELCOME_TEMPLATE,
} from "../config/emailTemplates.js";
import dotenv from "dotenv";
dotenv.config();

// Create a function to get cookie options based on environment
const getCookieConfig = () => {
    return {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
};

// User registration
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if the user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            // If user exists but email is not verified
            if (!exists.isAccountVerified) {
                // Generate token for the existing unverified user
                const token = jwt.sign({ id: exists._id }, process.env.JWT_SECRET, {
                    expiresIn: "7d",
                });

                // Use the new cookie options
                res.cookie("token", token, getCookieConfig());

                return res.json({
                    success: true,
                    message: "User exists but not verified",
                    requiresVerification: true,
                    user: {
                        _id: exists._id,
                        email: exists.email,
                        name: exists.name,
                        isAccountVerified: exists.isAccountVerified,
                    },
                });
            } else {
                return res.json({
                    success: false,
                    message: "User already exists. Please log in.",
                });
            }
        }

        // Create new user
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name,
            email,
            password: hashPassword,
        });
        await user.save();

        // Generate token for the new user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Use the new cookie options
        res.cookie("token", token, getCookieConfig());

        return res.json({
            success: true,
            message: "Registration successful, please verify your email.",
            requiresVerification: true,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                isAccountVerified: user.isAccountVerified,
            },
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// User login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exist",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid password",
            });
        }

        // Check if email is verified
        if (!user.isAccountVerified) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            // Use the new cookie options
            res.cookie("token", token, getCookieConfig());

            return res.json({
                success: true,
                message: "Email verification required",
                requiresVerification: true,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    isAccountVerified: user.isAccountVerified,
                },
            });
        }

        // Generate JWT token if email is verified
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Use the new cookie options
        res.cookie("token", token, getCookieConfig());

        const mailOption = {
            from: `"AuthFlow" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Your Account Login Was Successful",
            html: LOGIN_SUCCESS_TEMPLATE.replace(
                "{{dashboardLink}}",
                `${process.env.FRONTEND_URL}`
            ),
        };

        await transporter.sendMail(mailOption);

        return res.json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            },
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// User logout
export const logout = async (req, res) => {
    try {
        // Clear the cookie with proper options for production
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.json({
            success: true,
            message: "Logged out successfully",
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
                message: "Account already verified",
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24hrs
        await user.save();

        const mailOption = {
            from: `"AuthFlow" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Verify Your Account with the OTP Code",
            // text: `Your OTP is ${otp}. Verify your account using this OTP`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
                "{{email}}",
                user.email
            ),
        };

        await transporter.sendMail(mailOption);

        res.json({
            success: true,
            message: "OTP sent to your email",
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
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
                message: "Invalid OTP",
            });
        }

        // Check if OTP expired
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP expired",
            });
        }

        // Mark account as verified
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;

        await user.save();

        const mailOption = {
            from: `"AuthFlow" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Welcome to AuthFlow",
            // text: `welcome`,
            html: WELCOME_TEMPLATE.replace("{{email}}", user.email).replace(
                "{{dashboardLink}}",
                `${process.env.FRONTEND_URL}`
            ),
        };
        await transporter.sendMail(mailOption);

        res.json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
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
            message: error.message,
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
                message: "Email is required",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const mailOption = {
            from: `"AuthFlow" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Reset Your Password Using This OTP",
            // text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
                "{{email}}",
                user.email
            ),
        };

        await transporter.sendMail(mailOption);

        res.json({
            success: true,
            message: "OTP sent to your email",
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
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
                message: "All fields are required",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        // Check if OTP matches and is valid
        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Check OTP expiry
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP expired",
            });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        res.json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// Get user profile details
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            user,
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// Update user profile name
export const updateProfileName = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        if (!name) {
            return res.json({
                success: false,
                message: "Name is required",
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        user.name = name;
        await user.save();

        return res.json({
            success: true,
            message: "Profile name updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            },
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// Update password
export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Hash and update new password
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();

        return res.json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};
