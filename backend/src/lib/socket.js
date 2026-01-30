import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { ENV } from './../lib/env.js';
import { socketAuthMiddleware } from '../middleware/socket.middleware.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ENV.CLIENT_URL,
        credentials: true,
    },
});

io.use(socketAuthMiddleware);

export const getRecieverSocketId = (userId) => {
    return userSocketMap[userId];
};

const userSocketMap = {};

io.on('connection', (socket) => {
    console.log(`A User Connected : ${socket.user.fullName}`);

    userSocketMap[socket.userId] = socket.id;
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('A User disconnected', socket.user.fullName);
        delete userSocketMap[socket.userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { io, app, server };
