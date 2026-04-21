"use client";

import { useState } from "react";
import { adminMutation } from "@/lib/admin-fetch";
import type { Project } from "@/types/models";
import {
  inputStyle,
  formContainerStyle,
  tableHeaderStyle,
  tableCellStyle,
  pinnedBadgeStyle,
  labelStyle,
} from "@/styles/admin-styles";

type ProjectForm = {
  title: string;
  description: string;
  techStack: string;
  outcome: string;
  demoLink: string;
  githubLink: string;
  imageUrl: string;
  isPinned: boolean;
};

const defaultForm: ProjectForm = {
  title: "",
  description: "",
  techStack: "",
  outcome: "",
  demoLink: "",
  githubLink: "",
  imageUrl: "",
  isPinned: false,
};

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch");
      setProjects(await res.json());
    } catch {
      setError("Failed to refresh projects.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        ? await adminMutation(`/api/projects/${isEditing}`, { method: "PUT", body: formData })
        : await adminMutation("/api/projects", { method: "POST", body: formData });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save project.");
        return;
      }
      setFormData(defaultForm);
      setIsEditing(null);
      await fetchProjects();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (proj: Project) => {
    setIsEditing(proj.id);
    setFormData({
      title: proj.title,
      description: proj.description,
      techStack: proj.techStack,
      outcome: proj.outcome,
      demoLink: proj.demoLink ?? "",
      githubLink: proj.githubLink ?? "",
      imageUrl: proj.imageUrl ?? "",
      isPinned: proj.isPinned,
    });
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setError(null);
    try {
      const res = await adminMutation(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) { setError("Failed to delete project."); return; }
      await fetchProjects();
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  const handleTogglePin = async (proj: Project) => {
    setError(null);
    try {
      const res = await adminMutation(`/api/projects/${proj.id}`, {
        method: "PUT",
        body: { isPinned: !proj.isPinned },
      });
      if (!res.ok) { setError("Failed to update pin status."); return; }
      await fetchProjects();
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div style={formContainerStyle}>
        <h3 style={{ marginBottom: "16px", color: "var(--accent)" }}>
          {isEditing ? "Edit Project" : "Add New Project"}
        </h3>

        {error && (
          <div role="alert" style={{ padding: "12px", background: "rgba(239,68,68,0.1)", borderRadius: "8px", color: "#ef4444", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <label htmlFor="proj-title" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Title *</span>
              <input id="proj-title" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Project Title" required style={{ ...inputStyle, flex: "unset" }} />
            </label>
            <label htmlFor="proj-techStack" style={{ flex: "1 1 calc(50% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Tech Stack *</span>
              <input id="proj-techStack" type="text" name="techStack" value={formData.techStack} onChange={handleChange} placeholder="e.g. Next.js, Prisma, CSS" required style={{ ...inputStyle, flex: "unset" }} />
            </label>
          </div>

          <label htmlFor="proj-description" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Description *</span>
            <textarea id="proj-description" name="description" value={formData.description} onChange={handleChange} placeholder="Project Description" required style={{ ...inputStyle, flex: "unset", resize: "vertical", minHeight: "80px" }} />
          </label>

          <label htmlFor="proj-outcome" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Outcome / Impact *</span>
            <textarea id="proj-outcome" name="outcome" value={formData.outcome} onChange={handleChange} placeholder="Outcome / Impact" required style={{ ...inputStyle, flex: "unset", resize: "vertical", minHeight: "60px" }} />
          </label>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <label htmlFor="proj-demoLink" style={{ flex: "1 1 calc(33% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Demo URL</span>
              <input id="proj-demoLink" type="url" name="demoLink" value={formData.demoLink} onChange={handleChange} placeholder="https://..." style={{ ...inputStyle, flex: "unset" }} />
            </label>
            <label htmlFor="proj-githubLink" style={{ flex: "1 1 calc(33% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>GitHub URL</span>
              <input id="proj-githubLink" type="url" name="githubLink" value={formData.githubLink} onChange={handleChange} placeholder="https://github.com/..." style={{ ...inputStyle, flex: "unset" }} />
            </label>
            <label htmlFor="proj-imageUrl" style={{ flex: "1 1 calc(33% - 8px)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Cover Image URL</span>
              <input id="proj-imageUrl" type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://... or /path" style={{ ...inputStyle, flex: "unset" }} />
            </label>
          </div>

          <label style={labelStyle}>
            <input type="checkbox" name="isPinned" checked={formData.isPinned} onChange={handleChange} aria-label="Pin to Homepage" />
            Pin to Homepage (Max 3 recommended)
          </label>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
              {loading ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
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
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500" }}>Tech</th>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500" }}>Pinned</th>
              <th style={{ ...tableCellStyle, color: "var(--text-muted)", fontWeight: "500", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>No projects found. Create one above.</td></tr>
            )}
            {projects.map((proj) => (
              <tr key={proj.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <td style={{ ...tableCellStyle, fontWeight: "500" }}>
                  {proj.title}
                  {proj.isPinned && <span style={pinnedBadgeStyle}>PINNED</span>}
                </td>
                <td style={{ ...tableCellStyle, color: "var(--text-muted)", fontSize: "0.9rem" }}>{proj.techStack}</td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => handleTogglePin(proj)}
                    style={{ color: proj.isPinned ? "var(--accent)" : "var(--text-muted)", fontSize: "0.85rem", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
                    aria-label={proj.isPinned ? "Unpin project" : "Pin project"}
                  >
                    {proj.isPinned ? "Unpin" : "Pin"}
                  </button>
                </td>
                <td style={{ ...tableCellStyle, textAlign: "right", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button onClick={() => handleEdit(proj)} style={{ color: "#3b82f6", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }} aria-label={`Edit ${proj.title}`}>Edit</button>
                  <button onClick={() => handleDelete(proj.id)} style={{ color: "#ef4444", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }} aria-label={`Delete ${proj.title}`}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
