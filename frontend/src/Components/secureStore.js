import { create } from "zustand";

const useStore = create((set) => ({
  email: null,
  imageUrl: null,
  googleId: null,
  accountCreated: false,
  setEmail: (email) => set({ email: email }),
  setImageUrl: (imageUrl) => set({ imageUrl: imageUrl }),
  setGoogleId: (googleId) => set({ googleId: googleId }),
  setAccountCreated: (accountCreated) =>
    set({ accountCreated: accountCreated }),
}));

export default useStore;
