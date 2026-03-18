import { create } from "zustand";
import type { FileMap } from "@/types";

interface FileState {
  /** Virtual file system: { "/src/App.jsx": "code..." } */
  files: FileMap;
  /** Set of file paths whose </file> tag has been received (ready for Sandpack) */
  readyFiles: Set<string>;
  /** Currently selected file path in the editor */
  selectedFile: string | null;

  // ── Actions ──
  /** Initialise or overwrite a file entry */
  setFile: (path: string, content: string) => void;
  /** Append content to an existing file */
  appendToFile: (path: string, chunk: string) => void;
  /** Mark a file as fully received */
  markReady: (path: string) => void;
  /** Select a file for viewing in the editor */
  selectFile: (path: string) => void;
  /** Clear the entire virtual file system */
  resetFiles: () => void;
  /** Get only files that are ready for Sandpack rendering */
  getReadyFiles: () => FileMap;
}

export const useFileStore = create<FileState>((set, get) => ({
  files: {},
  readyFiles: new Set(),
  selectedFile: null,

  setFile: (path, content) =>
    set((state) => ({
      files: { ...state.files, [path]: content },
    })),

  appendToFile: (path, chunk) =>
    set((state) => ({
      files: {
        ...state.files,
        [path]: (state.files[path] ?? "") + chunk,
      },
    })),

  markReady: (path) =>
    set((state) => {
      const next = new Set(state.readyFiles);
      next.add(path);
      return { readyFiles: next };
    }),

  selectFile: (path) => set({ selectedFile: path }),

  resetFiles: () =>
    set({ files: {}, readyFiles: new Set(), selectedFile: null }),

  getReadyFiles: () => {
    const { files, readyFiles } = get();
    const result: FileMap = {};
    for (const path of readyFiles) {
      if (files[path] !== undefined) {
        result[path] = files[path];
      }
    }
    return result;
  },
}));
