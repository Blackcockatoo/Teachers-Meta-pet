"use client";

import { useStore } from "@/lib/store";
import { useTranslations } from "next-intl";
import {
  RITUALS,
  type RitualId,
  getRemainingCooldown,
  formatCooldown,
} from "@/lib/rituals";
import { KIZUNA_TIERS } from "@/lib/kizuna";
import { useEffect, useState } from "react";

export function RitualGrid() {
  const t = useTranslations("rituals");
  const performRitual = useStore((s) => s.performRitual);
  const canPerformRitual = useStore((s) => s.canPerformRitual);
  const kizunaLevel = useStore((s) => s.kizuna.level);
  const ritualState = useStore((s) => s.rituals);
  const currentSeason = useStore((s) => s.currentSeason);

  // Force re-render every second to update cooldown timers
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePerformRitual = (ritualId: RitualId) => {
    const check = canPerformRitual(ritualId);
    if (!check.canPerform) {
      alert(check.reason);
      return;
    }
    performRitual(ritualId);
  };

  return (
    <div className="shrine-glass">
      <h2 className="text-2xl font-bold mb-6 gradient-text-shrine flex items-center gap-2">
        <span>{t("title")}</span>
        <span className="text-3xl">🎋</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(RITUALS).map((ritual) => {
          const isUnlocked = kizunaLevel >= ritual.unlockLevel;
          const check = canPerformRitual(ritual.id);
          const canPerform = check.canPerform;
          const lastPerformed = ritualState.lastPerformed[ritual.id];
          const remainingCooldown = lastPerformed
            ? getRemainingCooldown(lastPerformed, ritual.cooldownHours)
            : 0;

          // Calculate XP with seasonal bonus
          const baseXP = ritual.baseXP;
          const seasonalMultiplier = currentSeason.breedingBonus || 0;
          const totalXP = Math.round(baseXP * (1 + seasonalMultiplier));

          return (
            <div
              key={ritual.id}
              className={`
                ritual-card relative overflow-hidden
                ${!isUnlocked ? "ritual-locked" : ""}
                ${canPerform ? "ritual-available cursor-pointer hover:shadow-glow-sakura" : "ritual-cooldown"}
              `}
              onClick={() =>
                isUnlocked && canPerform && handlePerformRitual(ritual.id)
              }
            >
              {/* Lock overlay for locked rituals */}
              {!isUnlocked && (
                <div className="absolute inset-0 bg-mononoke-kurogane/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🔒</div>
                    <div className="text-sm text-mononoke-giniro">
                      {t("unlockAt")} {KIZUNA_TIERS[ritual.unlockLevel].nameJP}
                    </div>
                  </div>
                </div>
              )}

              {/* Ritual icon */}
              <div className="ritual-icon text-4xl mb-3">{ritual.icon}</div>

              {/* Ritual name */}
              <div className="ritual-name-jp japanese-text text-lg font-bold text-white mb-1">
                {ritual.nameJP}
              </div>
              <div className="ritual-name-en text-sm text-mononoke-giniro mb-3">
                {ritual.nameEN}
              </div>

              {/* Ritual description */}
              <p className="text-xs text-mononoke-giniro-dark mb-4">
                {ritual.descriptionJP}
              </p>

              {/* XP reward */}
              <div className="flex items-center justify-between mt-auto">
                <div className="ritual-xp-badge">
                  <span className="text-mononoke-kin font-bold">
                    +{totalXP}
                  </span>
                  <span className="text-xs text-mononoke-giniro ml-1">XP</span>
                  {seasonalMultiplier > 0 && (
                    <span className="text-xs text-mononoke-sakura ml-1">
                      (+{Math.round(seasonalMultiplier * 100)}%)
                    </span>
                  )}
                </div>

                {/* Cooldown timer */}
                {isUnlocked && !canPerform && remainingCooldown > 0 && (
                  <div className="text-xs text-mononoke-giniro">
                    {formatCooldown(remainingCooldown)}
                  </div>
                )}

                {/* Available indicator */}
                {isUnlocked && canPerform && (
                  <div className="ritual-ready-indicator animate-pulse">
                    ✨ {t("ready")}
                  </div>
                )}
              </div>

              {/* Completion count */}
              {isUnlocked && (
                <div className="absolute top-2 right-2 text-xs text-mononoke-giniro-dark">
                  {ritualState.completionCount[ritual.id] || 0}×{" "}
                  {t("completed")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Daily completion bonus indicator */}
      {ritualState.consecutiveDays > 0 && (
        <div className="mt-6 p-4 bg-gradient-shrine/10 border border-mononoke-sakura/30 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-sm font-semibold text-white">
                {t("streak")}: {ritualState.consecutiveDays} {t("days")}
              </div>
              <div className="text-xs text-mononoke-giniro">
                {t("streakBonus")}: +{ritualState.consecutiveDays * 5}% XP
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
