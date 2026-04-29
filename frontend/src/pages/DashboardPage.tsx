import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, Search, RefreshCw, 
  FolderOpen, User, Calendar, X 
} from "lucide-react";

// Component imports (Assuming paths remain same)
import { Navbar } from "../components/Navbar";
import { Modal } from "../components/Modal";
import { ProjectForm } from "../components/ProjectForm";
import { StatusBadge, Spinner, ErrorBanner } from "../components/atoms";
import { projectService } from "../services/projectService";
import { apiError } from "../services/api";
import type { Project, ProjectCreate, ProjectStatus } from "../utils/types";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "Planning", label: "Planning" },
  { value: "Active", label: "Active" },
  { value: "On Hold", label: "On Hold" },
  { value: "Completed", label: "Completed" },
];

export function DashboardPage() {
  // State Management
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Refs for Cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Logic: Centralized Fetcher with Race-Condition Prevention
   */
  const fetchProjects = useCallback(async (query: string, status: string) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const data = await projectService.list({
        search: query || undefined,
        status: status || undefined,
      });
      setProjects(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(apiError(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logic: Debounced effect for Search and Status
   */
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      fetchProjects(search, statusFilter);
    }, 350);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [search, statusFilter, fetchProjects]);

  const handleCreate = async (data: ProjectCreate) => {
    try {
      await projectService.create(data);
      setIsCreateOpen(false);
      fetchProjects(search, statusFilter);
    } catch (err) {
      setError("Failed to create project");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gamuda-900">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Header Section */}
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <header className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(255,51,51,0.5)]" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-red-500/80">
                System Registry
              </span>
            </header>
            <h1 className="text-2xl font-semibold text-slate-50 tracking-tight">Engineering Assets</h1>
            <p className="text-sm text-slate-500 font-medium">
              {loading ? "Syncing..." : `${projects.length} indexed records`}
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 text-white 
                       text-xs font-bold uppercase tracking-widest rounded hover:bg-red-600 
                       active:scale-95 transition-all shadow-lg shadow-red-500/20"
          >
            <Plus size={16} strokeWidth={3} />
            Initialize Project
          </button>
        </section>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-1">
          <div className="relative flex-1 min-w-[280px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Query by title or owner..."
              className="w-full bg-gamuda-800/60 border border-gamuda-700/40 rounded-lg pl-10 pr-10 py-2.5
                         text-sm text-slate-100 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 
                         outline-none transition-all"
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-500"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex bg-gamuda-800/40 p-1 rounded-lg border border-gamuda-700/30">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-tighter transition-all ${
                  statusFilter === f.value
                    ? "bg-red-500/15 text-red-400 border border-red-500/30 shadow-inner"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchProjects(search, statusFilter)}
            className={`p-2.5 rounded-lg border border-gamuda-700/40 text-slate-400 hover:text-red-500 
                       hover:bg-red-500/10 transition-all ${loading ? 'animate-spin text-red-500' : ''}`}
            disabled={loading}
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {error && <ErrorBanner msg={error} />}

        {/* Results Grid */}
        {loading && projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
            <Spinner size={32} />
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">Retrieving Data</p>
          </div>
        ) : projects.length === 0 ? (
          <EmptyState onReset={() => { setSearch(""); setStatusFilter(""); }} isFiltered={!!(search || statusFilter)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} formatDate={formatDate} />
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="System Initializer: New Project">
        <ProjectForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} submitLabel="Finalize Registration" />
      </Modal>
    </div>
  );
}

/**
 * Sub-Component: Better Modularity for Card
 */
function ProjectCard({ project, index, formatDate }: { project: Project; index: number; formatDate: any }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group relative flex flex-col bg-gamuda-800/50 border border-gamuda-700/40 rounded-xl p-5
                 hover:border-red-500/50 hover:bg-gamuda-800/90 transition-all duration-300 
                 animate-slide-up hover:shadow-2xl hover:shadow-red-500/10"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={project.status as ProjectStatus} />
        <span className="font-mono text-[9px] text-slate-600 group-hover:text-red-500/50">ID::{project.id}</span>
      </div>
      
      <h3 className="text-slate-100 font-semibold text-base mb-2 group-hover:text-red-400 transition-colors line-clamp-1">
        {project.title}
      </h3>
      
      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-6">
        {project.description || "No technical specifications provided for this entry."}
      </p>

      <div className="mt-auto pt-4 border-t border-gamuda-700/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-6 h-6 rounded-full bg-red-500/15 flex items-center justify-center">
            <User size={10} className="text-red-400" />
          </div>
          <span className="text-[11px] font-medium">{project.owner}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Calendar size={10} />
          <span className="font-mono text-[9px]">{formatDate(project.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ onReset, isFiltered }: { onReset: () => void, isFiltered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gamuda-700/20 rounded-2xl">
      <FolderOpen size={40} className="text-slate-700 mb-4" />
      <h3 className="text-slate-300 font-medium">No Matching Records</h3>
      <p className="text-slate-600 text-xs mt-1 max-w-[200px]">
        {isFiltered ? "The current filters returned zero results." : "The database is currently empty."}
      </p>
      {isFiltered && (
        <button onClick={onReset} className="mt-6 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:underline">
          Clear All Parameters
        </button>
      )}
    </div>
  );
}

// Helper
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" });