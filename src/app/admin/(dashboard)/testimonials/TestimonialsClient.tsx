"use client";

import { useState } from "react";
import { adminMutation } from "@/lib/admin-fetch";
import type { Testimonial } from "@/types/models";
import {
  inputStyle,
  formContainerStyle,
  tableHeaderStyle,
  tableCellStyle,
} from "@/styles/admin-styles";

type TestimonialForm = Omit<Testimonial, "id">;

const defaultForm: TestimonialForm = {
  quote: "",
  authorName: "",
  authorRole: "",
  authorContext: null,
  order: 0,
};

export default function TestimonialsClient({ initialItems }: { initialItems: Testimonial[] }) {
  const [items, setItems] = useState<Testimonial[]>(initialItems);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<TestimonialForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed to fetch");
      setItems(await res.json());
    } catch {
      setError("Failed to refresh testimonials.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "order" ? parseInt(value) || 0 : value || null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = isEditing
        ? await adminMutation(`/api/testimonials/${isEditing}`, { method: "PUT", body: formData })
        : await adminMutation("/api/testimonials", { method: "POST", body: formData });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save testimonial.");
        return;
      }
      setFormData(defaultForm);
      setIsEditing(null);
      await fetchItems();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Testimonial) => {
    setIsEditing(item.id);
    setFormData({
      quote: item.quote,
      authorName: item.authorName,
      authorRole: item.authorRole,
      authorContext: item.authorContext,
      order: item.order,
    });
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setError(null);
    try {
      const res = await adminMutation(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) { setError("Failed to delete testimonial."); return; }
      await fetchItems();
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div style={formContainerStyle}>
        <h3 style={{ marginBottom: "16px", color: "var(--accent)" }}>
          {isEditing ? "Edit Testimonial" : "Add New Testimonial"}
        </h3>

        {error && (
          <div role="alert" style={{ padding: "12px", background: "rgba(239,68,68,0.1)", borderRadius: "8px", color: "#ef4444", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <label htmlFor="test-authorName" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Author Name *</span>
              <input id="test-authorName" type="text" name="authorName" value={formData.authorName} onChange={handleChange} placeholder="Author Name" required style={{ ...inputStyle, flex: "unset" }} />
            </label>
            <label htmlFor="test-authorRole" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Role / Company *</span>
              <input id="test-authorRole" type="text" name="authorRole" value={formData.authorRole} onChange={handleChange} placeholder="Role / Company" required style={{ ...inputStyle, flex: "unset" }} />
            </label>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <label htmlFor="test-authorContext" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Context</span>
              <input id="test-authorContext" type="text" name="authorContext" value={formData.authorContext ?? ""} onChange={handleChange} placeholder="e.g. Previous Manager (optional)" style={{ ...inputStyle, flex: "unset" }} />
            </label>
            <label htmlFor="test-order" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Display Order</span>
              <input id="test-order" type="number" name="order" value={formData.order} onChange={handleChange} placeholder="0" style={{ ...inputStyle, flex: "unset" }} />
            </label>
          </div>

          <label htmlFor="test-quote" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Quote *</span>
            <textarea id="test-quote" name="quote" value={formData.quote} onChange={handleChange} placeholder="The testimonial quote..." required style={{ ...inputStyle, flex: "unset", resize: "vertical", minHeight: "80px" }} />
          </label>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
              {loading ? "Saving..." : isEditing ? "Update Testimonial" : "Create Testimonial"}
            </button>
            {isEditing && (
              <button type="button" className="btn-secondary" onClick={() => { setIsEditing(null); setFormData(defaultForm); setError(null); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500", width: "40%" }}>Author</th>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500" }}>Context</th>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={3} style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>No testimonials found. Create one above.</td></tr>
            )}
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <td style={{ ...tableCellStyle, fontWeight: "500" }}>
                  {item.authorName}
                  <br />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "400" }}>{item.authorRole}</span>
                </td>
                <td style={{ ...tableCellStyle, color: "var(--text-muted)", fontSize: "0.9rem" }}>{item.authorContext ?? "—"}</td>
                <td style={{ ...tableCellStyle, textAlign: "right", display: "flex", gap: "12px", justifyContent: "flex-end", alignItems: "center" }}>
                  <button onClick={() => handleEdit(item)} style={{ color: "#3b82f6", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }} aria-label={`Edit testimonial by ${item.authorName}`}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ color: "#ef4444", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }} aria-label={`Delete testimonial by ${item.authorName}`}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
