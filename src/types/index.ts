/* ──────────────────────────────────────────────
 * Shared TypeScript type definitions
 * ────────────────────────────────────────────── */

/** Map of file paths to their code content */
export type FileMap = Record<string, string>;

/** LLM configuration returned by the backend */
export interface LLMConfig {
  id: string;
  provider: string;
  model_name: string;
  base_url: string | null;
  is_active: boolean;
  created_at: string;
}

/** Payload sent to POST /api/v1/configs */
export interface LLMConfigCreate {
  provider: string;
  model_name: string;
  base_url?: string | null;
  api_key: string;
  is_active?: boolean;
}

/** A single chat message */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

/** Generation status */
export type GenerationStatus = "idle" | "streaming" | "done" | "error";

/** Token usage summary item */
export interface UsageSummaryItem {
  group_key: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  request_count: number;
}

/** SSE event from the backend */
export interface SSEEvent {
  type: "content" | "file_start" | "file_end" | "text" | "done" | "error";
  content: string;
  filename: string;
}

/** Generate request body */
export interface GenerateRequest {
  session_id: string;
  config_id: string;
  prompt: string;
}
