import { create } from "zustand";

const useStore = create((set) => ({
  email: null,
  imageUrl: null,
  googleId: null,
  setEmail: (email) => set({ email: email }),
  setImageUrl: (imageUrl) => set({ imageUrl: imageUrl }),
  setGoogleId: (googleId) => set({ googleId: googleId }),
}));

export default useStore;
