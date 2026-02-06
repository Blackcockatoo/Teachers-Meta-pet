"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Star,
  Sparkles,
  Heart,
  Zap,
  Check,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

export type ToastType =
  | "success"
  | "error"
  | "info"
  | "achievement"
  | "milestone"
  | "evolution";

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  icon?: React.ReactNode;
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <Check className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  achievement: <Trophy className="w-5 h-5" />,
  milestone: <Star className="w-5 h-5" />,
  evolution: <Sparkles className="w-5 h-5" />,
};

const toastStyles: Record<
  ToastType,
  { bg: string; border: string; icon: string }
> = {
  success: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/50",
    icon: "text-emerald-400",
  },
  error: {
    bg: "bg-rose-500/20",
    border: "border-rose-500/50",
    icon: "text-rose-400",
  },
  info: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/50",
    icon: "text-blue-400",
  },
  achievement: {
    bg: "bg-amber-500/20",
    border: "border-amber-500/50",
    icon: "text-amber-400",
  },
  milestone: {
    bg: "bg-purple-500/20",
    border: "border-purple-500/50",
    icon: "text-purple-400",
  },
  evolution: {
    bg: "bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20",
    border: "border-purple-500/50",
    icon: "text-cyan-400",
  },
};

// Global toast state
type ToastListener = (toasts: ToastData[]) => void;
let toasts: ToastData[] = [];
const listeners = new Set<ToastListener>();

function notify() {
  listeners.forEach((listener) => listener([...toasts]));
}

function subscribe(listener: ToastListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Public API for showing toasts
export const toast = {
  show(data: Omit<ToastData, "id">): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newToast: ToastData = { id, duration: 4000, ...data };
    toasts = [...toasts, newToast];
    notify();

    // Auto-dismiss
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, newToast.duration);
    }

    return id;
  },

  success(title: string, message?: string): string {
    return this.show({ type: "success", title, message });
  },

  error(title: string, message?: string): string {
    return this.show({ type: "error", title, message, duration: 6000 });
  },

  info(title: string, message?: string): string {
    return this.show({ type: "info", title, message });
  },

  achievement(title: string, message?: string): string {
    return this.show({ type: "achievement", title, message, duration: 5000 });
  },

  milestone(title: string, message?: string): string {
    return this.show({ type: "milestone", title, message, duration: 5000 });
  },

  evolution(title: string, message?: string): string {
    return this.show({ type: "evolution", title, message, duration: 6000 });
  },

  dismiss(id: string): void {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },

  dismissAll(): void {
    toasts = [];
    notify();
  },
};

// Individual Toast Component
function ToastItem({
  data,
  onDismiss,
}: { data: ToastData; onDismiss: () => void }) {
  const style = toastStyles[data.type];
  const icon = data.icon ?? toastIcons[data.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.4 }}
      className={`relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${style.bg} ${style.border}`}
    >
      {/* Glow effect for special toasts */}
      {(data.type === "achievement" || data.type === "evolution") && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-50 blur-md -z-10"
          style={{
            background:
              data.type === "evolution"
                ? "linear-gradient(to right, rgb(6 182 212 / 0.3), rgb(168 85 247 / 0.3), rgb(236 72 153 / 0.3))"
                : "linear-gradient(to right, rgb(245 158 11 / 0.3), rgb(234 179 8 / 0.3))",
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 ${style.icon}`}>
        {data.type === "evolution" ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            {icon}
          </motion.div>
        ) : data.type === "achievement" ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            {icon}
          </motion.div>
        ) : (
          icon
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white text-sm">{data.title}</h4>
        {data.message && (
          <p className="text-zinc-400 text-xs mt-0.5">{data.message}</p>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar for timed toasts */}
      {data.duration && data.duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-white/30 rounded-b-xl"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: data.duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

// Toast Container Component
export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe(setCurrentToasts);
    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      <AnimatePresence mode="popLayout">
        {currentToasts.map((t) => (
          <ToastItem
            key={t.id}
            data={t}
            onDismiss={() => toast.dismiss(t.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastContainer;
