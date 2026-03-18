/**
 * Backend API client – thin wrappers around fetch().
 */

import type { LLMConfig, LLMConfigCreate, UsageSummaryItem } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

/* ─── Config endpoints ──────────────────────── */

export async function fetchConfigs(): Promise<LLMConfig[]> {
  const res = await fetch(`${BASE}/api/v1/configs`);
  if (!res.ok) throw new Error("Failed to fetch configs");
  const data = await res.json();
  return data.items as LLMConfig[];
}

export async function createConfig(body: LLMConfigCreate): Promise<LLMConfig> {
  const res = await fetch(`${BASE}/api/v1/configs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create config");
  return res.json();
}

/* ─── Usage endpoints ───────────────────────── */

export interface UsageSummaryResponse {
  items: UsageSummaryItem[];
  total_prompt_tokens: number;
  total_completion_tokens: number;
  total_tokens: number;
}

export async function fetchUsageSummary(
  startDate?: string,
  endDate?: string,
  groupBy: "model" | "user" | "date" = "date"
): Promise<UsageSummaryResponse> {
  if (!startDate || !endDate) {
    const today = new Date().toISOString().split("T")[0];
    startDate = startDate ?? today;
    endDate = endDate ?? today;
  }
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    group_by: groupBy,
  });
  const res = await fetch(`${BASE}/api/v1/usage/summary?${params}`);
  if (!res.ok) throw new Error("Failed to fetch usage summary");
  return res.json();
}

/* ─── Generate endpoint (returns ReadableStream) ─── */

export function getGenerateStreamUrl(): string {
  return `${BASE}/api/v1/generate/stream`;
}
