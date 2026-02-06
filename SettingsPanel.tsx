"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Volume2,
  VolumeX,
  Music,
  Bell,
  Moon,
  Sun,
  Smartphone,
  Palette,
  X,
  ChevronRight,
  Save,
  RotateCcw,
} from "lucide-react";
import {
  loadAudioSettings,
  updateAudioSettings,
  type AudioSettings,
} from "@/lib/audio";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: React.ReactNode;
  disabled?: boolean;
}

function Slider({
  label,
  value,
  onChange,
  icon,
  disabled = false,
}: SliderProps) {
  return (
    <div className={`space-y-2 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-sm font-mono text-zinc-500">
          {Math.round(value * 100)}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-cyan-500 disabled:cursor-not-allowed"
      />
    </div>
  );
}

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: React.ReactNode;
}

function Toggle({ label, description, checked, onChange, icon }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="text-zinc-400 group-hover:text-cyan-400 transition-colors">
          {icon}
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-zinc-200">{label}</p>
          {description && (
            <p className="text-xs text-zinc-500">{description}</p>
          )}
        </div>
      </div>
      <div
        className={`w-12 h-6 rounded-full transition-colors relative ${
          checked ? "bg-cyan-500" : "bg-slate-600"
        }`}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
          animate={{ left: checked ? "1.5rem" : "0.25rem" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(
    loadAudioSettings(),
  );
  const [notifications, setNotifications] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [batteryMode, setBatteryMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const settings = loadAudioSettings();
    setAudioSettings(settings);

    // Load other settings from localStorage
    if (typeof localStorage !== "undefined") {
      setNotifications(
        localStorage.getItem("metapet-notifications") !== "false",
      );
      setReducedMotion(
        localStorage.getItem("metapet-reduced-motion") === "true",
      );
      setBatteryMode(localStorage.getItem("metapet-battery-mode") === "true");
    }
  }, []);

  const handleAudioChange = (
    key: keyof AudioSettings,
    value: number | boolean,
  ) => {
    const updated = { ...audioSettings, [key]: value };
    setAudioSettings(updated);
    updateAudioSettings({ [key]: value });
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("metapet-notifications", String(notifications));
      localStorage.setItem("metapet-reduced-motion", String(reducedMotion));
      localStorage.setItem("metapet-battery-mode", String(batteryMode));
    }
    setHasChanges(false);
  };

  const handleResetSettings = () => {
    const defaults: AudioSettings = {
      masterVolume: 0.7,
      musicVolume: 0.4,
      sfxVolume: 0.8,
      enabled: true,
    };
    setAudioSettings(defaults);
    updateAudioSettings(defaults);
    setNotifications(true);
    setReducedMotion(false);
    setBatteryMode(false);

    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("metapet-notifications");
      localStorage.removeItem("metapet-reduced-motion");
      localStorage.removeItem("metapet-battery-mode");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-slate-700/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Settings</h2>
                  <p className="text-xs text-zinc-500">
                    Customize your experience
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(85vh-150px)]">
              {/* Audio Section */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Audio
                </h3>

                <div className="space-y-4">
                  <Toggle
                    label="Enable Audio"
                    description="Play sounds and music"
                    checked={audioSettings.enabled}
                    onChange={(checked) =>
                      handleAudioChange("enabled", checked)
                    }
                    icon={
                      audioSettings.enabled ? (
                        <Volume2 className="w-5 h-5" />
                      ) : (
                        <VolumeX className="w-5 h-5" />
                      )
                    }
                  />

                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-4">
                    <Slider
                      label="Master Volume"
                      value={audioSettings.masterVolume}
                      onChange={(v) => handleAudioChange("masterVolume", v)}
                      icon={<Volume2 className="w-4 h-4" />}
                      disabled={!audioSettings.enabled}
                    />
                    <Slider
                      label="Music"
                      value={audioSettings.musicVolume}
                      onChange={(v) => handleAudioChange("musicVolume", v)}
                      icon={<Music className="w-4 h-4" />}
                      disabled={!audioSettings.enabled}
                    />
                    <Slider
                      label="Sound Effects"
                      value={audioSettings.sfxVolume}
                      onChange={(v) => handleAudioChange("sfxVolume", v)}
                      icon={<Bell className="w-4 h-4" />}
                      disabled={!audioSettings.enabled}
                    />
                  </div>
                </div>
              </div>

              {/* Display Section */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Display
                </h3>

                <div className="space-y-3">
                  <Toggle
                    label="Reduced Motion"
                    description="Minimize animations for accessibility"
                    checked={reducedMotion}
                    onChange={setReducedMotion}
                    icon={<Moon className="w-5 h-5" />}
                  />
                  <Toggle
                    label="Battery Saver Mode"
                    description="Reduce visual effects to save power"
                    checked={batteryMode}
                    onChange={setBatteryMode}
                    icon={<Smartphone className="w-5 h-5" />}
                  />
                </div>
              </div>

              {/* Notifications Section */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </h3>

                <div className="space-y-3">
                  <Toggle
                    label="In-App Notifications"
                    description="Show achievement and milestone popups"
                    checked={notifications}
                    onChange={setNotifications}
                    icon={<Bell className="w-5 h-5" />}
                  />
                </div>
              </div>

              {/* About Section */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">
                  About
                </h3>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-sm text-zinc-400 space-y-2">
                  <p className="flex justify-between">
                    <span>Version</span>
                    <span className="text-zinc-300">0.1.0</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Build</span>
                    <span className="text-zinc-300 font-mono">2024.12.29</span>
                  </p>
                  <p className="text-xs text-zinc-600 mt-2">
                    Meta-Pet: Digital Companion Experience
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/50 flex items-center justify-between gap-3">
              <button
                onClick={handleResetSettings}
                className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSaveSettings();
                    onClose();
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Settings button component for easy integration
export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 text-zinc-400 hover:text-white transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-5 h-5" />
      </motion.button>
      <SettingsPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default SettingsPanel;
