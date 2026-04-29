import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Pencil, Trash2, Clock,
  User, AlertTriangle, Cpu
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Modal } from "../components/Modal";
import { ProjectForm } from "../components/ProjectForm";
import { StatusBadge, Spinner, ErrorBanner } from "../components/atoms";
import { projectService } from "../services/projectService";
import { apiError } from "../services/api";
import type { Project, ProjectCreate, ProjectStatus } from "../utils/types";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    projectService
      .get(Number(id))
      .then(setProject)
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data: ProjectCreate) => {
    if (!project) return;
    const updated = await projectService.update(project.id, data);
    setProject(updated);
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    if (!project) return;
    setDeleting(true);
    try {
      await projectService.remove(project.id);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(apiError(err));
      setDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-MY", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* Back */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors mb-8"
          style={{ animation: "fadeIn 0.3s ease-out forwards" }}
        >
          <ArrowLeft size={13} />
          Back to Registry
        </Link>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Spinner size={28} />
          </div>
        )}

        {error && !project && <ErrorBanner msg={error} />}

        {project && (
          <div style={{ animation: "fadeUp 0.4s ease-out forwards" }}>
            {/* Header card */}
            <div className="relative rounded border border-gamuda-700/60 bg-gamuda-800 overflow-hidden mb-4">
              <div className="h-px bg-gradient-to-r from-red-500/0 via-red-500/70 to-red-500/0" />

              {/* Grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,51,51,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,51,51,0.04) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />

              <div className="relative p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* ID badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-red-500/70 border border-red-500/30 px-2 py-0.5 rounded-sm bg-red-500/10">
                        PRJ-{project.id.toString().padStart(4, "0")}
                      </span>
                      <StatusBadge status={project.status as ProjectStatus} />
                    </div>

                    <h1 className="text-xl font-body font-semibold text-slate-100 leading-snug mb-4">
                      {project.title}
                    </h1>

                    {project.description ? (
                      <p className="text-sm text-slate-400 leading-relaxed font-body max-w-2xl">
                        {project.description}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-600 italic font-body">No description provided.</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsEditOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono
                                 text-slate-400 border border-gamuda-700/60 rounded
                                 hover:text-slate-200 hover:border-gamuda-600/60 hover:bg-white/5 transition-all"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => setIsDeleteOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono
                                 text-red-400/70 border border-red-900/40 rounded
                                 hover:text-red-300 hover:border-red-800/60 hover:bg-red-950/30 transition-all"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <MetaCard
                icon={<User size={14} className="text-red-500/60" />}
                label="Owner"
                value={project.owner}
              />
              <MetaCard
                icon={<Clock size={14} className="text-red-500/60" />}
                label="Created"
                value={fmt(project.created_at)}
                mono
              />
              <MetaCard
                icon={<Clock size={14} className="text-red-500/60" />}
                label="Last Updated"
                value={fmt(project.updated_at)}
                mono
              />
            </div>

            {/* AI-readiness callout */}
            <div className="rounded border border-gamuda-700/40 bg-gamuda-800/50 p-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded border border-gamuda-700/60 bg-gamuda-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Cpu size={13} className="text-red-500/60" />
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-red-500/60 mb-1">
                    AI-Ready Architecture
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed font-body">
                    This record includes a provisioned{" "}
                    <code className="font-mono text-red-400/70 bg-gamuda-700/30 px-1.5 py-0.5 rounded text-[11px]">
                      description_embedding
                    </code>{" "}
                    column in the schema. Activate it by installing{" "}
                    <code className="font-mono text-red-400/70 bg-gamuda-700/30 px-1.5 py-0.5 rounded text-[11px]">
                      pgvector
                    </code>{" "}
                    and migrating to PostgreSQL — enabling semantic search and RAG over all project descriptions.
                  </p>
                </div>
              </div>
            </div>

            {error && <div className="mt-4"><ErrorBanner msg={error} /></div>}
          </div>
        )}
      </main>

      {/* Edit modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Project">
        {project && (
          <ProjectForm
            initial={{ title: project.title, description: project.description ?? undefined, status: project.status as ProjectStatus, owner: project.owner }}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditOpen(false)}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Deletion">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 p-4 rounded border border-red-900/40 bg-red-950/20">
            <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-400 leading-relaxed font-body">
              You are about to permanently delete{" "}
              <span className="text-slate-200 font-medium">"{project?.title}"</span>.
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 text-sm font-body text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-mono
                         text-red-400 border border-red-800/60 rounded bg-red-950/30
                         hover:bg-red-950/60 hover:border-red-700/60 transition-all disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="animate-spin">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={13} />
                  Delete Project
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function MetaCard({
  icon, label, value, mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded border border-gamuda-700/50 bg-gamuda-800/60 p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-slate-600">
          {label}
        </span>
      </div>
      <p className={`text-sm text-slate-300 ${mono ? "font-mono text-xs" : "font-body"}`}>
        {value}
      </p>
    </div>
  );
}
