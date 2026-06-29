import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { PlatformBadge } from "@/components/profile/PlatformBadge";
import { AddToListModal } from "@/components/lists/AddToListModal";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { formatEngagementRate, formatFollowers, formatNumber } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";
import { ArrowLeft, ExternalLink, Bookmark, Check, Users, TrendingUp, Heart, MessageSquare, Eye, PlaySquare } from "lucide-react";
import { motion } from "framer-motion";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") as Platform) || "instagram";

  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isProfileInAnyList } = useListStore();

  useEffect(() => {
    if (!username) return;
    let isMounted = true;
    loadProfileByUsername(username).then((data) => {
      if (isMounted) {
        setProfileData(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-12 glass-panel rounded-2xl max-w-md mx-auto">
          <p className="text-slate-300 mb-4">Invalid profile request</p>
          <Link to="/" className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold">
            Back to Discovery
          </Link>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading creator details...</p>
        </div>
      </Layout>
    );
  }

  if (!profileData || !profileData.data.success) {
    return (
      <Layout>
        <div className="text-center py-12 glass-panel rounded-2xl max-w-md mx-auto border border-red-500/30">
          <p className="text-red-400 font-semibold mb-2">Could not load profile</p>
          <p className="text-xs text-slate-400 mb-6">
            Detailed analytics for @{username} are unavailable.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-white/10"
          >
            <ArrowLeft size={16} /> Back to Search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const isSaved = isProfileInAnyList(user.user_id);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 text-left">
        {/* Back Navigation Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white hover:border-white/20 transition-all"
        >
          <ArrowLeft size={14} /> Back to creators
        </Link>

        {/* Profile Card Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={user.picture}
                alt={user.fullname}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-purple-500/30 shadow-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.fullname
                  )}&background=8b5cf6&color=fff`;
                }}
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-black text-white my-0">
                    @{user.username}
                  </h2>
                  <VerifiedBadge verified={user.is_verified} size={22} />
                </div>
                <p className="text-base text-slate-300 font-medium">{user.fullname}</p>
                <div className="pt-1">
                  <PlatformBadge platform={platform} />
                </div>
              </div>
            </div>

            {/* Save to list action button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xl ${
                isSaved
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/50 hover:bg-purple-600/30"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-600/25"
              }`}
            >
              {isSaved ? (
                <>
                  <Check size={18} className="text-purple-400" /> Saved to List
                </>
              ) : (
                <>
                  <Bookmark size={18} /> Add to List
                </>
              )}
            </button>
          </div>

          {/* Description */}
          {user.description && (
            <div className="p-4 rounded-2xl glass-card text-sm text-slate-300 leading-relaxed border-white/5">
              {user.description}
            </div>
          )}

          {/* Key Metrics Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Performance Analytics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Followers */}
              <div className="glass-card p-4 rounded-2xl border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Users size={14} className="text-purple-400" /> Followers
                </div>
                <div className="text-xl font-extrabold text-white">
                  {formatFollowers(user.followers)}
                </div>
              </div>

              {/* Engagement Rate */}
              <div className="glass-card p-4 rounded-2xl border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <TrendingUp size={14} className="text-emerald-400" /> Engagement Rate
                </div>
                <div className="text-xl font-extrabold text-emerald-400">
                  {formatEngagementRate(user.engagement_rate)}
                </div>
              </div>

              {/* Engagements Count */}
              {user.engagements !== undefined && (
                <div className="glass-card p-4 rounded-2xl border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Heart size={14} className="text-pink-400" /> Total Engagements
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    {formatNumber(user.engagements)}
                  </div>
                </div>
              )}

              {/* Posts Count */}
              {user.posts_count !== undefined && (
                <div className="glass-card p-4 rounded-2xl border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <PlaySquare size={14} className="text-blue-400" /> Total Posts
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    {formatNumber(user.posts_count)}
                  </div>
                </div>
              )}

              {/* Avg Likes */}
              {user.avg_likes !== undefined && (
                <div className="glass-card p-4 rounded-2xl border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Heart size={14} className="text-rose-400" /> Avg Likes
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    {formatNumber(user.avg_likes)}
                  </div>
                </div>
              )}

              {/* Avg Comments */}
              {user.avg_comments !== undefined && (
                <div className="glass-card p-4 rounded-2xl border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MessageSquare size={14} className="text-amber-400" /> Avg Comments
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    {formatNumber(user.avg_comments)}
                  </div>
                </div>
              )}

              {/* Avg Views */}
              {user.avg_views !== undefined && user.avg_views > 0 && (
                <div className="glass-card p-4 rounded-2xl border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Eye size={14} className="text-cyan-400" /> Avg Views
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    {formatNumber(user.avg_views)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Platform Link */}
          {user.url && (
            <div className="pt-2">
              <a
                href={user.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 hover:text-purple-200 text-xs font-semibold border border-purple-500/30 transition-colors"
              >
                View official profile on platform <ExternalLink size={14} />
              </a>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add To List Modal */}
      <AddToListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={user}
        platform={platform}
      />
    </Layout>
  );
}
