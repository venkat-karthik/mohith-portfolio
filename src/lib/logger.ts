import "server-only";

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: unknown;
  timestamp: string;
}

function formatError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
  return { raw: String(error) };
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown) {
  const entry: LogEntry = {
    level,
    message,
    context,
    error: error !== undefined ? formatError(error) : undefined,
    timestamp: new Date().toISOString(),
  };

  const output = JSON.stringify(entry);

  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) =>
    log("info", message, context),

  warn: (message: string, context?: Record<string, unknown>, error?: unknown) =>
    log("warn", message, context, error),

  error: (message: string, context?: Record<string, unknown>, error?: unknown) =>
    log("error", message, context, error),
};
