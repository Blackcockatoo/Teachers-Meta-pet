"use client";

import { motion } from "framer-motion";
import type { Dream, ThemeVariant } from "@metapet/core/dreamjournal/types";
import { getArchetypeIcon } from "@metapet/core/dreamjournal/archetypes";
import { isResidueExpired } from "@metapet/core/dreamjournal/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DreamCardProps {
  dream: Dream;
  theme: ThemeVariant;
}

export function DreamCard({ dream, theme }: DreamCardProps) {
  const archetypeIcon = getArchetypeIcon(dream.archetype, theme);
  const themeClass =
    theme === "mononoke-garden" ? "border-pink-500/20" : "border-purple-500/20";

  // Format timestamp
  const dreamDate = new Date(dream.timestamp);
  const dateStr = dreamDate.toLocaleDateString();
  const timeStr = dreamDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Check if residue is still active
  const hasActiveResidue = dream.residue && !isResidueExpired(dream.residue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${themeClass} bg-zinc-900/40 backdrop-blur border`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl" title={dream.archetype}>
                {archetypeIcon}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  {dream.archetype}
                </h3>
                <p className="text-xs text-zinc-400">
                  {dateStr} at {timeStr}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Dream narrative */}
          <p className="text-sm text-zinc-300 leading-relaxed italic">
            {dream.narrative}
          </p>

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {dream.emotionSnapshot}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {dream.evolutionStageSnapshot}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Vitals: {dream.vitalAverageSnapshot}%
            </Badge>

            {/* Active residue indicator */}
            {hasActiveResidue && dream.residue && (
              <Badge
                variant="default"
                className="text-xs bg-amber-600/20 text-amber-400 border-amber-600/30"
              >
                {dream.residue.name}
              </Badge>
            )}

            {/* Personality drift indicator (MYTHIC) */}
            {dream.personalityDriftApplied && (
              <Badge
                variant="default"
                className="text-xs bg-purple-600/20 text-purple-400 border-purple-600/30"
              >
                Drift: {dream.personalityDriftApplied.axis}
                {dream.personalityDriftApplied.direction > 0 ? " +" : " −"}
                {dream.personalityDriftApplied.magnitude}
              </Badge>
            )}
          </div>

          {/* Keywords */}
          {dream.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-zinc-800">
              {dream.keywords.map((keyword, i) => (
                <span key={i} className="text-xs text-zinc-500">
                  #{keyword}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
