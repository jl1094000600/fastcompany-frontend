"use client";

import { useMemo } from "react";
import { File, Folder, FolderOpen, FileCode, FileJson, FileText, FolderTree } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFileStore } from "@/stores/useFileStore";
import clsx from "clsx";

/* ── Tree types ─────────────────── */
interface TreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children: TreeNode[];
}

function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode = { name: "/", path: "/", isDir: true, children: [] };

  for (const filePath of paths) {
    const parts = filePath.replace(/^\//, "").split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const fullPath = "/" + parts.slice(0, i + 1).join("/");

      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = { name: part, path: fullPath, isDir: !isLast, children: [] };
        current.children.push(child);
      }
      current = child;
    }
  }

  function sortTree(nodes: TreeNode[]): TreeNode[] {
    return nodes
      .sort((a, b) => {
        if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map((n) => ({ ...n, children: sortTree(n.children) }));
  }

  return sortTree(root.children);
}

function FileIcon({ name, className }: { name: string; className?: string }) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "json") return <FileJson className={className} />;
  if (["jsx", "tsx", "ts", "js"].includes(ext ?? ""))
    return <FileCode className={className} />;
  if (["css", "html", "md"].includes(ext ?? ""))
    return <FileText className={className} />;
  return <File className={className} />;
}

/* ── Tree item ──────────────────── */
function TreeItem({ node, depth, index }: { node: TreeNode; depth: number; index: number }) {
  const selectedFile = useFileStore((s) => s.selectedFile);
  const selectFile = useFileStore((s) => s.selectFile);
  const readyFiles = useFileStore((s) => s.readyFiles);

  const isSelected = selectedFile === node.path;
  const isReady = readyFiles.has(node.path);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => !node.isDir && selectFile(node.path)}
        className={clsx(
          "w-full flex items-center gap-1.5 py-[4px] text-[12px] transition-all duration-200 rounded-md mx-1",
          isSelected
            ? "bg-gradient-to-r from-violet-600/10 to-transparent text-[var(--accent-light)] border-l-2 border-[var(--accent)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
        )}
        style={{ paddingLeft: `${depth * 14 + 12}px`, paddingRight: 12 }}
      >
        {node.isDir ? (
          node.children.length > 0 ? (
            <FolderOpen className="w-3.5 h-3.5 text-[var(--yellow)] shrink-0 opacity-80" />
          ) : (
            <Folder className="w-3.5 h-3.5 text-[var(--yellow)] shrink-0 opacity-80" />
          )
        ) : (
          <FileIcon
            name={node.name}
            className={clsx(
              "w-3.5 h-3.5 shrink-0 transition-colors",
              isReady ? "text-[var(--green)] opacity-90" : "opacity-40"
            )}
          />
        )}
        <span className="truncate">{node.name}</span>
        {!node.isDir && isReady && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--green)] shrink-0 shadow-sm shadow-emerald-500/30"
          />
        )}
      </motion.button>

      {node.isDir &&
        node.children.map((child, i) => (
          <TreeItem key={child.path} node={child} depth={depth + 1} index={index + i + 1} />
        ))}
    </>
  );
}

/* ── FileExplorer ───────────────── */
export function FileExplorer() {
  const files = useFileStore((s) => s.files);
  const tree = useMemo(() => buildTree(Object.keys(files)), [files]);

  if (tree.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full gap-2 text-[var(--text-quaternary)]"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FolderTree className="w-5 h-5 opacity-30" />
        </motion.div>
        <span className="text-[12px]">等待 AI 生成文件…</span>
      </motion.div>
    );
  }

  return (
    <div className="py-1.5">
      <div className="text-label px-3 py-1.5 flex items-center gap-1.5">
        <div className="w-1 h-3 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
        文件
      </div>
      <AnimatePresence>
        {tree.map((node, i) => (
          <TreeItem key={node.path} node={node} depth={0} index={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}
