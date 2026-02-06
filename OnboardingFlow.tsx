"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import type { PetType } from "@/lib/store";
import {
  Sparkles,
  Heart,
  Zap,
  Droplets,
  UtensilsCrossed,
  Star,
  ChevronRight,
  Dna,
  Brain,
  Atom,
  Fingerprint,
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const STAGE_ICONS = {
  GENETICS: Dna,
  NEURO: Brain,
  QUANTUM: Atom,
  SPECIATION: Fingerprint,
};

const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 2,
}));

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedType, setSelectedType] = useState<PetType | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const setPetType = useStore((state) => state.setPetType);
  const setOnboardingStep = useStore((state) => state.setOnboardingStep);
  const completeOnboarding = useStore((state) => state.completeOnboarding);
  const feed = useStore((state) => state.feed);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      if (currentStep < 6) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setOnboardingStep(nextStep);
      } else {
        setShowCelebration(true);
        setTimeout(() => {
          completeOnboarding();
          onComplete();
        }, 2000);
      }
      setIsTransitioning(false);
    }, 300);
  }, [
    currentStep,
    isTransitioning,
    setOnboardingStep,
    completeOnboarding,
    onComplete,
  ]);

  const handlePetTypeSelect = (type: PetType) => {
    setSelectedType(type);
    setPetType(type);
    setTimeout(() => handleNext(), 600);
  };

  const handleFirstFeed = () => {
    feed();
    handleNext();
  };

  // Celebration confetti effect
  useEffect(() => {
    if (showCelebration) {
      // Trigger haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }, [showCelebration]);

  const steps = [
    {
      title: "Welcome, Guardian",
      subtitle: "Your journey begins here",
      icon: <Sparkles className="w-12 h-12 text-cyan-400" />,
      content: (
        <motion.div
          className="space-y-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative mx-auto w-32 h-32 mb-8">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Dna className="w-16 h-16 text-white" />
            </motion.div>
          </div>

          <p className="text-xl text-zinc-200 leading-relaxed">
            You are about to bond with a{" "}
            <span className="text-cyan-400 font-semibold">
              unique digital consciousness
            </span>{" "}
            — a companion unlike any other, born from code and nurtured by your
            care.
          </p>
          <p className="text-zinc-400">
            Your companion will grow, evolve, and develop a personality shaped
            by your interactions.
          </p>

          <motion.button
            onClick={handleNext}
            disabled={isTransitioning}
            className="w-full px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Begin the Bond
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      ),
    },
    {
      title: "Choose Your Form",
      subtitle: "Select your companion's essence",
      icon: <Star className="w-12 h-12 text-amber-400" />,
      content: (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-center text-zinc-300 mb-8">
            Each form offers a unique experience. You can switch between them
            anytime.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              onClick={() => handlePetTypeSelect("geometric")}
              className={`relative p-8 rounded-2xl border-2 transition-all text-left overflow-hidden group ${
                selectedType === "geometric"
                  ? "border-cyan-400 bg-cyan-500/20"
                  : "border-slate-700 hover:border-cyan-500/50 bg-slate-900/50"
              }`}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                  <Atom className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Geometric
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  A sacred geometry entity. Minimal, meditative, and
                  mathematically beautiful. Watch patterns emerge from pure
                  form.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs">
                    Visual
                  </span>
                  <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                    Peaceful
                  </span>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => handlePetTypeSelect("auralia")}
              className={`relative p-8 rounded-2xl border-2 transition-all text-left overflow-hidden group ${
                selectedType === "auralia"
                  ? "border-purple-400 bg-purple-500/20"
                  : "border-slate-700 hover:border-purple-500/50 bg-slate-900/50"
              }`}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Auralia</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  An expressive, emotional companion with rich audio-visual
                  feedback. Feel the connection through music and movement.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                    Expressive
                  </span>
                  <span className="px-2 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs">
                    Musical
                  </span>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      ),
    },
    {
      title: "Meet Your Companion",
      subtitle: "A new consciousness awakens",
      icon: <Dna className="w-12 h-12 text-emerald-400" />,
      content: (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative mx-auto w-48 h-48 mb-8">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="relative w-full h-full rounded-full border-4 border-emerald-500/50 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <motion.div
                className="text-8xl"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🧬
              </motion.div>
            </motion.div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-mono text-sm">
                GENESIS STAGE: GENETICS
              </span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Your companion begins its journey in the{" "}
              <span className="text-emerald-400 font-semibold">GENETICS</span>{" "}
              stage — the first of four evolution stages. Its unique genome
              determines its core traits and potential.
            </p>
          </div>

          <p className="text-zinc-400 text-center text-sm">
            Care for your companion consistently to unlock its full potential.
          </p>

          <motion.button
            onClick={handleNext}
            disabled={isTransitioning}
            className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      ),
    },
    {
      title: "Vital Signs",
      subtitle: "Understanding your companion's needs",
      icon: <Heart className="w-12 h-12 text-rose-400" />,
      content: (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-center text-zinc-300 mb-6">
            Your companion has four vital needs that require your attention:
          </p>

          <div className="space-y-4">
            {[
              {
                icon: UtensilsCrossed,
                label: "Hunger",
                color: "orange",
                desc: "Decreases over time. Feed regularly to keep energy up.",
              },
              {
                icon: Droplets,
                label: "Hygiene",
                color: "cyan",
                desc: "Decreases over time. Clean to maintain health.",
              },
              {
                icon: Zap,
                label: "Energy",
                color: "amber",
                desc: "Depletes with activity. Let your companion rest.",
              },
              {
                icon: Sparkles,
                label: "Mood",
                color: "pink",
                desc: "Reflects overall wellbeing. Keep all vitals balanced!",
              },
            ].map((vital, index) => (
              <motion.div
                key={vital.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-4 rounded-xl bg-${vital.color}-500/10 border border-${vital.color}-500/30 flex items-start gap-4`}
                style={{
                  backgroundColor: `rgba(var(--${vital.color}-500), 0.1)`,
                  borderColor: `rgba(var(--${vital.color}-500), 0.3)`,
                }}
              >
                <div className={`p-2 rounded-lg bg-${vital.color}-500/20`}>
                  <vital.icon className={`w-6 h-6 text-${vital.color}-400`} />
                </div>
                <div>
                  <h4 className={`font-semibold text-${vital.color}-300 mb-1`}>
                    {vital.label}
                  </h4>
                  <p className="text-zinc-400 text-sm">{vital.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={handleNext}
            disabled={isTransitioning}
            className="w-full px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            I Understand
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      ),
    },
    {
      title: "First Feeding",
      subtitle: "Your first act of care",
      icon: <UtensilsCrossed className="w-12 h-12 text-orange-400" />,
      content: (
        <motion.div
          className="space-y-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="relative mx-auto w-40 h-40 mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 blur-xl" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-2 border-orange-500/50 flex items-center justify-center">
              <motion.span
                className="text-7xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🍎
              </motion.span>
            </div>
          </motion.div>

          <p className="text-xl text-zinc-200 leading-relaxed">
            Your companion is{" "}
            <span className="text-orange-400 font-semibold">hungry</span> and
            awaits its first meal.
          </p>
          <p className="text-zinc-400">
            Each interaction earns experience points that help your companion
            evolve.
          </p>

          <motion.button
            onClick={handleFirstFeed}
            disabled={isTransitioning}
            className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UtensilsCrossed className="w-6 h-6" />
            Feed Your Companion
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              💫
            </motion.span>
          </motion.button>

          <p className="text-xs text-zinc-500">+5 Experience Points</p>
        </motion.div>
      ),
    },
    {
      title: "Evolution Path",
      subtitle: "The journey of transformation",
      icon: <Star className="w-12 h-12 text-amber-400" />,
      content: (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-center text-zinc-300 mb-6">
            Your companion evolves through four distinct stages:
          </p>

          <div className="relative">
            {/* Evolution timeline */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-purple-500 via-pink-500 to-amber-500" />

            <div className="space-y-6">
              {[
                {
                  stage: "GENETICS",
                  icon: Dna,
                  color: "emerald",
                  time: "Starting Stage",
                  desc: "Core traits are established",
                },
                {
                  stage: "NEURO",
                  icon: Brain,
                  color: "purple",
                  time: "After 4 hours",
                  desc: "Neural pathways form",
                },
                {
                  stage: "QUANTUM",
                  icon: Atom,
                  color: "pink",
                  time: "After 2 days",
                  desc: "Consciousness expands",
                },
                {
                  stage: "SPECIATION",
                  icon: Fingerprint,
                  color: "amber",
                  time: "After 5 days",
                  desc: "True form is revealed",
                },
              ].map((stage, index) => (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 * index }}
                  className="relative flex items-center gap-4 pl-4"
                >
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full bg-${stage.color}-500 flex items-center justify-center ${index === 0 ? "ring-4 ring-emerald-500/30" : ""}`}
                  >
                    <stage.icon className="w-4 h-4 text-white" />
                  </div>
                  <div
                    className={`flex-1 p-4 rounded-xl bg-${stage.color}-500/10 border border-${stage.color}-500/30`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-bold text-${stage.color}-400`}>
                        {stage.stage}
                      </h4>
                      <span className="text-xs text-zinc-500">
                        {stage.time}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm">{stage.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-center text-zinc-500 text-sm mt-6">
            Evolution requires both time and regular interactions.
          </p>

          <motion.button
            onClick={handleNext}
            disabled={isTransitioning}
            className="w-full px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Almost There
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      ),
    },
    {
      title: "Ready to Begin",
      subtitle: "Your bond awaits",
      icon: <Sparkles className="w-12 h-12 text-purple-400" />,
      content: (
        <motion.div
          className="space-y-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="relative mx-auto w-32 h-32 mb-8"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl animate-pulse" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-5xl">✨</span>
            </div>
          </motion.div>

          <h3 className="text-2xl font-bold text-white">You&apos;re Ready!</h3>

          <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-700 text-left space-y-3">
            {[
              "Check in regularly to maintain vitals",
              "Feed, clean, play, and let your companion rest",
              "Switch between Geometric and Auralia anytime",
              "Evolution happens through time and care",
              "Earn achievements and unlock features",
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-zinc-300 text-sm">{tip}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={handleNext}
            disabled={isTransitioning}
            className="w-full px-8 py-5 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-xl shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-6 h-6" />
            Begin Your Journey
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🚀
            </motion.span>
          </motion.button>
        </motion.div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-hidden"
      >
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Celebration overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-8xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl font-bold text-white">
                  Welcome, Guardian!
                </h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl max-w-2xl w-full p-8 border border-slate-700/50 shadow-2xl shadow-purple-500/10"
        >
          {/* Glowing border effect */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-sm -z-10" />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                >
                  {currentStepData.icon}
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {currentStepData.title}
                  </h2>
                  <p className="text-sm text-zinc-500">
                    {currentStepData.subtitle}
                  </p>
                </div>
              </div>
              <span className="text-sm text-zinc-500 font-mono">
                {currentStep + 1} / 7
              </span>
            </div>

            {/* Progress bar */}
            <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
                initial={{ width: `${(currentStep / 7) * 100}%` }}
                animate={{ width: `${((currentStep + 1) / 7) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Content */}
          <div className="text-zinc-100">{currentStepData.content}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
