"use client";

import {
  type ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";

// Transition types
type TransitionType = "fade" | "slide" | "scale" | "morph" | "reveal";
type TransitionDirection = "up" | "down" | "left" | "right";

interface TransitionConfig {
  type: TransitionType;
  direction?: TransitionDirection;
  duration?: number;
  delay?: number;
  stagger?: number;
}

interface TransitionContextType {
  isTransitioning: boolean;
  currentPath: string;
  previousPath: string | null;
  config: TransitionConfig;
  setConfig: (config: Partial<TransitionConfig>) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within TransitionProvider");
  }
  return context;
}

// Animation variants for different transition types
const createVariants = (config: TransitionConfig): Variants => {
  const { type, direction = "up", duration = 0.4 } = config;

  const directionOffset = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
  };

  switch (type) {
    case "fade":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

    case "slide":
      return {
        initial: { opacity: 0, ...directionOffset[direction] },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: {
          opacity: 0,
          ...directionOffset[
            direction === "up"
              ? "down"
              : direction === "down"
                ? "up"
                : direction === "left"
                  ? "right"
                  : "left"
          ],
        },
      };

    case "scale":
      return {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.05 },
      };

    case "morph":
      return {
        initial: {
          opacity: 0,
          scale: 0.9,
          borderRadius: "50%",
          filter: "blur(10px)",
        },
        animate: {
          opacity: 1,
          scale: 1,
          borderRadius: "0%",
          filter: "blur(0px)",
        },
        exit: {
          opacity: 0,
          scale: 0.9,
          borderRadius: "50%",
          filter: "blur(10px)",
        },
      };

    case "reveal":
      return {
        initial: { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
        animate: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
        exit: { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
      };

    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
  }
};

// Staggered children animation wrapper
interface StaggeredChildrenProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
}

export function StaggeredChildren({
  children,
  stagger = 0.1,
  delay = 0,
}: StaggeredChildrenProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Individual staggered item
interface StaggeredItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggeredItem({
  children,
  className = "",
}: StaggeredItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 25 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Shimmer loading effect
interface ShimmerProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  rounded?: boolean;
}

export function Shimmer({
  width = "100%",
  height = 20,
  className = "",
  rounded = false,
}: ShimmerProps) {
  return (
    <motion.div
      className={`relative overflow-hidden bg-slate-800/50 ${rounded ? "rounded-full" : "rounded-lg"} ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

// Content loading skeleton
interface SkeletonProps {
  lines?: number;
  className?: string;
}

export function Skeleton({ lines = 3, className = "" }: SkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer key={i} height={16} width={i === lines - 1 ? "60%" : "100%"} />
      ))}
    </div>
  );
}

// Page transition overlay
function TransitionOverlay({ isActive }: { isActive: boolean }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] bg-slate-950 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </AnimatePresence>
  );
}

// Main transition provider
interface TransitionProviderProps {
  children: ReactNode;
  defaultConfig?: Partial<TransitionConfig>;
}

export function TransitionProvider({
  children,
  defaultConfig = {},
}: TransitionProviderProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [config, setConfig] = useState<TransitionConfig>({
    type: "slide",
    direction: "up",
    duration: 0.4,
    delay: 0,
    stagger: 0.1,
    ...defaultConfig,
  });

  useEffect(() => {
    if (pathname !== previousPath) {
      setIsTransitioning(true);
      setPreviousPath(pathname);

      const timer = setTimeout(
        () => {
          setIsTransitioning(false);
        },
        (config.duration ?? 0.4) * 1000,
      );

      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath, config.duration]);

  const updateConfig = (newConfig: Partial<TransitionConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        currentPath: pathname,
        previousPath,
        config,
        setConfig: updateConfig,
      }}
    >
      <TransitionOverlay isActive={isTransitioning} />
      {children}
    </TransitionContext.Provider>
  );
}

// Animated page wrapper
interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
  config?: Partial<TransitionConfig>;
}

export function AnimatedPage({
  children,
  className = "",
  config: overrideConfig,
}: AnimatedPageProps) {
  const { config: contextConfig } = useTransition();
  const mergedConfig = { ...contextConfig, ...overrideConfig };
  const variants = createVariants(mergedConfig);

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: mergedConfig.duration,
        delay: mergedConfig.delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// Section reveal animation
interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
}

export function SectionReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
}: SectionRevealProps) {
  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// Parallax scroll effect
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({
  children,
  speed = 0.5,
  className = "",
}: ParallaxProps) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: `${-speed * 100}%` }}
      viewport={{ once: false }}
      transition={{ type: "tween", ease: "linear" }}
    >
      {children}
    </motion.div>
  );
}

// Hover scale effect
interface HoverScaleProps {
  children: ReactNode;
  scale?: number;
  className?: string;
}

export function HoverScale({
  children,
  scale = 1.02,
  className = "",
}: HoverScaleProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// Focus ring animation
interface FocusRingProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function FocusRing({
  children,
  color = "cyan",
  className = "",
}: FocusRingProps) {
  const [isFocused, setIsFocused] = useState(false);

  const ringColors = {
    cyan: "ring-cyan-500/50",
    purple: "ring-purple-500/50",
    pink: "ring-pink-500/50",
    amber: "ring-amber-500/50",
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className={`absolute inset-0 rounded-xl ring-2 ${ringColors[color as keyof typeof ringColors] || ringColors.cyan} pointer-events-none`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  );
}

// Typing animation for text
interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  speed = 50,
  delay = 0,
  className = "",
  onComplete,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, speed);

        return () => clearTimeout(timer);
      } else {
        onComplete?.();
      }
    }, delay);

    return () => clearTimeout(startDelay);
  }, [currentIndex, text, speed, delay, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          className="inline-block w-0.5 h-[1em] bg-current ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
}

// Number counter animation
interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function Counter({
  from = 0,
  to,
  duration = 1,
  delay = 0,
  className = "",
  suffix = "",
  prefix = "",
}: CounterProps) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic

        setCount(Math.round(from + (to - from) * eased));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(startDelay);
  }, [from, to, duration, delay]);

  return (
    <span className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export default TransitionProvider;
