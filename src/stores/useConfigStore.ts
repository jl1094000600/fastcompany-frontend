import { create } from "zustand";
import type { LLMConfig } from "@/types";

interface ConfigState {
  /** List of available model configurations */
  configs: LLMConfig[];
  /** Currently selected config ID */
  selectedConfigId: string | null;
  /** Loading state */
  loading: boolean;

  // ── Actions ──
  setConfigs: (configs: LLMConfig[]) => void;
  selectConfig: (id: string) => void;
  setLoading: (v: boolean) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  configs: [],
  selectedConfigId: null,
  loading: false,

  setConfigs: (configs) =>
    set((state) => ({
      configs,
      // Auto-select first config if nothing is selected
      selectedConfigId:
        state.selectedConfigId ?? (configs.length > 0 ? configs[0].id : null),
    })),

  selectConfig: (id) => set({ selectedConfigId: id }),

  setLoading: (loading) => set({ loading }),
}));
