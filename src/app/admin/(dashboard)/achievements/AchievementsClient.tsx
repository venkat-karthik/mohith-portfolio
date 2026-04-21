"use client";

import { useState } from "react";
import { adminMutation } from "@/lib/admin-fetch";
import type { Achievement } from "@/types/models";
import {
  inputStyle,
  formContainerStyle,
  tableHeaderStyle,
  tableCellStyle,
  pinnedBadgeStyle,
  labelStyle,
} from "@/styles/admin-styles";

type AchievementForm = Omit<Achievement, "id" | "order">;

const defaultForm: AchievementForm = {
  title: "",
  type: "",
  date: "",
  description: "",
  imageUrl: null,
  isPinned: false,
};

export default function AchievementsClient({
  initialAchievements,
}: {
  initialAchievements: Achievement[];
}) {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<AchievementForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/achievements");
      if (!res.ok) throw new Error("Failed to fetch");
      setAchievements(await res.json());
    } catch {
      setError("Failed to refresh achievements.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value || null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = isEditing
        ? await adminMutation(`/api/achievements/${isEditing}`, { method: "PUT", body: formData })
        : await adminMutation("/api/achievements", { method: "POST", body: formData });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save achievement.");
        return;
      }
      setFormData(defaultForm);
      setIsEditing(null);
      await fetchAchievements();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Achievement) => {
    setIsEditing(item.id);
    setFormData({
      title: item.title,
      type: item.type,
      date: item.date,
      description: item.description,
      imageUrl: item.imageUrl,
      isPinned: item.isPinned,
    });
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    setError(null);
    try {
      const res = await adminMutation(`/api/achievements/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to delete achievement.");
        return;
      }
      await fetchAchievements();
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  const handleTogglePin = async (item: Achievement) => {
    setError(null);
    try {
      const res = await adminMutation(`/api/achievements/${item.id}`, {
        method: "PUT",
        body: { isPinned: !item.isPinned },
      });
      if (!res.ok) {
        setError("Failed to update pin status.");
        return;
      }
      await fetchAchievements();
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div style={formContainerStyle}>
        <h3 style={{ marginBottom: "16px", color: "var(--accent)" }}>
          {isEditing ? "Edit Achievement" : "Add New Achievement"}
        </h3>

        {error && (
          <div
            role="alert"
            style={{
              padding: "12px",
              background: "rgba(239,68,68,0.1)",
              borderRadius: "8px",
              color: "#ef4444",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <label htmlFor="ach-title" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Title *</span>
              <input
                id="ach-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Achievement Title"
                required
                style={{ ...inputStyle, flex: "unset" }}
              />
            </label>
            <label htmlFor="ach-type" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Type *</span>
              <input
                id="ach-type"
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="e.g. Hackathon, Award, Certification"
                required
                style={{ ...inputStyle, flex: "unset" }}
              />
            </label>
          </div>

          <label htmlFor="ach-date" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Date *</span>
            <input
              id="ach-date"
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="e.g. Dec 2025"
              required
              style={{ ...inputStyle, flex: "unset" }}
            />
          </label>

          <label htmlFor="ach-description" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Description *</span>
            <textarea
              id="ach-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
              style={{ ...inputStyle, flex: "unset", resize: "vertical", minHeight: "80px" }}
            />
          </label>

          <label htmlFor="ach-imageUrl" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Proof / Image URL</span>
            <input
              id="ach-imageUrl"
              type="text"
              name="imageUrl"
              value={formData.imageUrl ?? ""}
              onChange={handleChange}
              placeholder="https://... (optional)"
              style={{ ...inputStyle, flex: "unset" }}
            />
          </label>

          <label style={labelStyle}>
            <input
              type="checkbox"
              name="isPinned"
              checked={formData.isPinned}
              onChange={handleChange}
              aria-label="Pin to Homepage"
            />
            Pin to Homepage (Max 3 recommended)
          </label>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
              {loading ? "Saving..." : isEditing ? "Update Achievement" : "Create Achievement"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setIsEditing(null); setFormData(defaultForm); setError(null); }}
              >
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
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500", width: "40%" }}>Title</th>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500" }}>Type / Date</th>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500" }}>Pinned</th>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {achievements.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>
                  No achievements found. Create one above.
                </td>
              </tr>
            )}
            {achievements.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <td style={{ ...tableCellStyle, fontWeight: "500" }}>
                  {item.title}
                  {item.isPinned && <span style={pinnedBadgeStyle}>PINNED</span>}
                </td>
                <td style={{ ...tableCellStyle, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  {item.type}
                  <br />
                  <span style={{ fontSize: "0.8rem" }}>{item.date}</span>
                </td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => handleTogglePin(item)}
                    style={{
                      color: item.isPinned ? "var(--accent)" : "var(--text-muted)",
                      fontSize: "0.85rem",
                      textDecoration: "underline",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    aria-label={item.isPinned ? "Unpin achievement" : "Pin achievement"}
                  >
                    {item.isPinned ? "Unpin" : "Pin"}
                  </button>
                </td>
                <td style={{ ...tableCellStyle, textAlign: "right", display: "flex", gap: "12px", justifyContent: "flex-end", alignItems: "center" }}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{ color: "#3b82f6", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }}
                    aria-label={`Edit ${item.title}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ color: "#ef4444", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }}
                    aria-label={`Delete ${item.title}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
