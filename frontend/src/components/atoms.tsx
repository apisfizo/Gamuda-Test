import type { ProjectStatus } from "../utils/types";

const STATUS_CONFIG: Record<ProjectStatus, { bg: string; text: string; dot: string }> = {
  Planning:  { bg: "bg-blue-950/80",   text: "text-blue-300",   dot: "bg-blue-400" },
  Active:    { bg: "bg-emerald-950/80", text: "text-emerald-300", dot: "bg-emerald-400" },
  "On Hold": { bg: "bg-yellow-950/80",  text: "text-yellow-300",  dot: "bg-yellow-400" },
  Completed: { bg: "bg-slate-800/80",   text: "text-slate-400",   dot: "bg-slate-500" },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { bg, text, dot } = STATUS_CONFIG[status] ?? STATUS_CONFIG["Planning"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-mono font-medium border border-white/5 ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin text-red-500">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.15" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="px-4 py-3 rounded border border-red-800/60 bg-red-950/40 text-red-300 text-sm font-body">
      {msg}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-mono tracking-[0.15em] uppercase text-red-500/70">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputBase =
  "bg-gamuda-800 border border-gamuda-700/80 rounded text-sm text-slate-100 placeholder:text-slate-500 " +
  "px-3 py-2.5 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-colors font-body";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} className={`${inputBase} resize-none ${props.className ?? ""}`} />;
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }
) {
  const { options, ...rest } = props;
  return (
    <select {...rest} className={`${inputBase} cursor-pointer ${rest.className ?? ""}`}>
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-gamuda-900">{o.label}</option>
      ))}
    </select>
  );
}
