"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dna } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
  minimumDuration?: number;
}

const loadingStages = [
  { message: "Initializing consciousness...", progress: 10 },
  { message: "Generating genome sequence...", progress: 30 },
  { message: "Calibrating neural pathways...", progress: 50 },
  { message: "Synchronizing vitals...", progress: 70 },
  { message: "Establishing bond...", progress: 90 },
  { message: "Ready", progress: 100 },
];

const floatingOrbs = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: Math.random() * 40 + 20,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2,
  opacity: Math.random() * 0.3 + 0.1,
}));

export function SplashScreen({
  onComplete,
  minimumDuration = 2500,
}: SplashScreenProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stageInterval = minimumDuration / loadingStages.length;
    let stageIndex = 0;

    const progressInterval = setInterval(() => {
      if (stageIndex < loadingStages.length - 1) {
        stageIndex++;
        setCurrentStage(stageIndex);
        setProgress(loadingStages[stageIndex].progress);
      } else {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 500);
        }, 300);
      }
    }, stageInterval);

    return () => clearInterval(progressInterval);
  }, [minimumDuration, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center overflow-hidden"
        >
          {/* Floating orbs background */}
          <div className="absolute inset-0 overflow-hidden">
            {floatingOrbs.map((orb) => (
              <motion.div
                key={orb.id}
                className="absolute rounded-full"
                style={{
                  width: orb.size,
                  height: orb.size,
                  left: `${orb.x}%`,
                  top: `${orb.y}%`,
                  background: `radial-gradient(circle, rgba(139, 92, 246, ${orb.opacity}) 0%, transparent 70%)`,
                }}
                animate={{
                  y: [0, -50, 0],
                  x: [0, 20, 0],
                  scale: [1, 1.2, 1],
                  opacity: [orb.opacity, orb.opacity * 1.5, orb.opacity],
                }}
                transition={{
                  duration: orb.duration,
                  delay: orb.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Radial glow */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 60%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Content */}
          <div className="relative z-10 text-center px-4">
            {/* Logo/Icon */}
            <motion.div
              className="relative mx-auto w-32 h-32 mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            >
              {/* Outer rotating ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-purple-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full bg-purple-500" />
              </motion.div>

              {/* Middle rotating ring */}
              <motion.div
                className="absolute inset-4 rounded-full border-2 border-cyan-500/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full bg-cyan-500" />
              </motion.div>

              {/* Inner pulsing core */}
              <motion.div
                className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.3)",
                    "0 0 40px rgba(139, 92, 246, 0.6)",
                    "0 0 20px rgba(139, 92, 246, 0.3)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Dna className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Meta-Pet
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-zinc-500 mb-8 text-sm tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Digital Companion Experience
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="w-64 mx-auto mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            {/* Loading message */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-zinc-400 text-sm h-5"
              >
                {loadingStages[currentStage].message}
              </motion.p>
            </AnimatePresence>

            {/* DNA helix animation at bottom */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-8 rounded-full bg-gradient-to-b from-cyan-500 to-purple-500"
                  animate={{
                    scaleY: [0.5, 1, 0.5],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.15,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
