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
    } catch (error) {
        console.log(`Error in signUp controller : `, error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const login = (req, res) => {
    res.send('Login Route');
};

export const logout = (req, res) => {
    res.send('Logout Route');
};
