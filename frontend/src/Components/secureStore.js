import { create } from 'zustand'

const useStore = create((set) => ({
  email: null,
  imageUrl: null,
  setEmail: (email) => set({ email: email }),
  setImageUrl: (imageUrl) => set({ imageUrl: imageUrl }),
}))

export default useStore;