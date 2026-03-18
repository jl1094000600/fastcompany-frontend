"use client";

import { useState } from "react";
import { X, Loader2, Sparkles, Key, Globe, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createConfig } from "@/services/api";
import type { LLMConfig } from "@/types";

const PRESETS = [
  { provider: "gemini", model: "gemini-2.5-pro", hint: "AIza..." },
  { provider: "gemini", model: "gemini-2.5-flash", hint: "AIza..." },
  { provider: "openai", model: "gpt-4o", hint: "sk-..." },
  { provider: "openai", model: "gpt-4o-mini", hint: "sk-..." },
  { provider: "anthropic", model: "claude-sonnet-4-20250514", hint: "sk-ant-..." },
  { provider: "deepseek", model: "deepseek-chat", hint: "sk-..." },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (config: LLMConfig) => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2 },
  },
};

export function AddConfigDialog({ open, onClose, onCreated }: Props) {
  const [provider, setProvider] = useState("gemini");
  const [modelName, setModelName] = useState("gemini-2.5-pro");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handlePreset(p: (typeof PRESETS)[number]) {
    setProvider(p.provider);
    setModelName(p.model);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!provider.trim() || !modelName.trim() || !apiKey.trim()) {
      setError("请填写 Provider、模型名称和 API Key");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const config = await createConfig({
        provider: provider.trim(),
        model_name: modelName.trim(),
        api_key: apiKey.trim(),
        base_url: baseUrl.trim() || null,
        is_active: true,
      });
      onCreated(config);
      setApiKey("");
      setBaseUrl("");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "保存失败，请确认后端已启动"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-[460px] max-h-[85vh] overflow-y-auto glass rounded-2xl shadow-2xl shadow-violet-500/5 border-gradient"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-default)]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-[14px] font-bold">添加模型配置</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="btn-ghost p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Presets */}
            <div className="px-5 pt-4">
              <p className="text-label mb-2.5 flex items-center gap-1.5">
                <Bot className="w-3 h-3" />
                快速选择
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => {
                  const active = provider === p.provider && modelName === p.model;
                  return (
                    <motion.button
                      key={`${p.provider}/${p.model}`}
                      type="button"
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handlePreset(p)}
                      className={`px-3 py-[5px] text-[11px] font-medium rounded-lg border transition-all duration-200 ${
                        active
                          ? "border-[var(--accent)] bg-gradient-to-r from-violet-600/10 to-blue-500/10 text-[var(--accent-light)] shadow-sm shadow-violet-500/10"
                          : "border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                      }`}
                    >
                      {p.provider}/{p.model}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5">
              <div>
                <label className="text-label block mb-1.5 flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" />
                  Provider
                </label>
                <input
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="gemini / openai / anthropic"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-label block mb-1.5 flex items-center gap-1">
                  <Bot className="w-2.5 h-2.5" />
                  模型名称
                </label>
                <input
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="gemini-2.5-pro / gpt-4o"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-label block mb-1.5 flex items-center gap-1">
                  <Key className="w-2.5 h-2.5" />
                  API Key <span className="text-[var(--red)]">*</span>
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={
                    PRESETS.find((p) => p.provider === provider)?.hint ??
                    "your-api-key"
                  }
                  className="input-field font-mono"
                />
                <p className="text-[10px] text-[var(--text-quaternary)] mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[var(--green)]" />
                  密钥经 AES 加密后存储
                </p>
              </div>

              <div>
                <label className="text-label block mb-1.5">
                  自定义 Base URL{" "}
                  <span className="text-[var(--text-quaternary)]">(可选)</span>
                </label>
                <input
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="留空使用官方 API"
                  className="input-field"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="text-[12px] text-[var(--red)] bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2.5">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={saving}
                whileHover={saving ? {} : { scale: 1.01 }}
                whileTap={saving ? {} : { scale: 0.98 }}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-[13px] rounded-xl"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {saving ? "保存中…" : "保存配置"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
