/**
 * Structured server-side logger with timestamps.
 * Writes to console (stdout/stderr) and persists to dedicated Supabase tables:
 * - payment_logs: dedicated exclusively to payment and transaction flows
 * - system_logs: dedicated to auth, admin operations, and general system events
 */

import { createServiceClient } from "@/lib/supabase/server";

export type LogLevel = "info" | "warn" | "error";
export type LogTarget = "payment" | "system";

export interface LogEntry {
  level: LogLevel;
  event: string;
  message: string;
  target?: LogTarget;
  paymentId?: string;
  registrationId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

function timestamp(): string {
  return new Date().toISOString();
}

function consoleLog(entry: LogEntry) {
  const prefix = `[${timestamp()}] [${entry.level.toUpperCase()}] [${entry.event}]`;
  const line = `${prefix} ${entry.message}`;
  if (entry.level === "error") {
    console.error(line, entry.metadata ?? "");
  } else if (entry.level === "warn") {
    console.warn(line, entry.metadata ?? "");
  } else {
    console.log(line, entry.metadata ?? "");
  }
}

/**
 * Resolves the destination table for a log entry.
 * - Explicit target ("payment" or "system") takes precedence.
 * - Presence of paymentId or events starting with "PAYMENT_" route to payment_logs.
 * - All other events (e.g. AUTH_*, ADMIN_*, REGISTRATION_*) route to system_logs.
 */
export function resolveLogTarget(entry: LogEntry): LogTarget {
  if (entry.target) return entry.target;
  if (entry.paymentId || entry.event.startsWith("PAYMENT_")) {
    return "payment";
  }
  return "system";
}

/**
 * Log an event to console and persist to the corresponding Supabase table (payment_logs or system_logs).
 * Never throws — logging failures are caught to avoid breaking runtime flows.
 */
export async function log(entry: LogEntry): Promise<void> {
  consoleLog(entry);

  try {
    const supabase = createServiceClient();
    const target = resolveLogTarget(entry);

    if (target === "payment") {
      await supabase.from("payment_logs").insert({
        level: entry.level,
        event: entry.event,
        message: entry.message,
        payment_id: entry.paymentId ?? null,
        registration_id: entry.registrationId ?? null,
        metadata: entry.metadata ?? null,
        ip_address: entry.ipAddress ?? null,
        user_agent: entry.userAgent ?? null,
      });
    } else {
      await supabase.from("system_logs").insert({
        level: entry.level,
        event: entry.event,
        message: entry.message,
        registration_id: entry.registrationId ?? null,
        metadata: entry.metadata ?? null,
        ip_address: entry.ipAddress ?? null,
        user_agent: entry.userAgent ?? null,
      });
    }
  } catch (err) {
    // Don't let a logging failure break application flow
    console.error(`[${timestamp()}] [ERROR] [logger] Failed to persist log`, err);
  }
}

/** Convenience wrappers */
export const logger = {
  info: (event: string, message: string, rest?: Omit<LogEntry, "level" | "event" | "message">) =>
    log({ level: "info", event, message, ...rest }),

  warn: (event: string, message: string, rest?: Omit<LogEntry, "level" | "event" | "message">) =>
    log({ level: "warn", event, message, ...rest }),

  error: (event: string, message: string, rest?: Omit<LogEntry, "level" | "event" | "message">) =>
    log({ level: "error", event, message, ...rest }),

  /** Explicit payment logger — guarantees write to public.payment_logs */
  payment: {
    info: (event: string, message: string, rest?: Omit<LogEntry, "level" | "event" | "message" | "target">) =>
      log({ level: "info", event, message, target: "payment", ...rest }),
    warn: (event: string, message: string, rest?: Omit<LogEntry, "level" | "event" | "message" | "target">) =>
      log({ level: "warn", event, message, target: "payment", ...rest }),
    error: (event: string, message: string, rest?: Omit<LogEntry, "level" | "event" | "message" | "target">) =>
      log({ level: "error", event, message, target: "payment", ...rest }),
  },

  /** Explicit system logger — guarantees write to public.system_logs */
  system: {
    info: (event: string, message: string, rest?: Omit<LogEntry, "level" | "event" | "message" | "target">) =>
      log({ level: "info", event, message, target: "system", ...rest }),
    warn: (event: string, message: string, rest?: Omit<LogEntry, "level" | "event" | "message" | "target">) =>
      log({ level: "warn", event, message, target: "system", ...rest }),
    error: (event: string, message: string, rest?: Omit<LogEntry, "level" | "event" | "message" | "target">) =>
      log({ level: "error", event, message, target: "system", ...rest }),
  },
};
