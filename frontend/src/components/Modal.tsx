import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: "fadeIn 0.2s ease-out forwards" }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-lg bracket"
        style={{ animation: "fadeUp 0.25s ease-out forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grid on modal */}
        <div
          className="absolute inset-0 rounded pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,51,51,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,51,51,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative bg-gamuda-800 border border-gamuda-700/60 rounded overflow-hidden">
          {/* Red top accent line */}
          <div className="h-px bg-gradient-to-r from-red-500/0 via-red-500/80 to-red-500/0" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gamuda-700/40">
            <span className="font-mono text-xs tracking-[0.15em] uppercase text-red-500/90">
              {title}
            </span>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded hover:bg-white/5"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
