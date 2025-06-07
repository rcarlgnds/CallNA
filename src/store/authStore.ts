import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'admin' | 'user' | null;

interface AuthState {
  role: Role;
  username: string | null;
  roomId: string | null;
  setRole: (role: Role) => void;
  setUsername: (username: string | null) => void;
  setRoomId: (roomId: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      username: null,
      roomId: null,
      setRole: (role) => set({ role }),
      setUsername: (username) => set({ username }),
      setRoomId: (roomId) => set({ roomId }),
      logout: () => set({ role: null, username: null, roomId: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);