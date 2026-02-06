"use client";

import { useStore } from "@/lib/store";
import AuraliaMetaPet from "./AuraliaMetaPet";
import { PetSprite } from "./PetSprite";
import { Heart, Droplet, Battery, Sparkles } from "lucide-react";

export default function CompanionHome() {
  const petType = useStore((s) => s.petType);
  const vitals = useStore((s) => s.vitals);
  const evolution = useStore((s) => s.evolution);
  const genome = useStore((s) => s.genome);
  const traits = useStore((s) => s.traits);

  const getVitalColor = (value: number) => {
    if (value < 25) return "text-red-500";
    if (value < 50) return "text-orange-500";
    if (value < 75) return "text-yellow-500";
    return "text-green-500";
  };

  const getVitalBgColor = (value: number) => {
    if (value < 25) return "bg-red-500";
    if (value < 50) return "bg-orange-500";
    if (value < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-20">
      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Pet Display */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 mb-6">
          <div className="flex flex-col items-center">
            {/* Evolution Stage Badge */}
            <div className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
              <span className="text-sm font-medium text-blue-300">
                {evolution.state} • Level {evolution.level}
              </span>
            </div>

            {/* Pet Visual */}
            <div className="w-full max-w-md mb-6">
              {petType === "auralia" ? (
                <div className="aspect-square">
                  <AuraliaMetaPet />
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center">
                  <PetSprite />
                </div>
              )}
            </div>

            {/* Companion Name/Title */}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {petType === "auralia"
                ? "Auralia Companion"
                : "Geometric Companion"}
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              {evolution.totalInteractions} interactions •{" "}
              {Math.floor(
                (Date.now() - evolution.birthTime) / (1000 * 60 * 60),
              )}
              h old
            </p>
          </div>
        </div>

        {/* Compact Vitals */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Vitals</h3>
          <div className="space-y-4">
            {/* Hunger */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Droplet
                  className={`w-5 h-5 ${getVitalColor(100 - vitals.hunger)}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-300">
                    Fullness
                  </span>
                  <span
                    className={`text-sm font-bold ${getVitalColor(100 - vitals.hunger)}`}
                  >
                    {Math.round(100 - vitals.hunger)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getVitalBgColor(100 - vitals.hunger)}`}
                    style={{ width: `${100 - vitals.hunger}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Hygiene */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Sparkles
                  className={`w-5 h-5 ${getVitalColor(vitals.hygiene)}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-300">
                    Hygiene
                  </span>
                  <span
                    className={`text-sm font-bold ${getVitalColor(vitals.hygiene)}`}
                  >
                    {Math.round(vitals.hygiene)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getVitalBgColor(vitals.hygiene)}`}
                    style={{ width: `${vitals.hygiene}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Energy */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Battery
                  className={`w-5 h-5 ${getVitalColor(vitals.energy)}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-300">
                    Energy
                  </span>
                  <span
                    className={`text-sm font-bold ${getVitalColor(vitals.energy)}`}
                  >
                    {Math.round(vitals.energy)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getVitalBgColor(vitals.energy)}`}
                    style={{ width: `${vitals.energy}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Mood */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Heart className={`w-5 h-5 ${getVitalColor(vitals.mood)}`} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-300">
                    Mood
                  </span>
                  <span
                    className={`text-sm font-bold ${getVitalColor(vitals.mood)}`}
                  >
                    {Math.round(vitals.mood)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getVitalBgColor(vitals.mood)}`}
                    style={{ width: `${vitals.mood}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => useStore.getState().feed()}
              className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              Feed
            </button>
            <button
              onClick={() => useStore.getState().clean()}
              className="px-6 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors"
            >
              Clean
            </button>
            <button
              onClick={() => useStore.getState().play()}
              className="px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
            >
              Play
            </button>
            <button
              onClick={() => useStore.getState().sleep()}
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Sleep
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
