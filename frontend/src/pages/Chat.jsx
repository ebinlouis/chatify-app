import React from 'react';
import { useAuthStore } from '../store/useAuthStore.js';

const Chat = () => {
    const { authUser } = useAuthStore();
    return (
        <div>
            Chat Page <h1>{authUser}</h1>
        </div>
    );
};

export default Chat;
