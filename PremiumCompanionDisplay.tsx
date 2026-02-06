"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { useStore } from "@/lib/store";
import { EnhancedPetSprite } from "./EnhancedPetSprite";
import AuraliaSprite from "./AuraliaSprite";
import { SubAtomicParticleField } from "./auralia/SubAtomicParticleField";
import { TemporalEchoTrail } from "./auralia/TemporalEchoTrail";
import {
  Heart,
  Zap,
  Droplets,
  Moon,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
} from "lucide-react";
import type { Vitals } from "@metapet/core/vitals";

// Ambient ring effect around the companion
function AmbientRings({ mood, energy }: { mood: number; energy: number }) {
  const rings = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 0.8,
      duration: 4 + i * 0.5,
      size: 70 + i * 20,
    }));
  }, []);

  const hue = 180 + (mood - 50) * 1.2; // Mood affects hue
  const saturation = 50 + (energy / 100) * 30; // Energy affects saturation

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {rings.map((ring) => (
        <motion.div
          key={ring.id}
          className="absolute rounded-full border-2"
          style={{
            width: `${ring.size}%`,
            height: `${ring.size}%`,
            borderColor: `hsla(${hue}, ${saturation}%, 60%, 0.15)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: ring.id % 2 === 0 ? [0, 360] : [360, 0],
          }}
          transition={{
            duration: ring.duration,
            delay: ring.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Floating particles that respond to vitals
function VitalParticles({ vitals }: { vitals: Vitals }) {
  const particles = useMemo(() => {
    const count = Math.floor(8 + (vitals.energy / 100) * 12);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      type: ["hunger", "hygiene", "mood", "energy"][i % 4] as keyof Vitals,
    }));
  }, [vitals.energy]);

  const typeColors = {
    hunger: "bg-rose-400",
    hygiene: "bg-cyan-400",
    mood: "bg-amber-400",
    energy: "bg-purple-400",
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => {
        const value = vitals[p.type];
        const opacity = value / 100;

        return (
          <motion.div
            key={p.id}
            className={`absolute rounded-full ${typeColors[p.type]}`}
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 10, -10, 0],
              opacity: [opacity * 0.3, opacity * 0.7, opacity * 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

// Heartbeat effect when mood is high
function HeartbeatEffect({ mood }: { mood: number }) {
  if (mood < 70) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
    >
      <div className="absolute w-full h-full bg-pink-500/5 rounded-full blur-3xl" />
    </motion.div>
  );
}

// Energy aura when energy is high
function EnergyAura({ energy }: { energy: number }) {
  if (energy < 60) return null;

  const intensity = (energy - 60) / 40; // 0-1

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{ opacity: [intensity * 0.3, intensity * 0.5, intensity * 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-500/10 to-transparent" />
    </motion.div>
  );
}

// Low vital warning indicator
function LowVitalWarning({ vitals }: { vitals: Vitals }) {
  const lowVitals = Object.entries(vitals).filter(([_, value]) => value < 25);

  if (lowVitals.length === 0) return null;

  return (
    <motion.div
      className="absolute top-2 right-2 flex gap-1"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {lowVitals.map(([key]) => (
        <motion.div
          key={key}
          className="p-1 rounded-full bg-rose-500/20 backdrop-blur-sm"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          {key === "hunger" && <Heart className="w-3 h-3 text-rose-400" />}
          {key === "hygiene" && <Droplets className="w-3 h-3 text-cyan-400" />}
          {key === "mood" && <Sparkles className="w-3 h-3 text-amber-400" />}
          {key === "energy" && <Zap className="w-3 h-3 text-purple-400" />}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Stat bar with micro-interactions
function StatBar({
  icon: Icon,
  value,
  color,
  label,
  showDelta = false,
  delta = 0,
}: {
  icon: typeof Heart;
  value: number;
  color: string;
  label: string;
  showDelta?: boolean;
  delta?: number;
}) {
  const springValue = useSpring(value, { stiffness: 100, damping: 20 });
  const width = useTransform(springValue, [0, 100], ["0%", "100%"]);

  const isLow = value < 25;
  const isCritical = value < 10;

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`p-1.5 rounded-lg ${color.replace("from-", "bg-").split(" ")[0]}/20`}
        animate={isCritical ? { scale: [1, 1.1, 1] } : undefined}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <Icon
          className={`w-3.5 h-3.5 ${color.includes("rose") ? "text-rose-400" : color.includes("cyan") ? "text-cyan-400" : color.includes("amber") ? "text-amber-400" : "text-purple-400"}`}
        />
      </motion.div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
            {label}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-zinc-300">
              {Math.round(value)}%
            </span>
            {showDelta && delta !== 0 && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className={`text-[10px] ${delta > 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {delta > 0 ? "+" : ""}
                {delta.toFixed(1)}
              </motion.span>
            )}
          </div>
        </div>
        <div
          className={`h-1.5 rounded-full bg-slate-800/50 overflow-hidden ${isLow ? "ring-1 ring-rose-500/50" : ""}`}
        >
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${color}`}
            style={{ width }}
          />
        </div>
      </div>
    </div>
  );
}

// Main companion display component
interface PremiumCompanionDisplayProps {
  className?: string;
  expandable?: boolean;
  showParticles?: boolean;
  showRings?: boolean;
  showStats?: boolean;
  onInteract?: () => void;
}

export function PremiumCompanionDisplay({
  className = "",
  expandable = true,
  showParticles = true,
  showRings = true,
  showStats = true,
  onInteract,
}: PremiumCompanionDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastVitals, setLastVitals] = useState<Vitals | null>(null);
  const [deltas, setDeltas] = useState({
    hunger: 0,
    hygiene: 0,
    mood: 0,
    energy: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const vitals = useStore((s) => s.vitals);
  const petType = useStore((s) => s.petType);
  const traits = useStore((s) => s.traits);
  const evolution = useStore((s) => s.evolution);

  // Track vital changes
  useEffect(() => {
    if (lastVitals) {
      setDeltas({
        hunger: vitals.hunger - lastVitals.hunger,
        hygiene: vitals.hygiene - lastVitals.hygiene,
        mood: vitals.mood - lastVitals.mood,
        energy: vitals.energy - lastVitals.energy,
      });

      // Clear deltas after animation
      const timer = setTimeout(() => {
        setDeltas({ hunger: 0, hygiene: 0, mood: 0, energy: 0 });
      }, 2000);

      return () => clearTimeout(timer);
    }
    setLastVitals(vitals);
  }, [vitals]);

  const handleDoubleClick = () => {
    if (expandable) {
      setIsExpanded((prev) => !prev);
      onInteract?.();
    }
  };

  const curiosity = traits?.personality?.curiosity ?? 50;

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 via-purple-900/20 to-slate-900/80 backdrop-blur-xl border border-white/10 ${className}`}
      layout
      animate={{
        height: isExpanded ? 400 : 200,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      {/* Ambient rings */}
      {showRings && <AmbientRings mood={vitals.mood} energy={vitals.energy} />}

      {/* Vital particles */}
      {showParticles && <VitalParticles vitals={vitals} />}

      {/* Heartbeat effect */}
      <HeartbeatEffect mood={vitals.mood} />

      {/* Energy aura */}
      <EnergyAura energy={vitals.energy} />

      {/* Pet sprite container */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onDoubleClick={handleDoubleClick}
      >
        {/* Particle field background */}
        <SubAtomicParticleField
          energy={vitals.energy}
          curiosity={curiosity}
          bond={vitals.mood}
        />

        {/* Temporal echo for geometric pets */}
        {petType === "geometric" && (
          <TemporalEchoTrail
            energy={vitals.energy}
            curiosity={curiosity}
            bond={vitals.mood}
          />
        )}

        {/* The actual sprite */}
        <motion.div
          className="relative z-10"
          animate={{
            scale: isExpanded ? 1.3 : 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {petType === "geometric" ? <EnhancedPetSprite /> : <AuraliaSprite />}
        </motion.div>
      </div>

      {/* Low vital warning */}
      <LowVitalWarning vitals={vitals} />

      {/* Evolution stage indicator */}
      <motion.div
        className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-purple-500/20 backdrop-blur-sm border border-purple-500/30"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-[10px] font-medium text-purple-300">
          {evolution.state}
        </span>
      </motion.div>

      {/* Expand/collapse button */}
      {expandable && (
        <motion.button
          className="absolute bottom-2 right-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4 text-zinc-400" />
          ) : (
            <Maximize2 className="w-4 h-4 text-zinc-400" />
          )}
        </motion.button>
      )}

      {/* Stats overlay */}
      <AnimatePresence>
        {showStats && isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent"
          >
            <div className="grid grid-cols-2 gap-3">
              <StatBar
                icon={Heart}
                value={vitals.hunger}
                color="from-rose-500 to-rose-400"
                label="Hunger"
                showDelta
                delta={deltas.hunger}
              />
              <StatBar
                icon={Droplets}
                value={vitals.hygiene}
                color="from-cyan-500 to-cyan-400"
                label="Hygiene"
                showDelta
                delta={deltas.hygiene}
              />
              <StatBar
                icon={Sparkles}
                value={vitals.mood}
                color="from-amber-500 to-amber-400"
                label="Mood"
                showDelta
                delta={deltas.mood}
              />
              <StatBar
                icon={Zap}
                value={vitals.energy}
                color="from-purple-500 to-purple-400"
                label="Energy"
                showDelta
                delta={deltas.energy}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double-click hint */}
      {expandable && !isExpanded && (
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2 }}
        >
          Double-click to expand
        </motion.div>
      )}
    </motion.div>
  );
}

export default PremiumCompanionDisplay;
