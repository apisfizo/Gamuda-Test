import { useState } from "react";
import { Field, Input, Textarea, Select, ErrorBanner } from "./atoms";
import type { ProjectCreate, ProjectStatus } from "../utils/types";
import { apiError } from "../services/api";

const STATUS_OPTIONS = [
  { value: "Planning", label: "Planning" },
  { value: "Active", label: "Active" },
  { value: "On Hold", label: "On Hold" },
  { value: "Completed", label: "Completed" },
];

interface Props {
  initial?: { title?: string; description?: string; status?: ProjectStatus; owner?: string };
  onSubmit: (data: ProjectCreate) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function ProjectForm({ initial, onSubmit, onCancel, submitLabel = "Create" }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? "Planning");
  const [owner, setOwner] = useState(initial?.owner ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !owner.trim()) {
      setError("Title and Owner are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() || undefined, status, owner: owner.trim() });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Project Title">
        <Input
          placeholder="e.g. KVMRT Line 3 — Civils Package"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </Field>

      <Field label="Description">
        <Textarea
          placeholder="Scope, objectives, key deliverables..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Status">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            options={STATUS_OPTIONS}
          />
        </Field>
        <Field label="Owner">
          <Input
            placeholder="e.g. Ahmad Razif"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </Field>
      </div>

      {error && <ErrorBanner msg={error} />}

      <div className="flex justify-end gap-3 pt-2 border-t border-gamuda-700/40 mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-body text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 text-sm font-mono bg-red-500/15 text-red-500 border border-red-500/40 rounded
                     hover:bg-red-500/25 hover:border-red-500/70 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
