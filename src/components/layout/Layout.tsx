import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { ToastContainer } from "../common/Toast";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full text-slate-100 selection:bg-purple-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pb-16">
        {(title || subtitle) && (
          <div className="mb-8 text-center sm:text-left max-w-4xl mx-auto space-y-2">
            {title && (
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight my-0 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </main>

      <footer className="w-full border-t border-white/10 py-8 text-center text-xs text-slate-400 glass-panel mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">InfluencerVibe Discovery Engine</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold border border-purple-500/30">v2.0 Production</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="hover:text-purple-400 transition-colors">Zustand Persist State</span>
            <span>•</span>
            <span className="hover:text-purple-400 transition-colors">Framer Motion Animated</span>
            <span>•</span>
            <span className="hover:text-purple-400 transition-colors">React 19 & Vite</span>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}
