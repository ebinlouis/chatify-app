import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected successfully`);
    } catch (error) {
        console.log(`Error connection to MongoDB`);
        process.exit(1);
    }
};
