"use client";

import { useFileStore } from "@/stores/useFileStore";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, FileCode } from "lucide-react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full gap-2 text-[12px] text-[var(--text-quaternary)]">
      <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      编辑器加载中…
    </div>
  ),
});

function getLanguage(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "tsx":
    case "ts":
      return "typescript";
    case "jsx":
    case "js":
      return "javascript";
    case "json":
      return "json";
    case "css":
      return "css";
    case "html":
      return "html";
    case "md":
      return "markdown";
    default:
      return "plaintext";
  }
}

export function CodeEditor() {
  const files = useFileStore((s) => s.files);
  const selectedFile = useFileStore((s) => s.selectedFile);
  const setFile = useFileStore((s) => s.setFile);

  const content = selectedFile ? files[selectedFile] ?? "" : "";
  const language = selectedFile ? getLanguage(selectedFile) : "plaintext";
  const fileName = selectedFile?.split("/").pop() ?? "";

  if (!selectedFile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full gap-3 text-[var(--text-quaternary)]"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/10 to-blue-500/10 border border-violet-500/10 flex items-center justify-center"
        >
          <Code2 className="w-6 h-6 opacity-30" />
        </motion.div>
        <span className="text-[12px]">选择文件以查看代码</span>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center h-10 px-3 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/80 backdrop-blur-sm shrink-0"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFile}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600/10 to-transparent border border-violet-500/10 rounded-lg px-2.5 py-[3px]">
              <FileCode className="w-3 h-3 text-[var(--accent-light)]" />
              <span className="text-[11px] font-medium text-[var(--text-primary)]">
                {fileName}
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-quaternary)] font-mono truncate">
              {selectedFile}
            </span>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Monaco */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          path={selectedFile}
          value={content}
          onChange={(v) => v !== undefined && setFile(selectedFile, v)}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
            fontLigatures: true,
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderLineHighlight: "none",
            lineNumbers: "on",
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: true,
            wordWrap: "on",
            automaticLayout: true,
            padding: { top: 8, bottom: 8 },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            scrollbar: {
              verticalScrollbarSize: 5,
              horizontalScrollbarSize: 5,
            },
            contextmenu: false,
          }}
        />
      </div>
    </div>
  );
}
