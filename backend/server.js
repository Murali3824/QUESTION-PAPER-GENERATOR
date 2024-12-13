import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import authRouters from './routes/authRouters.js'
import userRouters from './routes/userRouters.js'

// app config
const app = express()
dotenv.config()
const port = process.env.PORT || 4000
connectDB()

// middlewares
app.use(express.json())
app.use(cors({credentials:true}))
app.use(cookieParser())

// api routes
app.use('/api/auth',authRouters)
app.use('/api/user',userRouters)

// api endpoints
app.get('/',(req,res) => {
    res.send("server is running")
})

app.listen(port,() => {
    console.log("Server is running on port: ",port);
    
})