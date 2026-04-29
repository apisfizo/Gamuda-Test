import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, apiError } from "../hooks/useAuth";
import { Terminal } from "lucide-react";
import gamudaLogo from "../assets/logo-gamuda.png";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Radial glow behind card */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,51,51,0.3) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Decorative cross-hair targets */}
      {[{ top: "12%", left: "8%" }, { bottom: "10%", right: "7%" }].map((pos, i) => (
        <div key={i} className="absolute opacity-10" style={pos}>
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border border-red-500 rounded-full" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-red-500 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-red-500 -translate-x-1/2" />
          </div>
        </div>
      ))}

      <div
        className="relative w-full max-w-sm z-10"
        style={{ animation: "fadeUp 0.5s ease-out forwards" }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div>
            <img src={gamudaLogo} alt="Gamuda" className="w-25 h-20" />
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-red-500/60" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-red-500/60" />
          </div>
          <h1 className="font-mono text-xl tracking-[0.15em] uppercase text-slate-100">
            Gamuda<span className="text-red-500">.</span>PM
          </h1>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gamuda-500/50 mt-1">
            Engineering Project Registry
          </p>
        </div>

        {/* Card */}
        <div className="relative rounded border border-gamuda-700/60 bg-gamuda-800 overflow-hidden">
          {/* Top red line */}
          <div className="h-px bg-gradient-to-r from-red-500/0 via-red-500/80 to-red-500/0" />

          {/* Terminal-style header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gamuda-700/40 bg-gamuda-900/50">
            <Terminal size={11} className="text-red-500/60" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-gamuda-500/50">
              Authentication Required
            </span>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] tracking-[0.15em] uppercase text-red-500/70">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                autoFocus
                className="bg-gamuda-900/70 border border-gamuda-700/60 rounded px-3 py-2.5 text-sm
                           text-slate-100 placeholder:text-slate-700 font-mono
                           focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/15
                           transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] tracking-[0.15em] uppercase text-red-500/70">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                autoComplete="current-password"
                className="bg-gamuda-900/70 border border-gamuda-700/60 rounded px-3 py-2.5 text-sm
                           text-slate-100 placeholder:text-slate-700 font-mono
                           focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/15
                           transition-colors"
              />
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded border border-red-800/50 bg-red-950/40 text-red-300 text-xs font-mono">
                ERR: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full py-2.5 font-mono text-sm tracking-widest uppercase
                         bg-red-500/15 text-red-500 border border-red-500/40 rounded
                         hover:bg-red-500/25 hover:border-red-500/70
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all flex items-center justify-center gap-2
                         focus:outline-none focus:ring-2 focus:ring-red-500/30"
            >
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                "Authenticate →"
              )}
            </button>
          </form>
        </div>

        {/* Credentials hint */}
        <div className="mt-5 text-center">
          <p className="font-mono text-[10px] text-slate-600 tracking-wider">
            DEMO CREDENTIALS:{" "}
            <span className="text-slate-500">admin</span>
            {" / "}
            <span className="text-slate-500">gamuda2026</span>
          </p>
        </div>
      </div>
    </div>
  );
}
