import { create } from "zustand";

const useStore = create((set) => ({
  email: null,
  imageUrl: null,
  googleId: null,
  role: null,
  setEmail: (email) => set({ email: email }),
  setImageUrl: (imageUrl) => set({ imageUrl: imageUrl }),
  setGoogleId: (googleId) => set({ googleId: googleId }),
  setRole: (role) => set({ role: role }),
  resetStore: () => set({ email: null, imageUrl: null, googleId: null, role: null }),
}));

export default useStore;
