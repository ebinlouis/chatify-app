import React from 'react';
import { useAuthStore } from '../store/useAuthStore.js';

const Chat = () => {
    const { authUser } = useAuthStore();
    return (
        <div>
            <h1>{authUser.fullName} Welcome to chat web application</h1>
        </div>
    );
};

export default Chat;
