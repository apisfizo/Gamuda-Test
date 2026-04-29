import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut } from "lucide-react";
import gamudaLogo from "../assets/logo-gamuda.png";

export function Navbar() {
  const { username, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-gamuda-700/60 bg-gamuda-900/95 backdrop-blur-md">
      {/* Top red rule */}
      <div className="h-px bg-gradient-to-r from-transparent via-red-500/80 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div>
            <img src={gamudaLogo} alt="Gamuda" className="w-20 h-6" />
          </div>
          <a/>
          <div className="leading-none">
            <div className="font-mono text-xs tracking-[0.2em] uppercase text-red-500/95">
              Gamuda
            </div>
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-gamuda-500/50 -mt-0.5">
              PM · Platform
            </div>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {/* System status indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-emerald-400/60">
              Online
            </span>
          </div>

          <div className="h-4 w-px bg-gamuda-700/60" />

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-500 hidden sm:block">
              {username}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-xs font-body"
              title="Sign out"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
