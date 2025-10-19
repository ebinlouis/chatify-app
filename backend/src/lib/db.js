import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URL);
        console.log(`MongoDB Connected successfully`);
    } catch (error) {
        console.log(`Error connection to MongoDB`);
        process.exit(1);
    }
};
