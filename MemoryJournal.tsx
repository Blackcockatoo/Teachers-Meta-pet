"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Calendar,
  Flame,
  Heart,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import type { Memory, MilestoneProgress } from "@/lib/milestones";
import { getMemoriesSorted, getMilestoneStats } from "@/lib/milestones";

interface MemoryJournalProps {
  progress: MilestoneProgress;
  companionName?: string;
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(timestamp);
}

function MemoryCard({ memory, index }: { memory: Memory; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <motion.button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-slate-600 transition-all"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-start gap-4">
          {/* Emoji */}
          <motion.div
            className="text-3xl flex-shrink-0"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
          >
            {memory.emoji}
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                {memory.title}
              </h4>
              <span className="text-xs text-zinc-500 flex-shrink-0 ml-2">
                {formatRelativeTime(memory.timestamp)}
              </span>
            </div>

            <AnimatePresence>
              {expanded ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-zinc-400 text-sm mb-2">
                    {memory.description}
                  </p>
                  <p className="text-zinc-600 text-xs">
                    {formatDate(memory.timestamp)}
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  className="text-zinc-500 text-sm truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {memory.description}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Expand indicator */}
          <motion.div
            className="text-zinc-600 flex-shrink-0"
            animate={{ rotate: expanded ? 90 : 0 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.button>
    </motion.div>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Flame;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className={`p-4 rounded-xl bg-${color}-500/10 border border-${color}-500/30`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 text-${color}-400`} />
        <span className="text-xs text-zinc-500 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className={`text-2xl font-bold text-${color}-300`}>{value}</p>
    </div>
  );
}

export function MemoryJournal({ progress, companionName }: MemoryJournalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const memories = getMemoriesSorted(progress);
  const stats = getMilestoneStats(progress);

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-400 transition-all group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Book className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
              Memory Journal
            </h3>
            <p className="text-xs text-zinc-500">
              {memories.length} {memories.length === 1 ? "memory" : "memories"}{" "}
              • {stats.completionPercentage}% milestones
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Notification badge for new memories */}
        {memories.length > 0 &&
          memories[0].timestamp > Date.now() - 3600000 && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-pink-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
      </motion.button>

      {/* Full Journal Modal */}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-slate-700/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                      <Book className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Memory Journal
                      </h2>
                      <p className="text-sm text-zinc-500">
                        {companionName
                          ? `${companionName}'s Journey`
                          : "Your Companion's Journey"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-zinc-500 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-zinc-500">Memories</span>
                    </div>
                    <p className="text-xl font-bold text-purple-300">
                      {stats.memoriesCount}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-zinc-500">Streak</span>
                    </div>
                    <p className="text-xl font-bold text-amber-300">
                      {stats.currentStreak} days
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-zinc-500">Together</span>
                    </div>
                    <p className="text-xl font-bold text-cyan-300">
                      {stats.daysSinceFirstMeeting} days
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span className="text-xs text-zinc-500">Milestones</span>
                    </div>
                    <p className="text-xl font-bold text-pink-300">
                      {stats.completionPercentage}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Memories List */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
                {memories.length === 0 ? (
                  <div className="text-center py-12">
                    <motion.div
                      className="text-6xl mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      📖
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Memories Yet
                    </h3>
                    <p className="text-zinc-500 text-sm">
                      Your journey is just beginning. Memories will appear as
                      you care for your companion.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {memories.map((memory, index) => (
                      <MemoryCard
                        key={memory.id}
                        memory={memory}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {memories.length > 0 && (
                <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
                  <p className="text-center text-xs text-zinc-600">
                    Every interaction creates a memory. Keep caring for your
                    companion.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MemoryJournal;
