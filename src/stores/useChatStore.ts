import { create } from "zustand";
import type { ChatMessage, GenerationStatus } from "@/types";

interface ChatState {
  /** All messages in the current session */
  messages: ChatMessage[];
  /** Current generation status */
  status: GenerationStatus;
  /** Session ID for multi-turn context */
  sessionId: string;

  // ── Actions ──
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setStatus: (status: GenerationStatus) => void;
  resetChat: () => void;
}

let _msgCounter = 0;

function generateId(): string {
  return `msg_${Date.now()}_${++_msgCounter}`;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  status: "idle",
  sessionId: `session_${Date.now()}`,

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: generateId(), timestamp: Date.now() },
      ],
    })),

  setStatus: (status) => set({ status }),

  resetChat: () =>
    set({
      messages: [],
      status: "idle",
      sessionId: `session_${Date.now()}`,
    }),
}));
