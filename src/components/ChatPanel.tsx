"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, RotateCcw, AlertCircle, ArrowUp, MessageSquare, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/stores/useChatStore";
import { useConfigStore } from "@/stores/useConfigStore";
import { useFileStore } from "@/stores/useFileStore";
import { startGeneration } from "@/services/streamParser";

const messageVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export function ChatPanel() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messages = useChatStore((s) => s.messages);
  const status = useChatStore((s) => s.status);
  const sessionId = useChatStore((s) => s.sessionId);
  const addMessage = useChatStore((s) => s.addMessage);
  const resetChat = useChatStore((s) => s.resetChat);

  const selectedConfigId = useConfigStore((s) => s.selectedConfigId);
  const configs = useConfigStore((s) => s.configs);
  const resetFiles = useFileStore((s) => s.resetFiles);

  const isStreaming = status === "streaming";
  const hasModels = configs.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || isStreaming || !selectedConfigId) return;

    setInput("");
    addMessage({ role: "user", content: prompt });

    await startGeneration({
      session_id: sessionId,
      config_id: selectedConfigId,
      prompt,
    });
  }

  function handleReset() {
    resetChat();
    resetFiles();
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Empty state: no model */}
        {!hasModels && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center h-full text-center gap-4 py-12"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center glow-accent">
              <AlertCircle className="w-6 h-6 text-[var(--accent-light)]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                尚未配置模型
              </p>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-1.5 leading-relaxed max-w-[260px]">
                点击上方{" "}
                <span className="inline-flex items-center justify-center w-[20px] h-[20px] rounded-md bg-gradient-to-br from-violet-600 to-blue-500 text-white text-[10px] font-bold align-middle mx-0.5 shadow-lg shadow-violet-500/20">
                  +
                </span>{" "}
                按钮添加一个 LLM 模型配置
              </p>
            </div>
          </motion.div>
        )}

        {/* Empty state: has model */}
        {hasModels && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center h-full text-center gap-5 py-12"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-violet-500/10 flex items-center justify-center"
            >
              <Wand2 className="w-7 h-7 text-[var(--accent-light)]" />
            </motion.div>
            <div>
              <p className="text-[16px] font-bold text-gradient">
                描述你想要的应用
              </p>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-1.5">
                AI 将生成可运行的代码并实时预览
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 max-w-[280px] justify-center">
              {["Todo 应用", "计算器", "天气卡片"].map((hint) => (
                <motion.button
                  key={hint}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInput(hint)}
                  className="px-3 py-1.5 text-[11px] rounded-full border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--accent-light)] hover:border-[var(--border-hover)] transition-colors glass-light"
                >
                  {hint}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message list */}
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="flex flex-col gap-1"
            >
              <span className="text-label flex items-center gap-1.5">
                {msg.role === "user" ? (
                  <MessageSquare className="w-2.5 h-2.5" />
                ) : (
                  <Sparkle />
                )}
                {msg.role === "user" ? "You" : "AI"}
              </span>
              <div
                className={`rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap transition-all ${
                  msg.role === "user"
                    ? "bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-default)]"
                    : "bg-gradient-to-br from-violet-600/5 to-blue-500/5 text-[var(--text-primary)] border border-violet-500/10 glow-accent"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming indicator */}
        <AnimatePresence>
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 text-[12px] text-[var(--text-tertiary)] py-2"
            >
              <div className="relative">
                <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-violet-500/20 animate-ping" />
              </div>
              <span>正在生成代码</span>
              <span className="dot-pulse flex gap-0.5">
                <span />
                <span />
                <span />
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error indicator */}
        <AnimatePresence>
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[12px] text-[var(--red)] bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              生成出错，请检查模型配置后重试
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="px-3 pb-3 pt-1 shrink-0"
      >
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl px-3 py-1.5 focus-within:border-[var(--accent)] focus-within:glow-accent transition-all duration-300"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              hasModels ? "描述你想要的应用…" : "请先添加模型配置"
            }
            disabled={isStreaming || !hasModels}
            className="flex-1 bg-transparent text-[13px] py-1.5 px-1 outline-none text-[var(--text-primary)] placeholder:text-[var(--text-quaternary)] disabled:opacity-40"
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleReset}
            className="btn-ghost p-1.5 rounded-lg"
            title="重置对话"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            type="submit"
            disabled={isStreaming || !input.trim() || !selectedConfigId}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 disabled:opacity-30 disabled:from-violet-600 disabled:to-blue-500 flex items-center justify-center transition-all duration-200 shrink-0 shadow-lg shadow-violet-500/20"
          >
            <ArrowUp className="w-4 h-4 text-white" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

function Sparkle() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-[var(--accent-light)]">
      <path
        d="M8 0L9.79 6.21L16 8L9.79 9.79L8 16L6.21 9.79L0 8L6.21 6.21L8 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
