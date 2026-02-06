"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import {
  UtensilsCrossed,
  Sparkles,
  Droplets,
  Zap,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";

interface StatBarProps {
  label: string;
  value: number;
  previousValue: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  criticalThreshold?: number;
}

function StatBar({
  label,
  value,
  previousValue,
  icon,
  color,
  gradient,
  criticalThreshold = 20,
}: StatBarProps) {
  const [showDelta, setShowDelta] = useState(false);
  const delta = value - previousValue;
  const isCritical = value < criticalThreshold;
  const isLow = value < 40;

  useEffect(() => {
    if (delta !== 0) {
      setShowDelta(true);
      const timer = setTimeout(() => setShowDelta(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [value, delta]);

  return (
    <div className="relative">
      {/* Critical warning pulse */}
      {isCritical && (
        <motion.div
          className="absolute -inset-1 rounded-xl bg-rose-500/20 -z-10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}

      <div className="flex items-center justify-between mb-1.5 text-sm">
        <div className="flex items-center gap-2">
          <motion.div
            className={`${isCritical ? "text-rose-400" : `text-${color}-400`}`}
            animate={isCritical ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
          >
            {isCritical ? <AlertTriangle className="w-4 h-4" /> : icon}
          </motion.div>
          <span
            className={`${isCritical ? "text-rose-300" : "text-zinc-300"} font-medium`}
          >
            {label}
          </span>

          {/* Low warning badge */}
          {isLow && !isCritical && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400"
            >
              LOW
            </motion.span>
          )}
          {isCritical && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-400"
            >
              CRITICAL
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Delta indicator */}
          <AnimatePresence>
            {showDelta && delta !== 0 && (
              <motion.span
                initial={{ opacity: 0, y: delta > 0 ? 10 : -10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: delta > 0 ? -10 : 10, scale: 0.8 }}
                className={`text-xs font-bold ${delta > 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {delta > 0 ? "+" : ""}
                {Math.round(delta)}
              </motion.span>
            )}
          </AnimatePresence>

          <motion.span
            key={value}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-bold tabular-nums ${isCritical ? "text-rose-400" : "text-white"}`}
          >
            {Math.round(value)}%
          </motion.span>
        </div>
      </div>

      {/* Progress bar container */}
      <div className="relative h-3 bg-zinc-800/80 rounded-xl overflow-hidden border border-zinc-700/50">
        {/* Background glow for high values */}
        {value > 80 && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20 blur-sm`}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Main progress fill */}
        <motion.div
          className={`h-full bg-gradient-to-r ${isCritical ? "from-rose-600 to-rose-500" : gradient} relative`}
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.div>

        {/* Tick marks */}
        <div className="absolute inset-0 flex">
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="absolute top-0 bottom-0 w-px bg-zinc-600/50"
              style={{ left: `${mark}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  color?: string;
  disabled?: boolean;
  cooldown?: number;
}

function ActionButton({
  onClick,
  icon,
  label,
  variant = "primary",
  color = "cyan",
  disabled = false,
  cooldown = 0,
}: ActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [onCooldown, setOnCooldown] = useState(false);
  const [cooldownProgress, setCooldownProgress] = useState(0);

  const handleClick = () => {
    if (disabled || onCooldown) return;

    setIsPressed(true);
    onClick();

    if (cooldown > 0) {
      setOnCooldown(true);
      setCooldownProgress(100);

      const interval = setInterval(() => {
        setCooldownProgress((prev) => {
          const next = prev - 100 / (cooldown / 50);
          if (next <= 0) {
            clearInterval(interval);
            setOnCooldown(false);
            return 0;
          }
          return next;
        });
      }, 50);
    }

    setTimeout(() => setIsPressed(false), 150);
  };

  const buttonVariants = {
    primary: `bg-gradient-to-r from-${color}-600 to-${color}-500 hover:from-${color}-500 hover:to-${color}-400 text-white shadow-lg shadow-${color}-500/20`,
    secondary: `bg-${color}-500/20 hover:bg-${color}-500/30 text-${color}-300 border border-${color}-500/30`,
    outline: `border-2 border-${color}-500/50 hover:border-${color}-400 hover:bg-${color}-500/10 text-${color}-300`,
    ghost: `hover:bg-${color}-500/10 text-${color}-400`,
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || onCooldown}
      className={`relative w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${buttonVariants[variant]}`}
      whileHover={{ scale: disabled || onCooldown ? 1 : 1.02 }}
      whileTap={{ scale: disabled || onCooldown ? 1 : 0.98 }}
    >
      {/* Cooldown overlay */}
      {onCooldown && (
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-white/30"
            style={{ width: `${cooldownProgress}%` }}
          />
        </motion.div>
      )}

      {/* Press ripple effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <motion.span
        animate={isPressed ? { scale: 1.2 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {icon}
      </motion.span>
      <span>{label}</span>
    </motion.button>
  );
}

export function HUD() {
  const vitals = useStore((s) => s.vitals);
  const feed = useStore((s) => s.feed);
  const clean = useStore((s) => s.clean);
  const play = useStore((s) => s.play);
  const sleep = useStore((s) => s.sleep);

  // Track previous values for delta display
  const prevVitals = useRef(vitals);
  const [prevValues, setPrevValues] = useState(vitals);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevValues(prevVitals.current);
      prevVitals.current = vitals;
    }, 100);
    return () => clearTimeout(timer);
  }, [vitals]);

  // Calculate overall health score
  const healthScore = Math.round(
    (vitals.hunger + vitals.hygiene + vitals.mood + vitals.energy) / 4,
  );
  const healthStatus =
    healthScore > 75
      ? "Thriving"
      : healthScore > 50
        ? "Good"
        : healthScore > 25
          ? "Needs Care"
          : "Critical";
  const healthColor =
    healthScore > 75
      ? "emerald"
      : healthScore > 50
        ? "cyan"
        : healthScore > 25
          ? "amber"
          : "rose";

  return (
    <div className="space-y-6">
      {/* Overall Health Indicator */}
      <motion.div
        className={`p-4 rounded-xl bg-${healthColor}-500/10 border border-${healthColor}-500/30 flex items-center gap-4`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className={`p-2 rounded-full bg-${healthColor}-500/20`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className={`w-6 h-6 text-${healthColor}-400`} />
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-zinc-400">Overall Health</span>
            <span className={`text-sm font-semibold text-${healthColor}-400`}>
              {healthStatus}
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r from-${healthColor}-600 to-${healthColor}-400`}
              initial={false}
              animate={{ width: `${healthScore}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </div>
        <span
          className={`text-2xl font-bold text-${healthColor}-400 tabular-nums`}
        >
          {healthScore}%
        </span>
      </motion.div>

      {/* Individual Vitals */}
      <div className="space-y-4">
        <StatBar
          label="Hunger"
          value={vitals.hunger}
          previousValue={prevValues.hunger}
          icon={<UtensilsCrossed className="w-4 h-4" />}
          color="orange"
          gradient="from-orange-500 to-amber-500"
        />
        <StatBar
          label="Hygiene"
          value={vitals.hygiene}
          previousValue={prevValues.hygiene}
          icon={<Droplets className="w-4 h-4" />}
          color="cyan"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatBar
          label="Mood"
          value={vitals.mood}
          previousValue={prevValues.mood}
          icon={<Sparkles className="w-4 h-4" />}
          color="pink"
          gradient="from-pink-500 to-purple-500"
        />
        <StatBar
          label="Energy"
          value={vitals.energy}
          previousValue={prevValues.energy}
          icon={<Zap className="w-4 h-4" />}
          color="amber"
          gradient="from-yellow-500 to-amber-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <ActionButton
          onClick={feed}
          icon={<UtensilsCrossed className="w-5 h-5" />}
          label="Feed"
          variant="primary"
          color="orange"
          cooldown={500}
        />
        <ActionButton
          onClick={clean}
          icon={<Droplets className="w-5 h-5" />}
          label="Clean"
          variant="secondary"
          color="cyan"
          cooldown={500}
        />
        <ActionButton
          onClick={play}
          icon={<Sparkles className="w-5 h-5" />}
          label="Play"
          variant="outline"
          color="pink"
          cooldown={500}
        />
        <ActionButton
          onClick={sleep}
          icon={<Zap className="w-5 h-5" />}
          label="Rest"
          variant="ghost"
          color="amber"
          cooldown={500}
        />
      </div>

      {/* Tips for critical vitals */}
      <AnimatePresence>
        {Object.entries(vitals).some(([, v]) => v < 20) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>
                {vitals.hunger < 20 && "Your companion is very hungry! "}
                {vitals.hygiene < 20 && "Your companion needs cleaning! "}
                {vitals.energy < 20 && "Your companion is exhausted! "}
                {vitals.mood < 20 && "Your companion is sad! "}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HUD;
