import userModel from "../models/userModel.js";


export const getUserData = async (req,res) => {
    try {
        const { token } = req.cookies;
        // const token  = req.cookies.token;
                
        const {userId} = req.body;

        const user = await userModel.findById(userId);
        if(!user){
            return res.json({
                success:true,
                message:"user not found"
            })
        }

        res.json({
            success:true,
            userData:{
                token:token,
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        })

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}