import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CustomList, Platform, SavedProfile, UserProfileSummary } from "@/types";

interface ListState {
  lists: CustomList[];
  activeListId: string;
  
  // Actions
  createList: (name: string, description?: string) => string;
  deleteList: (id: string) => void;
  renameList: (id: string, name: string) => void;
  setActiveListId: (id: string) => void;
  addProfileToList: (listId: string, profile: UserProfileSummary, platform: Platform) => boolean;
  removeProfileFromList: (listId: string, userId: string) => void;
  isProfileInList: (listId: string, userId: string) => boolean;
  isProfileInAnyList: (userId: string) => boolean;
  getProfileLists: (userId: string) => CustomList[];
}

const DEFAULT_LIST_ID = "default-favorites";

const initialLists: CustomList[] = [
  {
    id: DEFAULT_LIST_ID,
    name: "My Favorites",
    description: "Curated list of top influencer profiles",
    profiles: [],
    createdAt: new Date().toISOString(),
  },
];

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      lists: initialLists,
      activeListId: DEFAULT_LIST_ID,

      createList: (name: string, description?: string) => {
        const trimmed = name.trim();
        if (!trimmed) return "";
        const newList: CustomList = {
          id: `list-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: trimmed,
          description: description?.trim() || "",
          profiles: [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          lists: [...state.lists, newList],
          activeListId: newList.id,
        }));
        return newList.id;
      },

      deleteList: (id: string) => {
        set((state) => {
          const filtered = state.lists.filter((l) => l.id !== id);
          // Don't let lists become completely empty
          const remaining = filtered.length > 0 ? filtered : initialLists;
          const nextActive = state.activeListId === id ? remaining[0].id : state.activeListId;
          return {
            lists: remaining,
            activeListId: nextActive,
          };
        });
      },

      renameList: (id: string, name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((state) => ({
          lists: state.lists.map((l) => (l.id === id ? { ...l, name: trimmed } : l)),
        }));
      },

      setActiveListId: (id: string) => {
        set({ activeListId: id });
      },

      addProfileToList: (listId: string, profile: UserProfileSummary, platform: Platform) => {
        const { lists } = get();
        const targetList = lists.find((l) => l.id === listId);
        if (!targetList) return false;

        // Prevent duplicates in the same list
        const exists = targetList.profiles.some((p) => p.user_id === profile.user_id);
        if (exists) return false;

        const savedProfile: SavedProfile = {
          ...profile,
          platform,
          addedAt: new Date().toISOString(),
        };

        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === listId ? { ...l, profiles: [savedProfile, ...l.profiles] } : l
          ),
        }));
        return true;
      },

      removeProfileFromList: (listId: string, userId: string) => {
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === listId
              ? { ...l, profiles: l.profiles.filter((p) => p.user_id !== userId) }
              : l
          ),
        }));
      },

      isProfileInList: (listId: string, userId: string) => {
        const list = get().lists.find((l) => l.id === listId);
        if (!list) return false;
        return list.profiles.some((p) => p.user_id === userId);
      },

      isProfileInAnyList: (userId: string) => {
        return get().lists.some((l) => l.profiles.some((p) => p.user_id === userId));
      },

      getProfileLists: (userId: string) => {
        return get().lists.filter((l) => l.profiles.some((p) => p.user_id === userId));
      },
    }),
    {
      name: "influencer-lists-storage",
    }
  )
);
