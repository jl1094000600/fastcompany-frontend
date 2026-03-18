"use client";

import { ChatPanel } from "@/components/ChatPanel";
import { FileExplorer } from "@/components/FileExplorer";
import { CodeEditor } from "@/components/CodeEditor";
import { SandpackPreview } from "@/components/SandpackPreview";
import { ModelSelector } from "@/components/ModelSelector";
import { TokenUsageDashboard } from "@/components/TokenUsageDashboard";
import { Sparkles, Cpu, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function WorkspacePage() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ overflow: "hidden" }}>
      {/* ─── Sidebar: Chat & Controls ─── */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-[380px] min-w-[340px] flex flex-col glass border-r border-[var(--border-default)]"
      >
        {/* Brand header */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--border-default)] shrink-0">
          <Link
            href="/"
            className="btn-ghost p-1.5 rounded-lg mr-0.5"
            title="返回首页"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20"
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
          <div className="flex flex-col">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-[14px] font-bold tracking-tight text-gradient"
            >
              FastCompanyAI
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1"
            >
              <Cpu className="w-2.5 h-2.5" />
              AI Code Generator
            </motion.span>
          </div>
        </div>

        {/* Model selector */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="px-3 py-3 border-b border-[var(--border-subtle)] shrink-0"
        >
          <ModelSelector />
        </motion.div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <ChatPanel />
        </div>

        {/* Token usage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="border-t border-[var(--border-subtle)] shrink-0"
        >
          <TokenUsageDashboard />
        </motion.div>
      </motion.aside>

      {/* ─── Main content ─── */}
      <div className="flex flex-1 min-w-0">
        {/* Center: File tree + Code editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col flex-1 min-w-0 border-r border-[var(--border-default)]"
        >
          {/* File tree */}
          <div className="h-[180px] min-h-[120px] border-b border-[var(--border-default)] overflow-auto glass-light">
            <FileExplorer />
          </div>
          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor />
          </div>
        </motion.div>

        {/* Right: Preview */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 min-w-[380px] glass-light"
        >
          <SandpackPreview />
        </motion.div>
      </div>
    </div>
  );
}
