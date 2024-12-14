import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodeMailer.js'; 

// user registration
export const register = async (req,res) => {

    try {

        const {name,email,password} = req.body;

        if( !name || !email || !password ){
            return res.json({
                success:false,
                message:"all fields required"
            })
        }

        // checking if the user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({
                success: false,
                message: "User already exists",
            });
        }

        // Hashing user password
        const hashPassword = await bcrypt.hash(password, 10);

        // save to DB
        const user = new userModel({
            name,
            email,
            password: hashPassword
        });

        await user.save();
        
        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );
        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            samesite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        // sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to:email,
            subject:'welcome to the user authentication.',
            text:`Welcome to website. Your account has been created with email id : ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({
            success:true,
            message:'register successfull'
        })


    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

// user login
export const login = async (req,res) => {
    try {
        
        const { email, password } = req.body;

        // validating email and password
        if(!email || !password ){
            return res.json({
                success:false,
                message:"all fields required"
            })
        }
        
        const user = await userModel.findOne({email})

        // validating user exist or not
        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exists or enter your email correctly",
            });
        }

        // validating password
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.json({
                success:false,
                message:"Invalid password "
            })
        }

        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );
        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            samesite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success:true,
            message: 'login successfull'
        })


    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}


// user logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production
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


// send verification OTP to the user's email
export const sendVerifyOtp = async (req,res) => {
    try {

        const{userId} = req.body;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({
                success:false,
                message:"account already verified"
            })
        }

        const otp = String(Math.floor(100000 + Math.random()*900000))
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24*60*60*1000;  //24hrs
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Account Verification OTP',
            text:`Your OTP is ${otp}. Verify your account using this OTP`
        }
        await transporter.sendMail(mailOption);

        res.json({
            success:true,
            message:"OTP send to your Email"
        })

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

// verifying otp
export const verifyEmail = async (req,res) => {
    try {
        
        const{userId, otp} = req.body;

        if(!userId || !otp){
            return res.json({
                success:false,
                message:'missing details'
            })
        }

        const user = await userModel.findById(userId)

        if(!user){
            return res.json({
                success:false,
                message:"user not found"
            })
        }

        // checking otp send and user entered otp equal or not
        if(user.verifyOtp === '' || user.verifyOtp !== otp){ 
            // equal to empty string or not equal to otp
            return res.json({
                success:false,
                message:"Invalid otp"
            })
        }

        // checking for OTP expire date
        if(user.verifyOtpExpireAt < Date.now()){
            return req.res({
                success:false,
                message:"otp expired"
            })
        }

        // account verifying
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        
        await user.save();
        return res.json({
            success:true,
            message:"Email verified successfully"
        })

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

// check if user is already authenticated or not
export const isAuthenticated = async (req,res) => {
    try {
        
        return res.json({success:true})

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

// send passowrd reset otp
export const sendResetOtp = async (req,res) => {
    try {
        const {email} = req.body;

        if(!email){
            return res.json({
                success:false,
                message:'email is required'
            })
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                success:false,
                message:'user not found'
            })
        }

        const otp = String(Math.floor(100000 + Math.random()*900000))
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15*60*1000;  // 15min
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to:user.email,
            subject:' password reset OTP',
            text:`Your OTP for resetting your password is ${otp}. use this OTP to proceed with resetting your password.`
        }
        await transporter.sendMail(mailOption);

        res.json({
            success:true,
            message:"OTP send to your Email"
        })

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

// verifying reset otp 
export const resetPassword = async (req,res) => {
    try {
        
        const {email,otp,newPassword} = req.body;
        if(!email || !otp || !newPassword){
            return res.json({
                success:false,
                message:'all fields required'
            })
        }

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({
                success:false,
                message:"user not found"
            })
        }

        // checking otp send and user entered otp equal or not
        if(user.resetOtp === '' || user.resetOtp !== otp){ 
            // equal to empty string or not equal to otp
            return res.json({
                success:false,
                message:"Invalid otp"
            })
        }

        // checking for OTP expire date
        if(user.resetOtpExpireAt < Date.now()){
            return req.res({
                success:false,
                message:"otp expired"
            })
        }

        const hashPassword = await bcrypt.hash(newPassword,10);
        user.password = hashPassword;
        user.resetOtp = '',
        user.resetOtpExpireAt = 0;

        await user.save();
        return res.json({
            success:true,
            message:" password reset successfull"
        })

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}



