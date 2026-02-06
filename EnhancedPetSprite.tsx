"use client";

import { memo, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { EVOLUTION_VISUALS } from "@/lib/evolution";
import { getCockatooDataUri } from "@/lib/cockatooSprites";
import { motion } from "framer-motion";
import {
  getBodyShapePath,
  getGlowEffect,
  getMoodAnimationParams,
  getPupilPosition,
  getMouthPath,
  getMoodState,
  type BodyShapeData,
  type BodyType,
} from "@/lib/sprite-core/geometry";

export const EnhancedPetSprite = memo(function EnhancedPetSprite() {
  const traits = useStore((s) => s.traits);
  const vitals = useStore((s) => s.vitals);
  const evolution = useStore((s) => s.evolution);
  const lastAction = useStore((s) => s.lastAction);
  const lastActionAt = useStore((s) => s.lastActionAt);

  const ACTION_WINDOW_MS = 1400;
  const [actionActive, setActionActive] = useState(false);

  useEffect(() => {
    if (!lastAction) {
      setActionActive(false);
      return;
    }

    const age = Date.now() - lastActionAt;
    if (age < ACTION_WINDOW_MS) {
      setActionActive(true);
      const t = setTimeout(
        () => setActionActive(false),
        ACTION_WINDOW_MS - age,
      );
      return () => clearTimeout(t);
    } else {
      setActionActive(false);
    }
  }, [lastAction, lastActionAt]);

  const cockatooImages = useMemo(
    () => ({
      feeding: getCockatooDataUri("feeding"),
      sleeping: getCockatooDataUri("sleeping"),
      perched: getCockatooDataUri("perched"),
      angry: getCockatooDataUri("angry"),
    }),
    [],
  );

  // Determine animation state based on vitals
  const isHappy = vitals.mood > 70;
  const isTired = vitals.energy < 30;
  const isHungry = vitals.hunger > 70;
  const isUnhappy = vitals.mood < 40;

  const cockatooSrc = useMemo(() => {
    if (actionActive && lastAction) {
      switch (lastAction) {
        case "feed":
          return cockatooImages.feeding;
        case "sleep":
          return cockatooImages.sleeping;
        case "play":
          return cockatooImages.perched;
        case "clean":
          return cockatooImages.perched;
      }
    }

    if (isTired) return cockatooImages.sleeping;
    if (isHungry && !isUnhappy) return cockatooImages.feeding;
    if (isUnhappy) return cockatooImages.angry;
    return cockatooImages.perched;
  }, [actionActive, cockatooImages, isHungry, isTired, isUnhappy, lastAction]);

  if (!traits) {
    return (
      <motion.div
        className="w-full h-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-6xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🧬
        </motion.div>
      </motion.div>
    );
  }

  const { physical } = traits;

  // Use sprite-core functions for calculations (memoized for performance)
  const spriteAnimation = useMemo(
    () => getMoodAnimationParams(vitals),
    [vitals.mood, vitals.energy, vitals.hunger],
  );

  const glowEffect = useMemo(() => getGlowEffect(vitals.mood), [vitals.mood]);

  const pupilPositions = useMemo(
    () => getPupilPosition(vitals.mood),
    [vitals.mood],
  );

  const mouthPath = useMemo(() => getMouthPath(vitals.mood), [vitals.mood]);

  const moodState = useMemo(
    () => getMoodState(vitals),
    [vitals.mood, vitals.energy, vitals.hunger],
  );

  // Convert animation params to Framer Motion format
  const getMoodAnimation = () => {
    const keyframes: any = {
      y: spriteAnimation.keyframes.y,
      rotate: spriteAnimation.keyframes.rotate,
    };
    if (spriteAnimation.keyframes.scale) {
      keyframes.scale = spriteAnimation.keyframes.scale;
    }
    if (spriteAnimation.keyframes.opacity) {
      keyframes.opacity = spriteAnimation.keyframes.opacity;
    }
    return keyframes;
  };

  // Use sprite-core to render body shape
  const bodyShapeData = useMemo(
    () =>
      getBodyShapePath(
        physical.bodyType as BodyType,
        physical.size,
        physical.primaryColor,
        physical.secondaryColor,
      ),
    [
      physical.bodyType,
      physical.size,
      physical.primaryColor,
      physical.secondaryColor,
    ],
  );

  const renderBodyShape = (shape: BodyShapeData): JSX.Element => {
    if (shape.type === "group" && shape.children) {
      return (
        <g>
          {shape.children.map((child, i) => (
            <g key={i}>{renderBodyShape(child)}</g>
          ))}
        </g>
      );
    }

    const props = { ...shape.attrs };
    switch (shape.type) {
      case "circle":
        return <circle {...props} />;
      case "rect":
        return <rect {...props} />;
      case "polygon":
        return <polygon {...props} />;
      case "ellipse":
        return <ellipse {...props} />;
      default:
        return <circle {...props} />;
    }
  };

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: glowEffect.color,
          opacity: glowEffect.intensity * 0.3,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [
            glowEffect.intensity * 0.2,
            glowEffect.intensity * 0.4,
            glowEffect.intensity * 0.2,
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Cockatoo state overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        animate={{
          y:
            actionActive && lastAction === "play"
              ? [-6, 6, -6]
              : moodState.isHappy
                ? [-2, 2, -2]
                : [0, 1.5, 0],
          rotate:
            actionActive && lastAction === "clean"
              ? [0, -6, 6, 0]
              : moodState.isUnhappy
                ? [-2, 2, -2]
                : 0,
        }}
        transition={{
          duration: actionActive ? 0.6 : moodState.isUnhappy ? 0.8 : 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src={cockatooSrc}
          alt="Jewble Cockatoo State"
          width={140}
          height={140}
          priority={false}
          className="drop-shadow-[0_0_18px_rgba(34,211,238,0.8)] select-none"
        />
      </motion.div>

      {/* Pet sprite with animations */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full max-w-xs relative z-10"
        animate={getMoodAnimation()}
        transition={{
          duration: spriteAnimation.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Defs for gradients and filters */}
        <defs>
          {/* Glossy shine effect */}
          <radialGradient id="petGloss" cx="35%" cy="35%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="50%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Mood glow */}
          <filter id="moodGlow">
            <feGaussianBlur
              stdDeviation={moodState.isHappy ? "3" : "1"}
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shadow */}
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse
          cx="100"
          cy="180"
          rx="60"
          ry="12"
          fill="black"
          opacity="0.2"
          filter="url(#shadow)"
        />

        {/* Main body */}
        <g filter="url(#moodGlow)">{renderBodyShape(bodyShapeData)}</g>

        {/* Glossy shine overlay */}
        <circle
          cx="100"
          cy="100"
          r={physical.size * 80}
          fill="url(#petGloss)"
        />

        {/* Eyes - animated based on mood */}
        <motion.g
          animate={{
            opacity: moodState.isTired ? 0.5 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <circle cx="85" cy="90" r="8" fill="white" />
          <circle cx="115" cy="90" r="8" fill="white" />

          {/* Pupils */}
          <motion.circle
            cx="85"
            cy="90"
            r="5"
            fill="black"
            animate={{
              cx: pupilPositions.left.cx,
              cy: pupilPositions.left.cy,
            }}
            transition={{ duration: 0.5 }}
          />
          <motion.circle
            cx="115"
            cy="90"
            r="5"
            fill="black"
            animate={{
              cx: pupilPositions.right.cx,
              cy: pupilPositions.right.cy,
            }}
            transition={{ duration: 0.5 }}
          />
        </motion.g>

        {/* Mouth - changes based on mood */}
        <motion.path
          d={mouthPath}
          stroke={physical.secondaryColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: mouthPath,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Mood particles for happy state */}
        {moodState.isHappy && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.circle
                key={i}
                cx="100"
                cy="50"
                r="2"
                fill={physical.primaryColor}
                opacity="0.6"
                animate={{
                  y: [0, -30, -60],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                }}
              />
            ))}
          </>
        )}

        {/* Tired particles (z's) */}
        {moodState.isTired && (
          <>
            {[...Array(2)].map((_, i) => (
              <motion.text
                key={i}
                x="130"
                y="60"
                fontSize="12"
                fill={physical.primaryColor}
                opacity="0.7"
                animate={{
                  y: [60, 40, 20],
                  opacity: [0.7, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                }}
              >
                Z
              </motion.text>
            ))}
          </>
        )}
      </motion.svg>
    </motion.div>
  );
});
