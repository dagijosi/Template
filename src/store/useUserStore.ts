
import { create } from 'zustand';

interface UserState {
  username: string;
  setUsername: (username: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  username: 'Guest',
  setUsername: (username) => set({ username }),
}));
