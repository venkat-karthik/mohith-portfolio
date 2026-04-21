"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminMutation } from "@/lib/admin-fetch";
import type { Hero } from "@/types/models";

export default function HeroForm({ initialData }: { initialData: Hero | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    identityStatement: initialData?.identityStatement || "",
    valueProposition: initialData?.valueProposition || "",
    ctaPrimaryText: initialData?.ctaPrimaryText || "",
    ctaPrimaryLink: initialData?.ctaPrimaryLink || "",
    ctaSecondaryText: initialData?.ctaSecondaryText || "",
    ctaSecondaryLink: initialData?.ctaSecondaryLink || "",
    isAvailable: initialData?.isAvailable ?? true,
    scrollCtaText: initialData?.scrollCtaText || "Scroll",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = e.target instanceof HTMLInputElement && type === "checkbox";
    
    setFormData({ 
      ...formData, 
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await adminMutation("/api/hero", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setIsError(false);
        setMessage("Hero section updated successfully.");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setIsError(true);
        setMessage(data.error ?? "Failed to update Hero section.");
      }
    } catch {
      setIsError(true);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
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
      
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Your Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px" }} 
            required 
          />
        </div>

        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: "10px", marginTop: "24px" }}>
          <input 
            type="checkbox" 
            name="isAvailable" 
            checked={formData.isAvailable} 
            onChange={handleChange} 
            style={{ width: "20px", height: "20px", cursor: "pointer" }} 
          />
          <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", cursor: "pointer" }}>Currently Available for Projects</label>
        </div>
      </div>

      <div style={{ flex: "50px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Identity Statement (e.g. Full Stack Developer)</label>
        <input 
          type="text" 
          name="identityStatement" 
          value={formData.identityStatement} 
          onChange={handleChange} 
          style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px" }} 
          required 
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Value Proposition</label>
        <textarea 
          name="valueProposition" 
          value={formData.valueProposition} 
          onChange={handleChange} 
          rows={4}
          style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px", fontFamily: "var(--font-sans)", resize: "vertical" }} 
          required 
        />
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Primary CTA Text</label>
          <input 
            type="text" 
            name="ctaPrimaryText" 
            value={formData.ctaPrimaryText} 
            onChange={handleChange} 
            style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px" }} 
          />
        </div>

        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Primary CTA Link</label>
          <input 
            type="text" 
            name="ctaPrimaryLink" 
            value={formData.ctaPrimaryLink} 
            onChange={handleChange} 
            style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px" }} 
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Secondary CTA Text</label>
          <input 
            type="text" 
            name="ctaSecondaryText" 
            value={formData.ctaSecondaryText} 
            onChange={handleChange} 
            style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px" }} 
          />
        </div>

        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Secondary CTA Link</label>
          <input 
            type="text" 
            name="ctaSecondaryLink" 
            value={formData.ctaSecondaryLink} 
            onChange={handleChange} 
            style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px" }} 
          />
        </div>
      </div>

      <div style={{ flex: "50px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Scroll Animation Text (e.g. Scroll)</label>
        <input 
          type="text" 
          name="scrollCtaText" 
          value={formData.scrollCtaText} 
          onChange={handleChange} 
          style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px" }} 
        />
      </div>

      <div style={{ marginTop: "16px" }}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
