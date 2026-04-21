"use client";

import { useState } from "react";
import { adminMutation } from "@/lib/admin-fetch";
import type { Blog } from "@/types/models";
import {
  inputStyle,
  formContainerStyle,
  tableHeaderStyle,
  tableCellStyle,
  pinnedBadgeStyle,
  labelStyle,
} from "@/styles/admin-styles";

type BlogForm = {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  readingTime: string;
  coverImage: string;
  isPinned: boolean;
  isPublished: boolean;
};

const defaultForm: BlogForm = {
  title: "",
  category: "",
  excerpt: "",
  content: "",
  readingTime: "",
  coverImage: "",
  isPinned: false,
  isPublished: false,
};

export default function BlogsClient({ initialBlogs }: { initialBlogs: Blog[] }) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error("Failed to fetch");
      setBlogs(await res.json());
    } catch {
      setError("Failed to refresh blogs.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = isEditing
        ? await adminMutation(`/api/blogs/${isEditing}`, { method: "PUT", body: formData })
        : await adminMutation("/api/blogs", { method: "POST", body: formData });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save blog.");
        return;
      }
      setFormData(defaultForm);
      setIsEditing(null);
      await fetchBlogs();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Blog) => {
    setIsEditing(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      excerpt: item.excerpt,
      content: item.content,
      readingTime: item.readingTime,
      coverImage: item.coverImage ?? "",
      isPinned: item.isPinned,
      isPublished: item.isPublished,
    });
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    setError(null);
    try {
      const res = await adminMutation(`/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to delete blog.");
        return;
      }
      await fetchBlogs();
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  const handleTogglePin = async (item: Blog) => {
    setError(null);
    try {
      const res = await adminMutation(`/api/blogs/${item.id}`, {
        method: "PUT",
        body: { isPinned: !item.isPinned },
      });
      if (!res.ok) { setError("Failed to update pin status."); return; }
      await fetchBlogs();
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  const handleTogglePublish = async (item: Blog) => {
    setError(null);
    try {
      const res = await adminMutation(`/api/blogs/${item.id}`, {
        method: "PUT",
        body: { isPublished: !item.isPublished },
      });
      if (!res.ok) { setError("Failed to update publish status."); return; }
      await fetchBlogs();
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div style={formContainerStyle}>
        <h3 style={{ marginBottom: "16px", color: "var(--accent)" }}>
          {isEditing ? "Edit Blog" : "Add New Blog"}
        </h3>

        {error && (
          <div role="alert" style={{ padding: "12px", background: "rgba(239,68,68,0.1)", borderRadius: "8px", color: "#ef4444", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <label htmlFor="blog-title" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Title *</span>
              <input id="blog-title" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Blog Title" required style={{ ...inputStyle, flex: "unset" }} />
            </label>
            <label htmlFor="blog-category" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Category *</span>
              <input id="blog-category" type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category / Tag" required style={{ ...inputStyle, flex: "unset" }} />
            </label>
          </div>

          <label htmlFor="blog-excerpt" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Excerpt *</span>
            <textarea id="blog-excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Short Excerpt" required style={{ ...inputStyle, flex: "unset", resize: "vertical", minHeight: "60px" }} />
          </label>

          <label htmlFor="blog-content" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Content *</span>
            <textarea id="blog-content" name="content" value={formData.content} onChange={handleChange} placeholder="Full Content (Markdown or Text)" required style={{ ...inputStyle, flex: "unset", resize: "vertical", minHeight: "150px" }} />
          </label>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <label htmlFor="blog-readingTime" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Reading Time *</span>
              <input id="blog-readingTime" type="text" name="readingTime" value={formData.readingTime} onChange={handleChange} placeholder="e.g. 5 min read" required style={{ ...inputStyle, flex: "unset" }} />
            </label>
            <label htmlFor="blog-coverImage" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Cover Image URL</span>
              <input id="blog-coverImage" type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://... (optional)" style={{ ...inputStyle, flex: "unset" }} />
            </label>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <label style={labelStyle}>
              <input type="checkbox" name="isPinned" checked={formData.isPinned} onChange={handleChange} aria-label="Pin to Homepage" />
              Pin to Homepage (Max 3)
            </label>
            <label style={labelStyle}>
              <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} aria-label="Publish blog" />
              Publish (Visible to public)
            </label>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
              {loading ? "Saving..." : isEditing ? "Update Blog" : "Create Blog"}
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
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500", width: "40%" }}>Title</th>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500" }}>Status</th>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500" }}>Pinned</th>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 && (
              <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>No blogs found. Create one above.</td></tr>
            )}
            {blogs.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <td style={{ ...tableCellStyle, fontWeight: "500" }}>
                  {item.title}
                  <br />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "400" }}>{item.category}</span>
                  {item.isPinned && <span style={pinnedBadgeStyle}>PINNED</span>}
                </td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => handleTogglePublish(item)}
                    style={{ color: item.isPublished ? "#22c55e" : "var(--text-muted)", fontSize: "0.85rem", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
                    aria-label={item.isPublished ? "Unpublish blog" : "Publish blog"}
                  >
                    {item.isPublished ? "Published" : "Draft"}
                  </button>
                </td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => handleTogglePin(item)}
                    style={{ color: item.isPinned ? "var(--accent)" : "var(--text-muted)", fontSize: "0.85rem", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
                    aria-label={item.isPinned ? "Unpin blog" : "Pin blog"}
                  >
                    {item.isPinned ? "Unpin" : "Pin"}
                  </button>
                </td>
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
