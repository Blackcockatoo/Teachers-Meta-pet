"use client";

import { useStore } from "@/lib/store";
import { useTranslations } from "next-intl";
import {
  KIZUNA_TIERS,
  getLevelProgress,
  getXPForNextLevel,
  formatKizunaXP,
} from "@/lib/kizuna";
import { KizunaMandala } from "./KizunaMandala";

export function KizunaPanel() {
  const t = useTranslations("kizuna");
  const kizuna = useStore((s) => s.kizuna);
  const tier = KIZUNA_TIERS[kizuna.level];
  const progress = getLevelProgress(kizuna);
  const nextLevelXP = getXPForNextLevel(kizuna.level);

  return (
    <div className="shrine-glass">
      <h2 className="text-2xl font-bold mb-6 gradient-text-shrine flex items-center gap-2">
        <span>{t("title")}</span>
        <span className="text-3xl">{tier.icon}</span>
      </h2>

      <div className="kizuna-level-card mb-6">
        <div className="kizuna-icon">{tier.icon}</div>
        <div className="kizuna-name-jp japanese-text">{tier.nameJP}</div>
        <div className="kizuna-name-en">{tier.nameEN}</div>

        <p className="text-sm text-mononoke-giniro mt-4">
          {tier.descriptionJP}
        </p>

        {/* Progress bar */}
        {kizuna.level < 7 && (
          <div className="mt-6">
            <div className="kizuna-progress-bar">
              <div
                className="kizuna-progress-fill"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="text-mononoke-giniro">
                {formatKizunaXP(kizuna.xp, "ja")} XP
              </span>
              <span className="text-mononoke-giniro-dark">
                {formatKizunaXP(nextLevelXP, "ja")} XP
              </span>
            </div>
          </div>
        )}

        {kizuna.level === 7 && (
          <div className="mt-4 text-mononoke-kin text-sm font-semibold">
            ★ {t("levels.7.nameEn")} ★
          </div>
        )}
      </div>

      {/* 7-pointed mandala visualization */}
      <div className="flex justify-center">
        <KizunaMandala level={kizuna.level} />
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-mononoke-kurogane/30 p-3 rounded-lg">
          <div className="text-mononoke-giniro-dark">{t("progress")}</div>
          <div className="text-white font-bold text-lg">
            Level {kizuna.level} / 7
          </div>
        </div>
        <div className="bg-mononoke-kurogane/30 p-3 rounded-lg">
          <div className="text-mononoke-giniro-dark">Total Rituals</div>
          <div className="text-white font-bold text-lg">
            {kizuna.totalRitualsPerformed}
          </div>
        </div>
      </div>
    </div>
  );
}
