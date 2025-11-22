import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    authUser: 'Heyyy From Zustand',
}));
