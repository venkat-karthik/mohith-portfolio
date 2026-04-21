"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminMutation } from "@/lib/admin-fetch";
import type { About } from "@/types/models";

export default function AboutForm({ initialData }: { initialData: About | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [formData, setFormData] = useState({
    content: initialData?.content ?? "",
    imageUrl: initialData?.imageUrl ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await adminMutation("/api/about", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setIsError(false);
        setMessage("About section updated successfully.");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setIsError(true);
        setMessage(data.error ?? "Failed to update About section.");
      }
    } catch {
      setIsError(true);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    padding: "12px",
    background: "var(--surface)",
    border: "1px solid var(--glass-border)",
    color: "var(--foreground)",
    borderRadius: "8px",
    fontFamily: "var(--font-sans)",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {message && (
        <div
          role={isError ? "alert" : "status"}
          style={{
            padding: "12px",
            background: isError ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)",
            borderRadius: "8px",
            color: isError ? "#ef4444" : "var(--accent)",
          }}
        >
          {message}
        </div>
      )}

      <label htmlFor="about-content" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>About Me (Your Story) *</span>
        <textarea
          id="about-content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={8}
          style={{ ...fieldStyle, resize: "vertical" }}
          required
        />
      </label>

      <label htmlFor="about-imageUrl" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Profile Image URL</span>
        <input
          id="about-imageUrl"
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://... or /path/to/image (optional)"
          style={fieldStyle}
        />
      </label>

      <div style={{ marginTop: "16px" }}>
        <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
