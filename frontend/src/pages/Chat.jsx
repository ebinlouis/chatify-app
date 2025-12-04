import React from 'react';
import { useAuthStore } from '../store/useAuthStore.js';

const Chat = () => {
    const { authUser, logout } = useAuthStore();

    const handleLogOut = async () => {
        logout();
    };
    return (
        <div className="z-10">
            <h1>{authUser.fullName} Welcome to chat web application</h1>
            <button className="auth-btn mt-[20px]" onClick={handleLogOut}>
                Log out
            </button>
        </div>
    );
};

export default Chat;
