"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Download,
  Copy,
  Check,
  Twitter,
  X,
  Dna,
  Heart,
  Sparkles,
  Star,
  Flame,
  Calendar,
} from "lucide-react";
import type { MilestoneProgress } from "@/lib/milestones";
import { getMilestoneStats } from "@/lib/milestones";
import type { Vitals } from "@metapet/core/vitals";
import type { Genome } from "@metapet/core/genome/types";

interface CompanionCardProps {
  companionName?: string;
  genome?: Genome | null;
  vitals?: Vitals;
  evolutionStage?: string;
  milestones?: MilestoneProgress;
  traits?: {
    personality?: string;
    element?: string;
    rarity?: string;
  };
}

// Generate a unique gradient based on genome
function generateGradientFromGenome(genome?: Genome | null): string {
  if (!genome) {
    return "from-purple-600 via-cyan-500 to-pink-500";
  }

  // Use first values of each component to determine colors
  const red = (genome.red60[0] ?? 3) / 6;
  const blue = (genome.blue60[0] ?? 4) / 6;
  const black = (genome.black60[0] ?? 2) / 6;

  const hue1 = Math.floor(red * 360);
  const hue2 = Math.floor(blue * 360);
  const hue3 = Math.floor(black * 360);

  return `from-[hsl(${hue1},70%,50%)] via-[hsl(${hue2},70%,50%)] to-[hsl(${hue3},70%,50%)]`;
}

// Generate HeptaCode display (shortened for card)
function generateHeptaCodeDisplay(genome?: Genome | null): string {
  if (!genome) return "0000-0000-0000";
  const combined = [
    ...genome.red60.slice(0, 4),
    ...genome.blue60.slice(0, 4),
    ...genome.black60.slice(0, 4),
  ];
  return `${combined.slice(0, 4).join("")}-${combined.slice(4, 8).join("")}-${combined.slice(8, 12).join("")}`;
}

export function CompanionCard({
  companionName = "Unnamed Companion",
  genome,
  vitals,
  evolutionStage = "GENETICS",
  milestones,
  traits,
}: CompanionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const gradient = generateGradientFromGenome(genome);
  const heptaCode = generateHeptaCodeDisplay(genome);
  const stats = milestones ? getMilestoneStats(milestones) : null;

  const healthScore = vitals
    ? Math.round(
        (vitals.hunger + vitals.hygiene + vitals.mood + vitals.energy) / 4,
      )
    : 100;

  const shareData = {
    title: `${companionName} - Meta-Pet Companion`,
    text: `Meet ${companionName}, my ${evolutionStage} stage companion! ${stats?.daysSinceFirstMeeting || 0} days bonded, ${stats?.currentStreak || 0} day care streak.`,
    url: typeof window !== "undefined" ? window.location.href : "",
  };

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareData]);

  const handleTwitterShare = useCallback(() => {
    const tweetText = encodeURIComponent(shareData.text);
    const tweetUrl = encodeURIComponent(shareData.url);
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`,
      "_blank",
      "width=550,height=420",
    );
  }, [shareData]);

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareData.url]);

  return (
    <>
      {/* Share Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative p-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-400 transition-all group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <Share2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
              Share Companion
            </h3>
            <p className="text-xs text-zinc-500">Create a shareable card</p>
          </div>
        </div>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* The Card */}
              <div
                ref={cardRef}
                className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/50 shadow-2xl mb-4"
              >
                {/* Gradient header */}
                <div className={`h-24 bg-gradient-to-r ${gradient} relative`}>
                  <div className="absolute inset-0 bg-black/30" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />

                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Avatar placeholder */}
                <div className="relative -mt-12 px-6">
                  <motion.div
                    className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradient} border-4 border-slate-900 flex items-center justify-center shadow-lg`}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Dna className="w-10 h-10 text-white" />
                  </motion.div>
                </div>

                {/* Card content */}
                <div className="px-6 pb-6 pt-4">
                  {/* Name and stage */}
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-white">
                      {companionName}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
                        {evolutionStage}
                      </span>
                      {traits?.rarity && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium">
                          {traits.rarity}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* HeptaCode */}
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-4">
                    <p className="text-xs text-zinc-500 mb-1">HeptaCode</p>
                    <p className="font-mono text-lg text-cyan-400 tracking-wider">
                      {heptaCode}
                    </p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                      <Heart className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-emerald-300">
                        {healthScore}%
                      </p>
                      <p className="text-xs text-zinc-500">Health</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                      <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-amber-300">
                        {stats?.currentStreak || 0}
                      </p>
                      <p className="text-xs text-zinc-500">Streak</p>
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                      <Calendar className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-cyan-300">
                        {stats?.daysSinceFirstMeeting || 0}
                      </p>
                      <p className="text-xs text-zinc-500">Days</p>
                    </div>
                  </div>

                  {/* Traits */}
                  {traits && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {traits.personality && (
                        <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs">
                          <Sparkles className="w-3 h-3 inline mr-1" />
                          {traits.personality}
                        </span>
                      )}
                      {traits.element && (
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                          <Star className="w-3 h-3 inline mr-1" />
                          {traits.element}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Milestones progress */}
                  {stats && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                        <span>Milestones</span>
                        <span>{stats.completionPercentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${gradient}`}
                          style={{ width: `${stats.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Branding */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                    <span className="text-xs text-zinc-600">Meta-Pet</span>
                    <span className="text-xs text-zinc-600">metapet.app</span>
                  </div>
                </div>
              </div>

              {/* Share actions */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>

                <motion.button
                  onClick={handleTwitterShare}
                  className="p-3 rounded-xl bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Twitter className="w-5 h-5" />
                </motion.button>

                <motion.button
                  onClick={handleCopyLink}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CompanionCard;
