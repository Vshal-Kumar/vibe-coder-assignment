import { useState } from "react";
import { useListStore } from "@/store/useListStore";
import { useToastStore } from "@/store/useToastStore";
import type { Platform, UserProfileSummary } from "@/types";
import { X, Plus, Check, FolderPlus, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileSummary;
  platform: Platform;
}

export function AddToListModal({ isOpen, onClose, profile, platform }: AddToListModalProps) {
  const { lists, createList, addProfileToList, removeProfileFromList, isProfileInList } = useListStore();
  const { showToast } = useToastStore();

  const [newListName, setNewListName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleToggleList = (listId: string, listName: string) => {
    const inList = isProfileInList(listId, profile.user_id);
    if (inList) {
      removeProfileFromList(listId, profile.user_id);
      showToast(`Removed @${profile.username} from "${listName}"`, "info");
    } else {
      const added = addProfileToList(listId, profile, platform);
      if (added) {
        showToast(`Added @${profile.username} to "${listName}"`, "success");
      } else {
        showToast(`@${profile.username} is already in "${listName}"`, "error");
      }
    }
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const newListId = createList(newListName);
    if (newListId) {
      addProfileToList(newListId, profile, platform);
      showToast(`Created collection "${newListName.trim()}" & added creator!`, "success");
      setNewListName("");
      setIsCreating(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/15 text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30">
                <Bookmark size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">Add to Collection</h3>
                <p className="text-xs text-slate-400">Save @{profile.username} for campaigns</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* List options */}
          <div className="mt-5 max-h-64 overflow-y-auto space-y-2.5 pr-1">
            {lists.map((list) => {
              const inList = isProfileInList(list.id, profile.user_id);
              return (
                <button
                  key={list.id}
                  onClick={() => handleToggleList(list.id, list.name)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    inList
                      ? "bg-purple-600/25 border-purple-500/60 text-white shadow-md shadow-purple-950/40"
                      : "glass-card text-slate-300 hover:text-white hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm text-left">{list.name}</div>
                    <div className="text-xs text-slate-400 text-left mt-0.5">
                      {list.profiles.length} saved creator{list.profiles.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      inList
                        ? "bg-purple-500 border-purple-400 text-white shadow-md shadow-purple-500/50 scale-110"
                        : "border-slate-600 bg-slate-900/50 text-transparent hover:border-slate-400"
                    }`}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Create new list section */}
          <div className="mt-5 pt-4 border-t border-white/10">
            {!isCreating ? (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full py-3 px-4 rounded-2xl border border-dashed border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <FolderPlus size={18} />
                Create New Collection
              </button>
            ) : (
              <form onSubmit={handleCreateAndAdd} className="space-y-3">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Collection name (e.g. Q3 Launch, Top Tech)..."
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-sm focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newListName.trim()}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white disabled:opacity-50 flex items-center gap-1.5 shadow-md"
                  >
                    <Plus size={14} /> Create & Add
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Done Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold border border-white/10 transition-colors shadow-lg"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
