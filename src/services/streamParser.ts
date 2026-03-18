/**
 * SSE stream parser – connects to the backend generate endpoint,
 * reads the event stream, and updates Zustand stores in real time.
 */

import type { SSEEvent, GenerateRequest } from "@/types";
import { useFileStore } from "@/stores/useFileStore";
import { useChatStore } from "@/stores/useChatStore";
import { getGenerateStreamUrl } from "@/services/api";

/**
 * Start a streaming code generation request.
 *
 * Reads the SSE text/event-stream via fetch + ReadableStream and
 * dispatches events to the file store.
 */
export async function startGeneration(request: GenerateRequest): Promise<void> {
  const fileStore = useFileStore.getState();
  const chatStore = useChatStore.getState();

  chatStore.setStatus("streaming");

  try {
    const response = await fetch(getGenerateStreamUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok || !response.body) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let currentFile = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE format: lines starting with "data: "
      const lines = buffer.split("\n");
      // Keep last potentially incomplete line in buffer
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;

        const jsonStr = trimmed.slice(5).trim();
        if (!jsonStr || jsonStr === "[DONE]") continue;

        try {
          const event: SSEEvent = JSON.parse(jsonStr);
          handleEvent(event, fileStore, currentFile);

          if (event.type === "file_start") {
            currentFile = event.filename;
          } else if (event.type === "file_end") {
            currentFile = "";
          }
        } catch {
          // Ignore malformed JSON
        }
      }
    }

    chatStore.setStatus("done");
  } catch (err) {
    console.error("Stream error:", err);
    chatStore.setStatus("error");
  }
}

function handleEvent(
  event: SSEEvent,
  fileStore: ReturnType<typeof useFileStore.getState>,
  _currentFile: string
): void {
  switch (event.type) {
    case "file_start":
      // Initialise a new file in the store
      fileStore.setFile(event.filename, "");
      fileStore.selectFile(event.filename);
      break;

    case "content":
      // Append code chunk to the currently open file
      if (_currentFile) {
        fileStore.appendToFile(_currentFile, event.content);
      }
      break;

    case "file_end":
      // Mark file as complete → triggers Sandpack re-bundle
      fileStore.markReady(event.filename);
      break;

    case "error":
      console.error("Backend error:", event.content);
      useChatStore.getState().setStatus("error");
      break;

    case "done":
      useChatStore.getState().setStatus("done");
      break;

    default:
      break;
  }
}
