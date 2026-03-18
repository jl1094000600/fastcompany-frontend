"use client";

import { useMemo } from "react";
import {
  SandpackProvider,
  SandpackPreview as SandpackPreviewPane,
} from "@codesandbox/sandpack-react";
import { motion } from "framer-motion";
import { useFileStore } from "@/stores/useFileStore";
import {
  resolveExtraDependencies,
  mergeWithPackageJson,
} from "@/utils/dependencyResolver";
import { Monitor, Eye } from "lucide-react";

export function SandpackPreview() {
  const readyFiles = useFileStore((s) => s.readyFiles);
  const allFiles = useFileStore((s) => s.files);

  const sandpackFiles = useMemo(() => {
    const result: Record<string, string> = {};
    for (const path of Array.from(readyFiles)) {
      if (allFiles[path] !== undefined) {
        const key = path.startsWith("/") ? path : `/${path}`;
        result[key] = allFiles[path];
      }
    }
    return result;
  }, [readyFiles, allFiles]);

  const dependencies = useMemo(() => {
    const extra = resolveExtraDependencies(sandpackFiles);
    return mergeWithPackageJson(sandpackFiles, extra);
  }, [sandpackFiles]);

  const hasFiles = Object.keys(sandpackFiles).length > 0;

  if (!hasFiles) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full gap-4 text-[var(--text-quaternary)]"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/10 to-cyan-500/10 border border-violet-500/10 flex items-center justify-center"
        >
          <Monitor className="w-7 h-7 opacity-30" />
        </motion.div>
        <div className="text-center">
          <p className="text-[14px] font-semibold text-[var(--text-tertiary)]">
            实时预览区
          </p>
          <p className="text-[12px] mt-1 text-[var(--text-quaternary)]">
            代码生成完成后将自动渲染
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2.5 h-10 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/80 backdrop-blur-sm px-3 shrink-0"
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--green)] shadow-sm shadow-emerald-500/30 animate-pulse" />
          <Eye className="w-3 h-3 text-[var(--text-tertiary)]" />
        </div>
        <span className="text-[11px] font-medium text-[var(--text-secondary)]">
          实时预览
        </span>
        <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/10">
          <span className="text-[10px] font-mono text-[var(--green)]">
            LIVE
          </span>
        </div>
      </motion.div>

      {/* Sandpack */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 overflow-hidden"
      >
        <SandpackProvider
          template="react"
          files={sandpackFiles}
          customSetup={{
            dependencies: {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
              ...dependencies,
            },
          }}
          theme="dark"
        >
          <SandpackPreviewPane
            showOpenInCodeSandbox={false}
            showRefreshButton={true}
            style={{ height: "100%" }}
          />
        </SandpackProvider>
      </motion.div>
    </div>
  );
}
