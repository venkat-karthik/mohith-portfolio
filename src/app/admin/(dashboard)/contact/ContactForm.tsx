"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminMutation } from "@/lib/admin-fetch";
import type { Contact } from "@/types/models";

export default function ContactForm({ initialData }: { initialData: Contact | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [formData, setFormData] = useState({
    email: initialData?.email ?? "",
    linkedin: initialData?.linkedin ?? "",
    github: initialData?.github ?? "",
    twitter: initialData?.twitter ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await adminMutation("/api/contact", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setIsError(false);
        setMessage("Contact info updated successfully.");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setIsError(true);
        setMessage(data.error ?? "Failed to update Contact info.");
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

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <label htmlFor="contact-email" style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Email Address *</span>
          <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleChange} style={fieldStyle} required />
        </label>

        <label htmlFor="contact-linkedin" style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>LinkedIn URL *</span>
          <input id="contact-linkedin" type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} style={fieldStyle} required />
        </label>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <label htmlFor="contact-github" style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>GitHub URL *</span>
          <input id="contact-github" type="url" name="github" value={formData.github} onChange={handleChange} style={fieldStyle} required />
        </label>

        <label htmlFor="contact-twitter" style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Twitter/X URL</span>
          <input id="contact-twitter" type="url" name="twitter" value={formData.twitter} onChange={handleChange} style={fieldStyle} />
        </label>
      </div>

      <div style={{ marginTop: "16px" }}>
        <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
