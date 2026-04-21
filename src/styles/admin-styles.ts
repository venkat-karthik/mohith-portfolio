// Shared admin UI styles
export const inputStyle: React.CSSProperties = {
  flex: "1 1 calc(50% - 8px)",
  padding: "12px",
  background: "var(--surface)",
  border: "1px solid var(--glass-border)",
  color: "var(--foreground)",
  borderRadius: "8px",
  fontFamily: "var(--font-sans)",
  outline: "none",
};

export const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical" as const,
  minHeight: "80px",
};

export const buttonPrimaryStyle: React.CSSProperties = {
  padding: "12px 24px",
  background: "var(--accent)",
  color: "black",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
};

export const buttonSecondaryStyle: React.CSSProperties = {
  padding: "12px 24px",
  background: "transparent",
  color: "var(--foreground)",
  border: "1px solid var(--glass-border)",
  borderRadius: "8px",
  fontWeight: "500",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
};

export const formContainerStyle: React.CSSProperties = {
  padding: "24px",
  borderBottom: "1px solid var(--glass-border)",
};

export const tableHeaderStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--glass-border)",
  backgroundColor: "rgba(0,0,0,0.2)",
};

export const tableCellStyle: React.CSSProperties = {
  padding: "16px 24px",
};

export const pinnedBadgeStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  padding: "2px 8px",
  background: "var(--accent)",
  color: "black",
  borderRadius: "12px",
  marginLeft: "8px",
};

export const messageBoxStyle: React.CSSProperties = {
  padding: "12px",
  background: "rgba(255,255,255,0.05)",
  borderRadius: "8px",
  color: "var(--accent)",
};

export const errorBoxStyle: React.CSSProperties = {
  ...messageBoxStyle,
  background: "rgba(239,68,68,0.1)",
  color: "#ef4444",
};

export const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "var(--text-muted)",
  fontSize: "0.9rem",
  cursor: "pointer",
};
