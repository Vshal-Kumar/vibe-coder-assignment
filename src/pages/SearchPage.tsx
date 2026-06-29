import { useState, useMemo } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/layout/Layout";
import { PlatformFilter } from "@/components/profile/PlatformFilter";
import { ProfileGrid } from "@/components/profile/ProfileGrid";
import { extractProfiles, filterProfiles, getPlatformLabel } from "@/utils/dataHelpers";
import { ArrowUpDown, Sparkles, TrendingUp, Users } from "lucide-react";

type SortOption = "default" | "followers" | "engagement" | "name";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  // Performance optimization: Memoize profile loading and filtering to avoid re-calculating on un-related state changes
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  
  const filteredProfiles = useMemo(() => {
    const list = filterProfiles(allProfiles, searchQuery);
    if (sortBy === "followers") {
      return [...list].sort((a, b) => b.followers - a.followers);
    }
    if (sortBy === "engagement") {
      return [...list].sort((a, b) => (b.engagement_rate || 0) - (a.engagement_rate || 0));
    }
    if (sortBy === "name") {
      return [...list].sort((a, b) => a.username.localeCompare(b.username));
    }
    return list;
  }, [allProfiles, searchQuery, sortBy]);

  // Quick platform overview metrics
  const stats = useMemo(() => {
    if (allProfiles.length === 0) return { avgFollowers: 0, avgEngagement: 0 };
    const totalFollowers = allProfiles.reduce((acc, p) => acc + p.followers, 0);
    const totalEng = allProfiles.reduce((acc, p) => acc + (p.engagement_rate || 0), 0);
    return {
      avgFollowers: Math.round(totalFollowers / allProfiles.length),
      avgEngagement: (totalEng / allProfiles.length) <= 1 ? (totalEng / allProfiles.length) * 100 : totalEng / allProfiles.length,
    };
  }, [allProfiles]);

  const handleProfileClick = (username: string) => {
    console.log("Clicked profile:", username, "platform:", platform);
  };

  return (
    <Layout
      title="Discover Creators"
      subtitle="Find, analyze, and curate verified influencers across social platforms into custom campaign lists."
    >
      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-4xl mx-auto mb-6">
        <div className="glass-card p-4 rounded-2xl border-white/5 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles size={20} />
          </div>
          <div className="text-left">
            <div className="text-xs text-slate-400">Indexed Profiles</div>
            <div className="text-lg font-bold text-white">{allProfiles.length} Creators</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border-white/5 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Users size={20} />
          </div>
          <div className="text-left">
            <div className="text-xs text-slate-400">Avg Audience Size</div>
            <div className="text-lg font-bold text-white">
              {(stats.avgFollowers / 1_000_000).toFixed(1)}M
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border-white/5 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <TrendingUp size={20} />
          </div>
          <div className="text-left">
            <div className="text-xs text-slate-400">Avg Engagement</div>
            <div className="text-lg font-bold text-emerald-400">
              {stats.avgEngagement.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <PlatformFilter
        selected={platform}
        onChange={(p) => {
          setPlatform(p);
          setSearchQuery("");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Counter & Sort Bar */}
      <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 text-xs text-slate-400 px-1">
        <div>
          Showing <span className="font-bold text-white">{filteredProfiles.length}</span> of{" "}
          <span className="font-bold text-white">{allProfiles.length}</span> creators on{" "}
          <span className="font-semibold text-purple-300">{getPlatformLabel(platform)}</span>
        </div>

        {/* Sorting options */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-slate-400" />
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="glass-input px-2.5 py-1 rounded-xl text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            <option value="default" className="bg-slate-900 text-white">Default Ranking</option>
            <option value="followers" className="bg-slate-900 text-white">Most Followers</option>
            <option value="engagement" className="bg-slate-900 text-white">Highest Engagement</option>
            <option value="name" className="bg-slate-900 text-white">Username (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Profiles */}
      <ProfileGrid
        profiles={filteredProfiles}
        platform={platform}
        searchQuery={searchQuery}
        onProfileClick={handleProfileClick}
      />
    </Layout>
  );
}
