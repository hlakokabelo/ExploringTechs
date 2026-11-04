import { create } from "zustand";

type ScribeState = {
  imageFile: File | null;
  imageUrl: string | null; // object URL, only set for image/* files
  fileType: string;
  fileName: string;
  text: string;
  isLoading: boolean;
  duration: number | null; // milliseconds
  error: string | null;

  setFile: (file: File) => void;
  clearFile: () => void;
  setText: (text: string) => void;
  setLoading: (isLoading: boolean) => void;
  setDuration: (duration: number | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export const useScribeStore = create<ScribeState>()((set, get) => ({
  imageFile: null,
  imageUrl: null,
  fileType: "",
  fileName: "",
  text: "",
  isLoading: false,
  duration: null,
  error: null,

  setFile: (file) => {
    const prev = get().imageUrl;
    if (prev) URL.revokeObjectURL(prev);

    set({
      imageFile: file,
      imageUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      fileType: file.type,
      fileName: file.name,
      text: "",
      error: null,
      duration: null,
    });
  },

  clearFile: () => {
    const prev = get().imageUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      imageFile: null,
      imageUrl: null,
      fileType: "",
      fileName: "",
      text: "",
      duration: null,
      error: null,
    });
  },

  setText: (text) => set({ text }),
  setLoading: (isLoading) => set({ isLoading }),
  setDuration: (duration) => set({ duration }),
  setError: (error) => set({ error }),

  reset: () => {
    const prev = get().imageUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      imageFile: null,
      imageUrl: null,
      fileType: "",
      fileName: "",
      text: "",
      isLoading: false,
      duration: null,
      error: null,
    });
  },
}));
