"use client";

import { useEffect, useRef, useCallback } from "react";
import { ProctoringEventPayload, ProctoringEventType } from "../types";
import { sendProctoringEvent } from "../api";

interface UseProctoringCollectorOptions {
  attemptId: number | null;
  enabled?: boolean;
  onViolationDetected?: (event: ProctoringEventPayload) => void;
}

export function useProctoringCollector({
  attemptId,
  enabled = true,
  onViolationDetected,
}: UseProctoringCollectorOptions) {
  const queueRef = useRef<ProctoringEventPayload[]>([]);
  const leaveTimeRef = useRef<number | null>(null);
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null);

  const flushQueue = useCallback(async () => {
    if (!attemptId || queueRef.current.length === 0) return;

    const eventsToSend = [...queueRef.current];
    queueRef.current = [];

    try {
      if (eventsToSend.length === 1) {
        await sendProctoringEvent(attemptId, eventsToSend[0]);
      } else {
        await sendProctoringEvent(attemptId, { events: eventsToSend });
      }
    } catch (err) {
      // Re-queue events if network error occurs (limit queue length to 30)
      queueRef.current = [...eventsToSend.slice(-15), ...queueRef.current].slice(-30);
      console.warn("Lỗi đồng bộ tín hiệu giám sát phòng thi:", err);
    }
  }, [attemptId]);

  const recordEvent = useCallback(
    (eventType: ProctoringEventType, metadata?: Record<string, unknown>, immediate = false) => {
      if (!enabled || !attemptId) return;

      const eventPayload: ProctoringEventPayload = {
        event_type: eventType,
        occurred_at: new Date().toISOString(),
        metadata,
      };

      queueRef.current.push(eventPayload);
      onViolationDetected?.(eventPayload);

      if (immediate) {
        flushQueue();
      } else if (!flushTimerRef.current) {
        flushTimerRef.current = setTimeout(() => {
          flushTimerRef.current = null;
          flushQueue();
        }, 5000);
      }
    },
    [attemptId, enabled, flushQueue, onViolationDetected]
  );

  useEffect(() => {
    if (!enabled || !attemptId) return;

    // 1. Tab Visibility Change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        leaveTimeRef.current = Date.now();
      } else if (leaveTimeRef.current) {
        const durationSeconds = Math.round((Date.now() - leaveTimeRef.current) / 1000);
        recordEvent("tab_hidden", { duration_seconds: durationSeconds }, durationSeconds >= 10);
        leaveTimeRef.current = null;
      }
    };

    // 2. Window Blur (Lost Focus)
    const handleWindowBlur = () => {
      recordEvent("window_blur", { timestamp: new Date().toISOString() });
    };

    // 3. Fullscreen Exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        recordEvent("fullscreen_exit", { context: "esc_or_f11_pressed" });
      }
    };

    // 4. Clipboard & Context Menu Traps
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      recordEvent("copy_paste_attempt", { action: "copy" });
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      recordEvent("copy_paste_attempt", { action: "paste" });
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 5. DevTools Hotkey Traps (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) ||
        (e.ctrlKey && ["u", "U"].includes(e.key))
      ) {
        e.preventDefault();
        recordEvent("devtools_opened", { trigger: e.key }, true);
      }
    };

    // 6. Multiple Displays Check (if supported)
    if (typeof window !== "undefined" && "screen" in window) {
      const anyScreen = window.screen as unknown as { isExtended?: boolean };
      if (anyScreen.isExtended) {
        recordEvent("multiple_displays", { context: "secondary_monitor_detected" });
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);

      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
      }
      flushQueue();
    };
  }, [attemptId, enabled, recordEvent, flushQueue]);

  return {
    recordEvent,
    flushQueue,
  };
}
