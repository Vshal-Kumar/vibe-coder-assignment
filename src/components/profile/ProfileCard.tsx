import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "../common/VerifiedBadge";
import { PlatformBadge } from "./PlatformBadge";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { useListStore } from "@/store/useListStore";
import { AddToListModal } from "../lists/AddToListModal";
import { Bookmark, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery?: string;
  onProfileClick?: (username: string) => void;
}

export function ProfileCard({
  profile,
  platform,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isProfileInAnyList } = useListStore();

  const isSaved = isProfileInAnyList(profile.user_id);

  const handleCardClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -3, scale: 1.005 }}
        transition={{ duration: 0.2 }}
        onClick={handleCardClick}
        className="glass-card rounded-2xl p-4.5 cursor-pointer border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full text-left group"
      >
        {/* Left Creator Info */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="relative flex-shrink-0">
            <img
              src={profile.picture}
              alt={profile.fullname}
              className="w-14 h-14 rounded-full object-cover border-2 border-white/10 group-hover:border-purple-500/50 transition-colors shadow-md"
              onError={(e) => {
                // Fallback avatar if image broken
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.fullname
                )}&background=8b5cf6&color=fff`;
              }}
            />
            <div className="absolute -bottom-1 -right-1">
              <PlatformBadge platform={platform} showLabel={false} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-base text-white truncate group-hover:text-purple-300 transition-colors">
                @{profile.username}
              </h3>
              <VerifiedBadge verified={profile.is_verified} />
            </div>
            <p className="text-sm text-slate-400 truncate mt-0.5">{profile.fullname}</p>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
              <div>
                <span className="font-semibold text-white">
                  {formatFollowers(profile.followers)}
                </span>{" "}
                <span className="text-slate-400">followers</span>
              </div>
              {profile.engagement_rate !== undefined && (
                <div>
                  • <span className="font-semibold text-emerald-400">
                    {formatEngagementRate(profile.engagement_rate)}
                  </span>{" "}
                  <span className="text-slate-400">eng. rate</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Button */}
        <div className="w-full sm:w-auto flex items-center justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
          <button
            onClick={handleOpenModal}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
              isSaved
                ? "bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/20"
            }`}
          >
            {isSaved ? (
              <>
                <Check size={14} className="text-purple-400" /> Saved to List
              </>
            ) : (
              <>
                <Bookmark size={14} /> Add to List
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Add To List Modal */}
      <AddToListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={profile}
        platform={platform}
      />
    </>
  );
}
