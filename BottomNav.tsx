"use client";

import { Home, Gamepad2, MoreHorizontal } from "lucide-react";

export type NavTab = "home" | "activities" | "more";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    {
      id: "home" as NavTab,
      label: "Home",
      icon: Home,
    },
    {
      id: "activities" as NavTab,
      label: "Activities",
      icon: Gamepad2,
    },
    {
      id: "more" as NavTab,
      label: "More",
      icon: MoreHorizontal,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-40">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 py-3 px-6 transition-colors ${
                  isActive
                    ? "text-cyan-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${isActive ? "text-cyan-400" : ""}`}
                />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
