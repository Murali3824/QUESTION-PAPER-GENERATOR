import jwt from "jsonwebtoken"

const userAuth = async (req,res,next) => {
    
    try {

        const {token}  = req.cookies;
        if(!token){
            return res.json({
                success:false,
                message:'not authorized. login again'
            });
        }

        try {

            const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
            if(tokenDecode){
                req.body.userId = tokenDecode.id
            } else{
                return res.json({
                    success:false,
                    message:"not authorized. login again"
                })
            }
            next();

        } catch (error) {
            res.json({
                success:false,
                message:error.message,
            })
        }
        
    } catch (error) {
        res.json({
            success:false,
            message:error.message,
        })
    }

}

export default userAuth;