import { useState } from "react";
import { useListStore } from "@/store/useListStore";
import { X, Trash2, Edit2, Bookmark, ExternalLink, UserMinus, Plus, FolderPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PlatformBadge } from "../profile/PlatformBadge";
import { formatFollowers } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";

interface ListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ListDrawer({ isOpen, onClose }: ListDrawerProps) {
  const navigate = useNavigate();
  const { lists, activeListId, setActiveListId, deleteList, renameList, removeProfileFromList, createList } = useListStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");

  const activeList = lists.find((l) => l.id === activeListId) || lists[0];

  if (!isOpen) return null;

  const handleStartRename = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleSaveRename = (id: string) => {
    if (editName.trim()) {
      renameList(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      createList(newListName.trim());
      setNewListName("");
      setIsCreating(false);
    }
  };

  const handleNavigateProfile = (username: string, platform: string) => {
    onClose();
    navigate(`/profile/${username}?platform=${platform}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="pointer-events-auto w-screen max-w-md glass-panel border-l border-white/10 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Bookmark size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white text-left">Saved Lists</h2>
                  <p className="text-xs text-slate-400 text-left">Organize and track your favorite creators</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* List Selector Tabs */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Your Collections
                  </span>
                  {!isCreating && (
                    <button
                      onClick={() => setIsCreating(true)}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
                    >
                      <Plus size={14} /> New List
                    </button>
                  )}
                </div>

                {isCreating && (
                  <form onSubmit={handleCreateList} className="mb-3 p-3 rounded-xl bg-slate-800/80 border border-purple-500/40 space-y-2">
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="List name..."
                      autoFocus
                      className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newListName.trim()}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg disabled:opacity-50"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {lists.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setActiveListId(l.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                        activeListId === l.id
                          ? "bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/25"
                          : "bg-slate-800/60 text-slate-300 border-white/5 hover:bg-slate-800 hover:border-white/15"
                      }`}
                    >
                      {l.name} ({l.profiles.length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected List Details Header */}
              {activeList && (
                <div className="glass-card p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    {editingId === activeList.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2.5 py-1 rounded-lg glass-input text-sm font-semibold text-white flex-1"
                        />
                        <button
                          onClick={() => handleSaveRename(activeList.id)}
                          className="px-2.5 py-1 bg-purple-600 text-white text-xs rounded-lg font-medium"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <h3 className="text-base font-bold text-white text-left">{activeList.name}</h3>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartRename(activeList.id, activeList.name)}
                            title="Rename List"
                            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5"
                          >
                            <Edit2 size={15} />
                          </button>
                          {lists.length > 1 && (
                            <button
                              onClick={() => deleteList(activeList.id)}
                              title="Delete List"
                              className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 text-left">
                    {activeList.profiles.length} creator{activeList.profiles.length !== 1 ? "s" : ""} saved
                  </p>
                </div>
              )}

              {/* Creators List in Active Collection */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block text-left">
                  Saved Profiles
                </span>

                {!activeList || activeList.profiles.length === 0 ? (
                  <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-white/10 glass-card">
                    <FolderPlus size={36} className="mx-auto text-slate-500 mb-2" />
                    <p className="text-sm font-medium text-slate-300">No creators in this list yet</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Browse influencers and click "Add to List" to save them here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {activeList.profiles.map((p) => (
                      <div
                        key={p.user_id}
                        className="flex items-center justify-between p-3 rounded-xl glass-card hover:border-purple-500/30 group transition-all"
                      >
                        <div
                          onClick={() => handleNavigateProfile(p.username, p.platform)}
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                        >
                          <img
                            src={p.picture}
                            alt={p.fullname}
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                          <div className="min-w-0 text-left">
                            <div className="font-semibold text-sm text-white truncate flex items-center gap-1.5">
                              @{p.username}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <PlatformBadge platform={p.platform} showLabel={false} />
                              <span className="text-xs text-slate-400">
                                {formatFollowers(p.followers)} followers
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleNavigateProfile(p.username, p.platform)}
                            title="View Profile"
                            className="p-1.5 text-slate-400 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button
                            onClick={() => removeProfileFromList(activeList.id, p.user_id)}
                            title="Remove from list"
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            <UserMinus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 glass-panel text-center">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-white/10 transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
