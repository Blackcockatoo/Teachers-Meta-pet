"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { useAudio } from "@/hooks/useAudio";
import { usePWA } from "@/hooks/usePWA";
import { SplashScreen } from "./SplashScreen";
import OnboardingFlow from "./OnboardingFlow";
import { ToastContainer, toast } from "./Toast";
import { SettingsButton } from "./SettingsPanel";
import { HUD } from "./HUD";
import { MemoryJournal } from "./MemoryJournal";
import { CompanionCard } from "./CompanionCard";
import {
  createDefaultMilestoneProgress,
  recordFirstMeeting,
  recordInteraction,
  checkTimeMilestones,
  type MilestoneProgress,
} from "@/lib/milestones";
import {
  Dna,
  Menu,
  Home,
  Gamepad2,
  Trophy,
  Map,
  Wifi,
  WifiOff,
  Download,
  RefreshCw,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [milestones, setMilestones] = useState<MilestoneProgress>(
    createDefaultMilestoneProgress(),
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const hasCompletedOnboarding = useStore((s) => s.hasCompletedOnboarding);
  const vitals = useStore((s) => s.vitals);
  const genome = useStore((s) => s.genome);
  const evolution = useStore((s) => s.evolution);
  const achievements = useStore((s) => s.achievements);
  const lastAction = useStore((s) => s.lastAction);
  const startTick = useStore((s) => s.startTick);

  const { ambient } = useAudio();
  const {
    isOnline,
    isInstallable,
    isUpdateAvailable,
    promptInstall,
    applyUpdate,
  } = usePWA();

  // Handle splash screen completion
  const handleSplashComplete = useCallback(() => {
    setIsLoading(false);
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    } else {
      startTick();
      void ambient.start("peaceful");
    }
  }, [hasCompletedOnboarding, startTick, ambient]);

  // Handle onboarding completion
  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
    startTick();
    void ambient.start("peaceful");

    // Record first meeting milestone
    setMilestones((prev) => recordFirstMeeting(prev));
    toast.milestone(
      "Bond Established",
      "Your journey with your companion begins!",
    );
  }, [startTick, ambient]);

  // Track interactions for milestones
  useEffect(() => {
    if (lastAction) {
      setMilestones((prev) => {
        const updated = recordInteraction(prev, lastAction, vitals);
        // Check if any new memories were added
        if (updated.memories.length > prev.memories.length) {
          const newMemory = updated.memories[updated.memories.length - 1];
          toast.milestone(newMemory.title, newMemory.description);
        }
        return updated;
      });
    }
  }, [lastAction, vitals]);

  // Check time-based milestones periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMilestones((prev) => {
        const updated = checkTimeMilestones(prev);
        if (updated.memories.length > prev.memories.length) {
          const newMemory = updated.memories[updated.memories.length - 1];
          toast.milestone(newMemory.title, newMemory.description);
        }
        return updated;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Track achievements
  useEffect(() => {
    if (achievements.length > 0) {
      const latest = achievements[achievements.length - 1];
      if (latest.earnedAt && Date.now() - latest.earnedAt < 5000) {
        toast.achievement(`Achievement: ${latest.title}`, latest.description);
      }
    }
  }, [achievements.length]);

  // Show offline/online notifications
  useEffect(() => {
    if (!isLoading) {
      if (!isOnline) {
        toast.info(
          "You're Offline",
          "Your progress is saved locally and will sync when back online.",
        );
      }
    }
  }, [isOnline, isLoading]);

  // Show install prompt
  useEffect(() => {
    if (isInstallable && !isLoading && hasCompletedOnboarding) {
      setTimeout(() => {
        toast.show({
          type: "info",
          title: "Install Meta-Pet",
          message: "Add to home screen for the best experience!",
          duration: 8000,
        });
      }, 30000); // Show after 30 seconds
    }
  }, [isInstallable, isLoading, hasCompletedOnboarding]);

  return (
    <>
      {/* Toast notifications */}
      <ToastContainer />

      {/* Splash screen */}
      <AnimatePresence>
        {isLoading && (
          <SplashScreen
            onComplete={handleSplashComplete}
            minimumDuration={2500}
          />
        )}
      </AnimatePresence>

      {/* Onboarding */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>

      {/* Main app */}
      {!isLoading && !showOnboarding && (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900">
          {/* Status bar */}
          <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <motion.div
                  className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Dna className="w-4 h-4 text-white" />
                </motion.div>
                <span className="font-bold text-white text-sm">Meta-Pet</span>
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-2">
                {/* Online/Offline indicator */}
                <div
                  className={`p-1.5 rounded-full ${isOnline ? "bg-emerald-500/20" : "bg-rose-500/20"}`}
                >
                  {isOnline ? (
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </div>

                {/* Update available */}
                {isUpdateAvailable && (
                  <motion.button
                    onClick={applyUpdate}
                    className="p-1.5 rounded-full bg-amber-500/20 text-amber-400"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </motion.button>
                )}

                {/* Install button */}
                {isInstallable && (
                  <motion.button
                    onClick={promptInstall}
                    className="p-1.5 rounded-full bg-cyan-500/20 text-cyan-400"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </motion.button>
                )}

                {/* Settings */}
                <SettingsButton />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="pt-16 pb-24 px-4 max-w-2xl mx-auto">
            {/* Quick actions row */}
            <div className="grid grid-cols-2 gap-3 mb-6 mt-4">
              <MemoryJournal progress={milestones} />
              <CompanionCard
                genome={genome}
                vitals={vitals}
                evolutionStage={evolution.state}
                milestones={milestones}
              />
            </div>

            {/* Main HUD */}
            <div className="mb-6">
              <HUD />
            </div>

            {/* Children (page content) */}
            {children}
          </main>

          {/* Bottom navigation */}
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/50">
            <div className="max-w-2xl mx-auto px-4 py-2">
              <div className="flex items-center justify-around">
                {[
                  { icon: Home, label: "Home", active: true },
                  { icon: Gamepad2, label: "Games", active: false },
                  { icon: Map, label: "Explore", active: false },
                  { icon: Trophy, label: "Achievements", active: false },
                ].map((item) => (
                  <button
                    key={item.label}
                    className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                      item.active
                        ? "text-cyan-400 bg-cyan-500/10"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export default AppShell;
