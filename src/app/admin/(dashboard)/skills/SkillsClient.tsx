"use client";

import { useState } from "react";
import { adminMutation } from "@/lib/admin-fetch";
import type { SkillCategory } from "@/types/models";
import { inputStyle } from "@/styles/admin-styles";

type CatForm = { name: string; order: number };
type SkillForm = { name: string; categoryId: string; level: number; order: number };

export default function SkillsClient({ initialCategories }: { initialCategories: SkillCategory[] }) {
  const [categories, setCategories] = useState<SkillCategory[]>(initialCategories);
  const [catForm, setCatForm] = useState<CatForm>({ name: "", order: 0 });
  const [skillForm, setSkillForm] = useState<SkillForm>({ name: "", categoryId: "", level: 5, order: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/skill-categories");
      if (!res.ok) throw new Error("Failed to fetch");
      setCategories(await res.json());
    } catch {
      setError("Failed to refresh categories.");
    }
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminMutation("/api/skill-categories", { method: "POST", body: catForm });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to create category.");
        return;
      }
      setCatForm({ name: "", order: 0 });
      await fetchCategories();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.categoryId) { setError("Select a category first."); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await adminMutation("/api/skills", { method: "POST", body: skillForm });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to add skill.");
        return;
      }
      setSkillForm({ name: "", categoryId: "", level: 5, order: 0 });
      await fetchCategories();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    setError(null);
    try {
      const res = await adminMutation(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) { setError("Failed to delete skill."); return; }
      await fetchCategories();
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}" and ALL its skills? This cannot be undone.`)) return;
    setError(null);
    try {
      const res = await adminMutation(`/api/skill-categories/${id}`, { method: "DELETE" });
      if (!res.ok) { setError("Failed to delete category."); return; }
      await fetchCategories();
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      {error && (
        <div role="alert" style={{ margin: "16px 24px 0", padding: "12px", background: "rgba(239,68,68,0.1)", borderRadius: "8px", color: "#ef4444" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", borderBottom: "1px solid var(--glass-border)", padding: "24px", gap: "24px" }}>
        <div style={{ flex: "1 1 300px" }}>
          <h3 style={{ marginBottom: "16px", color: "var(--accent)" }}>Add Category</h3>
          <form onSubmit={handleCatSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label htmlFor="cat-name" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Category Name *</span>
              <input
                id="cat-name"
                type="text"
                value={catForm.name}
                onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                placeholder="e.g. Frontend, Backend"
                required
                style={{ ...inputStyle, flex: "unset" }}
              />
            </label>
            <label htmlFor="cat-order" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Display Order</span>
              <input
                id="cat-order"
                type="number"
                value={catForm.order}
                onChange={(e) => setCatForm({ ...catForm, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
                style={{ ...inputStyle, flex: "unset" }}
              />
            </label>
            <button type="submit" className="btn-secondary" disabled={loading} aria-busy={loading}>
              {loading ? "Creating..." : "Create Category"}
            </button>
          </form>
        </div>

        <div style={{ flex: "2 1 400px" }}>
          <h3 style={{ marginBottom: "16px", color: "var(--accent)" }}>Add Skill</h3>
          <form onSubmit={handleSkillSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <label htmlFor="skill-category" style={{ flex: "1 1 calc(50% - 6px)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Category *</span>
                <select
                  id="skill-category"
                  value={skillForm.categoryId}
                  onChange={(e) => setSkillForm({ ...skillForm, categoryId: e.target.value })}
                  required
                  style={{ ...inputStyle, flex: "unset" }}
                >
                  <option value="" disabled>Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label htmlFor="skill-name" style={{ flex: "1 1 calc(50% - 6px)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Skill Name *</span>
                <input
                  id="skill-name"
                  type="text"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. React, TypeScript"
                  required
                  style={{ ...inputStyle, flex: "unset" }}
                />
              </label>
            </div>
            <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
              {loading ? "Adding..." : "Add Skill to Category"}
            </button>
          </form>
        </div>
      </div>

      <div style={{ padding: "24px" }}>
        {categories.length === 0 && (
          <p style={{ color: "var(--text-muted)" }}>No categories yet. Create one above.</p>
        )}
        {categories.map((cat) => (
          <div key={cat.id} style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px", marginBottom: "16px" }}>
              <h4 style={{ fontSize: "1.2rem" }}>
                {cat.name}
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "8px" }}>(Order: {cat.order})</span>
              </h4>
              <button
                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                style={{ color: "#ef4444", fontSize: "0.82rem", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", background: "none" }}
                aria-label={`Delete category ${cat.name}`}
              >
                Delete Category
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {cat.skills.length === 0 && (
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No skills mapped.</span>
              )}
              {cat.skills.map((s) => (
                <div
                  key={s.id}
                  style={{ padding: "6px 16px", background: "var(--surface)", border: "1px solid var(--glass-border)", borderRadius: "30px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {s.name}
                  <button
                    onClick={() => handleDeleteSkill(s.id)}
                    style={{ color: "#ef4444", fontSize: "1.2rem", lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}
                    aria-label={`Remove skill ${s.name}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
