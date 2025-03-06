import jwt from "jsonwebtoken";
import userModel from '../models/userModel.js';

const userAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies;
        // console.log('Cookies received:', req.cookies); 
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized - No token found'
            });
        }

        try {
            const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
            if (tokenDecode) {
                const user = await userModel.findById(tokenDecode.id);
                
                if (!user) {
                    return res.json({
                        success: false,
                        message: "User not found"
                    });
                }

                req.user = user; // Attach the entire user object
                req.body.userId = tokenDecode.id;
            } else {
                return res.json({
                    success: false,
                    message: "Not authorized. Login again"
                });
            }
            next();
        } catch (error) {
            res.json({
                success: false,
                message: "Invalid token",
            });
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};

export const checkAccountVerification = async (req, res, next) => {
    try {
        if (!req.user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Please verify your email first"
            });
        }
        next();
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

export default userAuth;