import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSignUp: false,
    isLoginIn: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log(`Error on checkAuth`, error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSignUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data });
            toast.success('Account created successfully');
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
        } finally {
            set({ isSignUp: false });
        }
    },

    login: async (data) => {
        set({ isLoginIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ authUser: res.data });
            toast.success('Login In successfully');
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            set({ isLoginIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success('Logout successfully');
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await axiosInstance.put('/auth/update-profile', data);
            set({ authUser: res.data });
            toast.success('Profile updated successfully');
        } catch (error) {
            console.log('Error in update profile:', error);
            toast.error(error.response?.data?.message || 'Error on Updating Profile');
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, { withCredentials: true });

        socket.connect();
        set({ socket });

        socket.on('getOnlineUsers', (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
