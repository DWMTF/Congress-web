/**
 * Structured server-side logger with timestamps.
 * Writes to console (stdout/stderr) AND persists to the
 * payment_logs Supabase table when IDs are provided.
 */

import { createServiceClient } from "@/lib/supabase/server";

export type LogLevel = "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  event: string;
  message: string;
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
 * Log an event to console and persist to payment_logs table.
 * Never throws — logging failures are swallowed to avoid
 * disrupting the payment flow.
 */
export async function log(entry: LogEntry): Promise<void> {
  consoleLog(entry);

  try {
    const supabase = createServiceClient();
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
  } catch (err) {
    // Don't let a logging failure break the payment flow
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
};
