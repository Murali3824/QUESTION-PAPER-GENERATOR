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

// Define allowed origins
const allowedOrigins = ['http://localhost:5173'];

// middlewares
app.use(express.json())
app.use(cookieParser())
// Configure CORS middleware
app.use(cors({
    origin: allowedOrigins, // Allow specific origins
    credentials: true, // Allow credentials (cookies)
}));


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