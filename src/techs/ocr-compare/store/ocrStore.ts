import { create } from "zustand";

type OCRState = {
  imageFile: File | null;
  imageUrl: string | null; // object URL for preview
  text: string;
  isLoading: boolean;
  progress: number;
  error: string | null;
  duration: number | null; // milliseconds

  setImage: (file: File) => void;
  clearImage: () => void;
  setText: (text: string) => void;
  setLoading: (isLoading: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setDuration: (duration: number | null) => void;
  reset: () => void;
};

export const useOCRStore = create<OCRState>()((set, get) => ({
  imageFile: null,
  imageUrl: null,
  text: "",
  isLoading: false,
  progress: 0,
  error: null,
  duration: null,
  setImage: (file) => {
    const prev = get().imageUrl;
    if (prev) URL.revokeObjectURL(prev); // avoid leaking object URLs
    set({
      imageFile: file,
      imageUrl: URL.createObjectURL(file),
      text: "",
      error: null,
    });
  },

  clearImage: () => {
    const prev = get().imageUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      imageFile: null,
      imageUrl: null,
      text: "",
      progress: 0,
      error: null,
    });
  },

  setText: (text) => set({ text }),
  setLoading: (isLoading) => set({ isLoading }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
  setDuration: (duration) => set({ duration }),

  reset: () => {
    const prev = get().imageUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      imageFile: null,
      imageUrl: null,
      text: "",
      isLoading: false,
      progress: 0,
      error: null,
    });
  },
}));
