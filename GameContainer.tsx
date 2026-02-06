/**
 * GameContainer Component
 * Wrapper for mini-games with particle effects and visual feedback
 */

"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubAtomicParticleField } from "@/components/auralia/SubAtomicParticleField";

export interface GameContainerProps {
  /** Whether the game is currently active */
  isActive: boolean;

  /** Game content */
  children: ReactNode;

  /** Callback when user exits the game */
  onExit: () => void;

  /** Optional energy level for particle effects */
  energy?: number;

  /** Optional bond level for particle effects */
  bond?: number;
}

/**
 * Container for mini-games with ambient particle effects
 */
export function GameContainer({
  isActive,
  children,
  onExit,
  energy = 50,
  bond = 50,
}: GameContainerProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Ambient particle field */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <SubAtomicParticleField
              energy={energy}
              curiosity={75}
              bond={bond}
            />
          </div>

          {/* Game content */}
          <div className="relative z-10 w-full h-full flex flex-col">
            {/* Exit button */}
            <div className="flex justify-end p-4">
              <button
                onClick={onExit}
                className="px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-600 transition-colors"
                aria-label="Exit game"
              >
                Exit
              </button>
            </div>

            {/* Game content area */}
            <div className="flex-1 overflow-auto p-4">
              <motion.div
                className="w-full h-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {children}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
