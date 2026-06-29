import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Sparkles } from "lucide-react";
import { useListStore } from "@/store/useListStore";
import { ListDrawer } from "../lists/ListDrawer";

export function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { lists } = useListStore();

  const totalSavedProfiles = lists.reduce((acc, list) => acc + list.profiles.length, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 py-3 mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Sparkles size={20} />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-white tracking-tight leading-none my-0">
                Influencer<span className="text-gradient-purple font-black">Vibe</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400">
                Creator Discovery
              </span>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold border border-white/10 flex items-center gap-2 transition-all shadow-md group"
            >
              <div className="relative">
                <Bookmark size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                {totalSavedProfiles > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-pink-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                    {totalSavedProfiles > 99 ? "99+" : totalSavedProfiles}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Saved Lists</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Saved Lists Drawer */}
      <ListDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
