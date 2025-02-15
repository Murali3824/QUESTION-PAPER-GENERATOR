import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouters from './routes/authRouters.js';
import userRouters from './routes/userRouters.js';
import uploadRoutes from './routes/uploadRoutes.js';
import generateRoutes from './routes/generateRoutes.js';


// App config
const app = express();
dotenv.config();
const port = process.env.PORT || 4000;
connectDB();

// Define allowed origins
const allowedOrigins = process.env.FRONTEND_URL;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Configure CORS middleware
app.use(cors({
    origin: allowedOrigins, // Allow specific origins
    credentials: true, // Allow credentials (cookies)
}));

// API routes
app.use('/api/auth', authRouters);
app.use('/api/user', userRouters);
app.use("/api/upload", uploadRoutes);
app.use("/api/generate", generateRoutes);

// API endpoints
app.get('/', (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log("Server is running on port: ", port);
});
