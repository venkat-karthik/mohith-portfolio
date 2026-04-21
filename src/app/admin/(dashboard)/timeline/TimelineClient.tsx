"use client";

import { useState } from "react";
import { adminMutation } from "@/lib/admin-fetch";
import type { TimelineItem } from "@/types/models";
import {
  inputStyle,
  formContainerStyle,
  tableHeaderStyle,
  tableCellStyle,
} from "@/styles/admin-styles";

type TimelineForm = Omit<TimelineItem, "id">;

const defaultForm: TimelineForm = {
  title: "",
  type: "",
  date: "",
  description: "",
  order: 0,
};

export default function TimelineClient({ initialItems }: { initialItems: TimelineItem[] }) {
  const [items, setItems] = useState<TimelineItem[]>(initialItems);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<TimelineForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/timeline");
      if (!res.ok) throw new Error("Failed to fetch");
      setItems(await res.json());
    } catch {
      setError("Failed to refresh timeline.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "order" ? parseInt(value) || 0 : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = isEditing
        ? await adminMutation(`/api/timeline/${isEditing}`, { method: "PUT", body: formData })
        : await adminMutation("/api/timeline", { method: "POST", body: formData });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save timeline item.");
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

  const handleEdit = (item: TimelineItem) => {
    setIsEditing(item.id);
    setFormData({
      title: item.title,
      type: item.type,
      date: item.date,
      description: item.description,
      order: item.order,
    });
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this timeline item?")) return;
    setError(null);
    try {
      const res = await adminMutation(`/api/timeline/${id}`, { method: "DELETE" });
      if (!res.ok) { setError("Failed to delete timeline item."); return; }
      await fetchItems();
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div style={formContainerStyle}>
        <h3 style={{ marginBottom: "16px", color: "var(--accent)" }}>
          {isEditing ? "Edit Timeline Item" : "Add New Timeline Item"}
        </h3>

        {error && (
          <div role="alert" style={{ padding: "12px", background: "rgba(239,68,68,0.1)", borderRadius: "8px", color: "#ef4444", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <label htmlFor="tl-title" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Title *</span>
              <input id="tl-title" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Role / Degree Title" required style={{ ...inputStyle, flex: "unset" }} />
            </label>
            <label htmlFor="tl-type" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Type *</span>
              <input id="tl-type" type="text" name="type" value={formData.type} onChange={handleChange} placeholder="e.g. Work, Education" required style={{ ...inputStyle, flex: "unset" }} />
            </label>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <label htmlFor="tl-date" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Date *</span>
              <input id="tl-date" type="text" name="date" value={formData.date} onChange={handleChange} placeholder="e.g. 2020 – 2024" required style={{ ...inputStyle, flex: "unset" }} />
            </label>
            <label htmlFor="tl-order" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Display Order</span>
              <input id="tl-order" type="number" name="order" value={formData.order} onChange={handleChange} placeholder="0" style={{ ...inputStyle, flex: "unset" }} />
            </label>
          </div>

          <label htmlFor="tl-description" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Description *</span>
            <textarea id="tl-description" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required style={{ ...inputStyle, flex: "unset", resize: "vertical", minHeight: "80px" }} />
          </label>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
              {loading ? "Saving..." : isEditing ? "Update Timeline" : "Create Timeline"}
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
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500" }}>Title &amp; Date</th>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500" }}>Type</th>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={3} style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>No timeline items found. Create one above.</td></tr>
            )}
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <td style={{ ...tableCellStyle, fontWeight: "500" }}>
                  {item.title}
                  <br />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "400" }}>{item.date}</span>
                </td>
                <td style={{ ...tableCellStyle, color: "var(--text-muted)", fontSize: "0.9rem" }}>{item.type}</td>
                <td style={{ ...tableCellStyle, textAlign: "right", display: "flex", gap: "12px", justifyContent: "flex-end", alignItems: "center" }}>
                  <button onClick={() => handleEdit(item)} style={{ color: "#3b82f6", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }} aria-label={`Edit ${item.title}`}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ color: "#ef4444", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }} aria-label={`Delete ${item.title}`}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
