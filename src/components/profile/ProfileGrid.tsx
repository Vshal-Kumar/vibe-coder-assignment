import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import { SearchX } from "lucide-react";

interface ProfileGridProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export function ProfileGrid({
  profiles,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileGridProps) {
  if (profiles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-4 glass-panel rounded-2xl max-w-md mx-auto my-8 border border-white/10"
      >
        <SearchX size={48} className="mx-auto text-slate-500 mb-3" />
        <h3 className="text-lg font-bold text-white">No creators found</h3>
        <p className="text-sm text-slate-400 mt-1">
          No profiles matched "{searchQuery}" on {platform.toUpperCase()}. Try searching for a different creator or switching platforms.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <AnimatePresence mode="popLayout">
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.user_id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.04, 0.3) }}
          >
            <ProfileCard
              profile={profile}
              platform={platform}
              searchQuery={searchQuery}
              onProfileClick={onProfileClick}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
