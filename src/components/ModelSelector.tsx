"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown, Plus, RefreshCw, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfigStore } from "@/stores/useConfigStore";
import { fetchConfigs } from "@/services/api";
import { AddConfigDialog } from "@/components/AddConfigDialog";
import type { LLMConfig } from "@/types";

export function ModelSelector() {
  const configs = useConfigStore((s) => s.configs);
  const selectedConfigId = useConfigStore((s) => s.selectedConfigId);
  const setConfigs = useConfigStore((s) => s.setConfigs);
  const selectConfig = useConfigStore((s) => s.selectConfig);
  const loading = useConfigStore((s) => s.loading);
  const setLoading = useConfigStore((s) => s.setLoading);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const loadConfigs = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const data = await fetchConfigs();
      setConfigs(data);
    } catch (err) {
      console.error("Failed to load configs:", err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [setConfigs, setLoading]);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  function handleConfigCreated(config: LLMConfig) {
    setConfigs([...configs, config]);
    selectConfig(config.id);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Selector */}
        <div className="relative flex-1 min-w-0 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
          <select
            value={selectedConfigId ?? ""}
            onChange={(e) => selectConfig(e.target.value)}
            disabled={loading || configs.length === 0}
            className="relative w-full appearance-none bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-lg pl-3 pr-8 py-[7px] text-[12px] font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-subtle)] disabled:opacity-40 transition-all duration-200 cursor-pointer truncate"
          >
            {configs.length === 0 && (
              <option value="">
                {loading ? "加载中…" : fetchError ? "后端未连接" : "添加模型 →"}
              </option>
            )}
            {configs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.provider} / {c.model_name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] pointer-events-none" />
        </div>

        {/* Refresh */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: -90 }}
          onClick={loadConfigs}
          disabled={loading}
          className="btn-ghost p-[6px] rounded-lg shrink-0"
          title="刷新"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
        </motion.button>

        {/* Add */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setDialogOpen(true)}
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 flex items-center justify-center transition-all duration-200 shrink-0 shadow-lg shadow-violet-500/20"
          title="添加模型"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
        </motion.button>
      </div>

      <AnimatePresence>
        {fetchError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 rounded-lg bg-red-500/5 border border-red-500/10">
              <Zap className="w-3 h-3 text-[var(--red)]" />
              <p className="text-[10px] text-[var(--red)] leading-tight">
                无法连接后端 — 请确认 localhost:8000 已启动
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddConfigDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleConfigCreated}
      />
    </>
  );
}
