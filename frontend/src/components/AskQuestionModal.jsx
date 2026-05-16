import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../utils";
import { useToast } from "../context/ToastContext";
import Modal from "./Modal";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  tags: "",
};

export default function AskQuestionModal({ open, onClose, onSuccess }) {
  const { showToast } = useToast();
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setForm(emptyForm);
  }, [open]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (!payload.title || !payload.description || !payload.category) {
      showToast("Please fill all required fields", false);
      return;
    }
    setLoading(true);
    try {
      await api.createPost(payload);
      await refreshUser();
      showToast("Question posted!");
      setForm(emptyForm);
      onClose();
      onSuccess?.();
    } catch (err) {
      showToast(err.data?.message || "Failed to post", false);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose} wide>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-headline-md text-headline-md text-on-surface">Ask a Question</h2>
        <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <p className="mb-4 font-body-md text-body-md text-on-surface-variant">
        Posting as <span className="font-semibold text-on-surface">{user.studentName}</span>
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block font-label-md text-label-md text-on-surface-variant">Title *</label>
          <input type="text" value={form.title} onChange={set("title")} placeholder="What's your question?" className="w-full rounded-lg border border-outline-variant px-4 py-3 font-body-md text-body-md" />
        </div>
        <div>
          <label className="mb-1 block font-label-md text-label-md text-on-surface-variant">Description *</label>
          <textarea value={form.description} onChange={set("description")} rows={3} placeholder="Explain in detail..." className="w-full resize-none rounded-lg border border-outline-variant px-4 py-3 font-body-md text-body-md" />
        </div>
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="mb-1 block font-label-md text-label-md text-on-surface-variant">Category *</label>
    <select value={form.category} onChange={set("category")} className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-body-md text-body-md">
      <option value="">Select...</option>
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  </div>
  <div>
    <label className="mb-1 block font-label-md text-label-md text-on-surface-variant">Tags (comma-separated)</label>
    <input type="text" value={form.tags} onChange={set("tags")} placeholder="#react, #hooks" className="w-full rounded-lg border border-outline-variant px-4 py-3 font-body-md text-body-md" />
  </div>
</div>
        <button type="submit" disabled={loading} className="primary-gradient mt-2 rounded-lg py-3 font-label-md text-label-md text-white transition-all active:scale-95 disabled:opacity-60">
          {loading ? "Posting..." : "Post Question"}
        </button>
      </form>
    </Modal>
  );
}
