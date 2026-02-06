"use client";

import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  Home,
  Gamepad2,
  Map,
  Trophy,
  Settings,
  Sparkles,
  Menu,
  X,
  ChevronUp,
  Dna,
  Heart,
  Zap,
  Droplets,
  Moon,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Download,
  RefreshCw,
} from "lucide-react";

// Context for layout state
interface LayoutContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  scrollY: number;
  isCompact: boolean;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within PremiumLayout");
  return context;
}

// Floating orb ambient particles
function AmbientOrbs() {
  const orbs = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: 60 + Math.random() * 120,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 5,
    hue: [180, 260, 300, 220, 340, 200][i],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, hsl(${orb.hue}, 80%, 60%) 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -40, 30, -20, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
            opacity: [0.15, 0.25, 0.18, 0.22, 0.15],
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
  );
}

// Premium glass card wrapper
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "purple" | "pink" | "amber" | "emerald" | "none";
  intensity?: "subtle" | "medium" | "strong";
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = "",
  glow = "none",
  intensity = "medium",
  hover = false,
  onClick,
}: GlassCardProps) {
  const glowColors = {
    cyan: "shadow-cyan-500/20 hover:shadow-cyan-500/30",
    purple: "shadow-purple-500/20 hover:shadow-purple-500/30",
    pink: "shadow-pink-500/20 hover:shadow-pink-500/30",
    amber: "shadow-amber-500/20 hover:shadow-amber-500/30",
    emerald: "shadow-emerald-500/20 hover:shadow-emerald-500/30",
    none: "",
  };

  const borderColors = {
    cyan: "border-cyan-500/30",
    purple: "border-purple-500/30",
    pink: "border-pink-500/30",
    amber: "border-amber-500/30",
    emerald: "border-emerald-500/30",
    none: "border-white/10",
  };

  const intensityStyles = {
    subtle: "bg-white/[0.02] backdrop-blur-md",
    medium: "bg-white/[0.04] backdrop-blur-lg",
    strong: "bg-white/[0.08] backdrop-blur-xl",
  };

  return (
    <motion.div
      onClick={onClick}
      className={`
        relative rounded-2xl border overflow-hidden
        ${intensityStyles[intensity]}
        ${borderColors[glow]}
        ${glow !== "none" ? `shadow-lg ${glowColors[glow]}` : ""}
        ${hover ? "cursor-pointer transition-all duration-300" : ""}
        ${className}
      `}
      whileHover={hover ? { scale: 1.01, y: -2 } : undefined}
      whileTap={hover ? { scale: 0.99 } : undefined}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/[0.05] pointer-events-none" />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Premium header with scroll effects
interface PremiumHeaderProps {
  title?: string;
  companionName?: string;
  vitals?: { hunger: number; hygiene: number; mood: number; energy: number };
  isOnline?: boolean;
  isInstallable?: boolean;
  isUpdateAvailable?: boolean;
  onInstall?: () => void;
  onUpdate?: () => void;
  onSettingsClick?: () => void;
  audioEnabled?: boolean;
  onAudioToggle?: () => void;
}

export function PremiumHeader({
  title = "Meta-Pet",
  companionName,
  vitals,
  isOnline = true,
  isInstallable = false,
  isUpdateAvailable = false,
  onInstall,
  onUpdate,
  onSettingsClick,
  audioEnabled = true,
  onAudioToggle,
}: PremiumHeaderProps) {
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const headerBlur = useTransform(scrollY, [0, 50], [0, 20]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85]);

  const springConfig = { stiffness: 300, damping: 30 };
  const smoothOpacity = useSpring(headerOpacity, springConfig);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: useTransform(headerBlur, (v) => `blur(${v}px)`),
      }}
    >
      {/* Background that fades in on scroll */}
      <motion.div
        className="absolute inset-0 bg-slate-950/80 border-b border-white/5"
        style={{ opacity: smoothOpacity }}
      />

      <div className="relative max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo section */}
          <motion.div
            className="flex items-center gap-3"
            style={{ scale: logoScale }}
          >
            <motion.div
              className="relative p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Dna className="w-5 h-5 text-white" />
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ filter: "blur(8px)", zIndex: -1 }}
              />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                {title}
              </h1>
              {companionName && (
                <p className="text-xs text-zinc-500">{companionName}</p>
              )}
            </div>
          </motion.div>

          {/* Status indicators */}
          <div className="flex items-center gap-2">
            {/* Mini vitals display */}
            {vitals && (
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5">
                <div className="flex items-center gap-0.5">
                  <Heart className="w-3 h-3 text-rose-400" />
                  <div className="w-8 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-500 to-rose-400"
                      initial={false}
                      animate={{ width: `${vitals.hunger}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <div className="w-8 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                      initial={false}
                      animate={{ width: `${vitals.energy}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Connection status */}
            <motion.div
              className={`p-1.5 rounded-full ${isOnline ? "bg-emerald-500/20" : "bg-rose-500/20"}`}
              animate={!isOnline ? { scale: [1, 1.1, 1] } : undefined}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              )}
            </motion.div>

            {/* Update available */}
            {isUpdateAvailable && (
              <motion.button
                onClick={onUpdate}
                className="p-1.5 rounded-full bg-amber-500/20"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              </motion.button>
            )}

            {/* Install button */}
            {isInstallable && (
              <motion.button
                onClick={onInstall}
                className="p-1.5 rounded-full bg-cyan-500/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
              </motion.button>
            )}

            {/* Audio toggle */}
            <motion.button
              onClick={onAudioToggle}
              className={`p-1.5 rounded-full ${audioEnabled ? "bg-purple-500/20" : "bg-slate-500/20"}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {audioEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
            </motion.button>

            {/* Settings */}
            <motion.button
              onClick={onSettingsClick}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Settings className="w-3.5 h-3.5 text-zinc-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

// Premium bottom navigation with haptic-style feedback
interface NavItem {
  id: string;
  icon: typeof Home;
  label: string;
  badge?: number;
}

interface PremiumNavProps {
  items?: NavItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function PremiumNav({
  items = [
    { id: "home", icon: Home, label: "Home" },
    { id: "games", icon: Gamepad2, label: "Games" },
    { id: "explore", icon: Map, label: "Explore" },
    { id: "achievements", icon: Trophy, label: "Trophies" },
  ],
  activeTab,
  onTabChange,
}: PremiumNavProps) {
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipples((prev) => [...prev, { id: Date.now(), x, y }]);
    onTabChange(id);

    // Haptic feedback if available
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
    >
      {/* Gradient blur background */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent" />
      <div className="absolute inset-0 backdrop-blur-xl" />

      {/* Subtle top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative max-w-lg mx-auto px-6 py-3 pb-safe">
        <div className="flex items-center justify-around">
          {items.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                onClick={(e) => handleClick(e, item.id)}
                className="relative flex flex-col items-center gap-1 py-2 px-4 rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active background */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-purple-500/15 to-pink-500/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon with glow */}
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? "text-cyan-400" : "text-zinc-500"
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-cyan-400/50 blur-md"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    isActive ? "text-cyan-300" : "text-zinc-500"
                  }`}
                >
                  {item.label}
                </span>

                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-2 w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center"
                  >
                    <span className="text-[8px] font-bold text-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  </motion.div>
                )}

                {/* Ripple effects */}
                {ripples.map((ripple) => (
                  <motion.div
                    key={ripple.id}
                    className="absolute w-2 h-2 bg-white/30 rounded-full pointer-events-none"
                    initial={{
                      x: ripple.x - 4,
                      y: ripple.y - 4,
                      scale: 0,
                      opacity: 0.6,
                    }}
                    animate={{ scale: 20, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    onAnimationComplete={() => {
                      setRipples((prev) =>
                        prev.filter((r) => r.id !== ripple.id),
                      );
                    }}
                  />
                ))}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

// Floating action button
interface FloatingActionProps {
  icon?: typeof Sparkles;
  onClick?: () => void;
  pulse?: boolean;
  label?: string;
}

export function FloatingAction({
  icon: Icon = Sparkles,
  onClick,
  pulse = false,
  label,
}: FloatingActionProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-purple-500/25"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.8 }}
    >
      {pulse && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <Icon className="w-6 h-6 text-white relative z-10" />
      {label && (
        <motion.span
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-sm whitespace-nowrap"
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  );
}

// Scroll to top button
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 left-4 z-40 p-3 rounded-full bg-slate-800/80 backdrop-blur-sm border border-white/10 text-zinc-400 hover:text-white"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Main layout wrapper
interface PremiumLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  showHeader?: boolean;
  showAmbient?: boolean;
  headerProps?: PremiumHeaderProps;
}

export function PremiumLayout({
  children,
  showNav = true,
  showHeader = true,
  showAmbient = true,
  headerProps = {},
}: PremiumLayoutProps) {
  const [activeTab, setActiveTab] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsCompact(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isMenuOpen,
        setIsMenuOpen,
        scrollY,
        isCompact,
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900 text-white">
        {/* Ambient background effects */}
        {showAmbient && <AmbientOrbs />}

        {/* Fixed background gradient */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

        {/* Header */}
        {showHeader && <PremiumHeader {...headerProps} />}

        {/* Main content */}
        <main
          className={`relative z-10 ${showHeader ? "pt-16" : ""} ${showNav ? "pb-24" : ""}`}
        >
          {children}
        </main>

        {/* Bottom navigation */}
        {showNav && (
          <PremiumNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {/* Scroll to top */}
        <ScrollToTop />
      </div>
    </LayoutContext.Provider>
  );
}

// Page transition wrapper
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Section header with gradient
interface SectionHeaderProps {
  title: string;
  icon?: typeof Sparkles;
  action?: ReactNode;
  gradient?: "cyan" | "purple" | "pink" | "amber";
}

export function SectionHeader({
  title,
  icon: Icon,
  action,
  gradient = "cyan",
}: SectionHeaderProps) {
  const gradients = {
    cyan: "from-cyan-400 to-blue-500",
    purple: "from-purple-400 to-pink-500",
    pink: "from-pink-400 to-rose-500",
    amber: "from-amber-400 to-orange-500",
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={`p-2 rounded-xl bg-gradient-to-br ${gradients[gradient]} bg-opacity-20`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <h2
          className={`text-xl font-bold bg-gradient-to-r ${gradients[gradient]} bg-clip-text text-transparent`}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export default PremiumLayout;
