import { sendWelcomeEmail } from '../emails/emailHandler.js';
import cloudinary from '../lib/cloudinary.js';
import { ENV } from '../lib/env.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signUp = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All Fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid Email Format' });
        }

        const user = await User.findOne({ email: email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email: email,
            fullName: fullName,
            password: hashedPassword,
        });

        await newUser.save();
        generateToken(newUser._id, res);

        res.status(200).json({
            _id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
            profilePic: newUser.profilePic,
        });

        try {
            sendWelcomeEmail(newUser.email, newUser.fullName, ENV.CLIENT_URL);
        } catch (error) {
            console.log(`Error found on sending Welcome Email`);
        }
    } catch (error) {
        console.log(`Error in signUp controller : `, error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentails' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid Credentails' });

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log(`Error on Login Controller`, error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: 'Logout successfully' });
    } catch (error) {
        console.log(`Error found in logout controller`, error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body || {};
        if (!profilePic) return res.status(400).json({ message: 'Profile pic is required' });

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log(`Error found on updateProfile`, error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
