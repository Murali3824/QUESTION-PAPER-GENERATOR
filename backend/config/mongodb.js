import mongoose from 'mongoose';

const connectDB = async () => {
        // Listen for the connected event
        mongoose.connection.on('connected', () => {
            console.log('MongoDB Connected successfully');
        });

        // Connect to the database using the connection string from environment variables
        await mongoose.connect(`${process.env.MONGODB_URL}/auth_db`)

};

export default connectDB;