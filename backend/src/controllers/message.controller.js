import cloudinary from '../lib/cloudinary.js';
import { getRecieverSocketId, io } from '../lib/socket.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

export const getAllContacts = async (req, res) => {
    try {
        const loggedUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select('-password');

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(`Error on GetAllContacts`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAllChats = async (req, res) => {
    try {
        const loggedUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                {
                    senderId: loggedUserId,
                },
                {
                    receiverId: loggedUserId,
                },
            ],
        });

        const chatPartnersIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId === loggedUserId ? msg.receiverId : msg.senderId,
                ),
            ),
        ];

        const chatPaterns = await User.find({ _id: { $in: chatPartnersIds } }).select('-password');

        res.status(200).json(chatPaterns);
    } catch (error) {
        console.log(`Error Found on GetAllChats`, error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id } = req.params;

        const messages = await Message.find({
            $or: [
                {
                    senderId: myId,
                    receiverId: id,
                },
                {
                    senderId: id,
                    receiverId: myId,
                },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log(`Error on getMessagesByUserId`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: req.user._id,
            receiverId: receiverId,
            text: text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getRecieverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        res.status(200).json(newMessage);
    } catch (error) {
        console.log(`Error found on sendMessageController`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
