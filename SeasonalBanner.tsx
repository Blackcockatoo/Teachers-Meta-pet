"use client";

import { useStore } from "@/lib/store";
import { useTranslations } from "next-intl";
import { SakuraParticles } from "./SakuraParticles";

export function SeasonalBanner() {
  const t = useTranslations("seasons");
  const currentSeason = useStore((s) => s.currentSeason);

  // Show sakura particles during Spring (Risshun)
  const showSakura = currentSeason.id === "risshun";

  return (
    <div className="seasonal-banner relative overflow-hidden">
      {/* Sakura particles for Spring season */}
      {showSakura && <SakuraParticles count={15} />}

      <div className="relative z-10 flex items-center justify-between">
        {/* Left side: Season info */}
        <div className="flex items-center gap-4">
          <div className="seasonal-icon text-5xl">{currentSeason.icon}</div>

          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold japanese-text text-white">
                {currentSeason.nameJP}
              </h3>
              <span className="text-lg text-mononoke-giniro">
                {currentSeason.nameEN}
              </span>
            </div>

            <p className="text-sm text-mononoke-giniro mt-1">
              {currentSeason.descriptionJP}
            </p>
          </div>
        </div>

        {/* Right side: Seasonal bonus */}
        {currentSeason.breedingBonus && currentSeason.breedingBonus > 0 && (
          <div className="seasonal-bonus-card">
            <div className="text-xs text-mononoke-giniro-dark uppercase tracking-wider">
              {t("breedingBonus")}
            </div>
            <div className="text-2xl font-bold gradient-text-shrine">
              +{Math.round(currentSeason.breedingBonus * 100)}%
            </div>
            <div className="text-xs text-mononoke-sakura">
              {t("breedingXP")}
            </div>
          </div>
        )}
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-shrine opacity-10 pointer-events-none" />
    </div>
  );
}
