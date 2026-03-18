"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, ChevronRight, RefreshCw, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchUsageSummary } from "@/services/api";
import clsx from "clsx";

interface UsageItem {
  group_key: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  request_count: number;
}

interface UsageData {
  items: UsageItem[];
  total_prompt_tokens: number;
  total_completion_tokens: number;
  total_tokens: number;
  total_requests?: number;
}

export function TokenUsageDashboard() {
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadUsage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUsageSummary();
      setData(res);
    } catch (err) {
      console.error("Failed to load usage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (expanded) loadUsage();
  }, [expanded, loadUsage]);

  return (
    <div className="px-3 py-3">
      {/* Toggle header */}
      <motion.button
        whileHover={{ x: 2 }}
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 group"
      >
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-600/10 to-cyan-500/10 border border-violet-500/10 flex items-center justify-center">
          <Zap className="w-3 h-3 text-[var(--accent-light)] group-hover:text-[var(--accent)] transition-colors" />
        </div>
        <span className="text-[12px] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
          Token 消耗
        </span>
        {data && data.total_tokens > 0 && (
          <span className="text-[10px] font-mono text-[var(--accent-light)] ml-auto mr-1 bg-violet-500/10 px-1.5 py-0.5 rounded-md">
            {data.total_tokens.toLocaleString()}
          </span>
        )}
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-3 h-3 text-[var(--text-quaternary)]" />
        </motion.div>
      </motion.button>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] overflow-hidden">
              {/* Stats header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)]">
                <span className="text-label">今日统计</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9, rotate: -90 }}
                  onClick={loadUsage}
                  disabled={loading}
                  className="btn-ghost p-1 rounded-md"
                >
                  <RefreshCw
                    className={clsx("w-3 h-3", loading && "animate-spin")}
                  />
                </motion.button>
              </div>

              {data && data.items.length > 0 ? (
                <div className="divide-y divide-[var(--border-subtle)]">
                  {data.items.map((item, idx) => (
                    <motion.div
                      key={item.group_key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between px-3 py-2 hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shrink-0" />
                        <span className="text-[11px] text-[var(--text-secondary)] truncate">
                          {item.group_key}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-[var(--text-tertiary)] shrink-0 ml-3">
                        {item.total_tokens.toLocaleString()} tok
                      </div>
                    </motion.div>
                  ))}

                  {/* Total bar */}
                  <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-violet-500/5 to-transparent">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-3 h-3 text-[var(--accent-light)]" />
                      <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                        总计
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-tertiary)]">
                      <span>
                        Prompt: {data.total_prompt_tokens.toLocaleString()}
                      </span>
                      <span>
                        Completion: {data.total_completion_tokens.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-5 text-center text-[11px] text-[var(--text-quaternary)]">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-3 h-3 animate-pulse text-[var(--accent)]" />
                      加载中…
                    </div>
                  ) : (
                    "暂无消耗数据"
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
