"use client";

import { useStore } from "@/lib/store";
import { Heart, Droplet, Battery, Sparkles } from "lucide-react";

export default function CompactVitals() {
  const vitals = useStore((s) => s.vitals);

  const getVitalColor = (value: number) => {
    if (value < 25) return "border-red-500 bg-red-500/10 text-red-400";
    if (value < 50) return "border-orange-500 bg-orange-500/10 text-orange-400";
    if (value < 75) return "border-yellow-500 bg-yellow-500/10 text-yellow-400";
    return "border-green-500 bg-green-500/10 text-green-400";
  };

  const vitalsData = [
    {
      icon: Droplet,
      label: "Full",
      value: Math.round(100 - vitals.hunger),
      color: getVitalColor(100 - vitals.hunger),
    },
    {
      icon: Sparkles,
      label: "Clean",
      value: Math.round(vitals.hygiene),
      color: getVitalColor(vitals.hygiene),
    },
    {
      icon: Battery,
      label: "Energy",
      value: Math.round(vitals.energy),
      color: getVitalColor(vitals.energy),
    },
    {
      icon: Heart,
      label: "Mood",
      value: Math.round(vitals.mood),
      color: getVitalColor(vitals.mood),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {vitalsData.map((vital, index) => {
        const Icon = vital.icon;
        return (
          <div
            key={index}
            className={`flex items-center gap-2 px-3 py-2 rounded-full border ${vital.color} transition-colors`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{vital.label}</span>
            <span className="text-sm font-bold">{vital.value}%</span>
          </div>
        );
      })}
    </div>
  );
}
