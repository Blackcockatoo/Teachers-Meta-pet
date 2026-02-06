"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { DreamArchetype } from "@metapet/core/dreamjournal/types";
import { DreamCard } from "./DreamCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Moon } from "lucide-react";

const DREAMS_PER_PAGE = 10;

const ARCHETYPES: DreamArchetype[] = [
  "The Shadow",
  "The Anima/Animus",
  "The Hero's Journey",
  "The Collective Unconscious",
  "The Trickster",
  "The Observer",
];

export function DreamJournalPanel() {
  const { dreamJournal, appConfig, filterDreams } = useStore();
  const [selectedArchetype, setSelectedArchetype] = useState<
    DreamArchetype | "all"
  >("all");
  const [currentPage, setCurrentPage] = useState(0);

  // Filter dreams
  const filteredDreams =
    selectedArchetype === "all"
      ? dreamJournal.dreams
      : filterDreams(selectedArchetype);

  // Paginate
  const totalPages = Math.ceil(filteredDreams.length / DREAMS_PER_PAGE);
  const paginatedDreams = filteredDreams.slice(
    currentPage * DREAMS_PER_PAGE,
    (currentPage + 1) * DREAMS_PER_PAGE,
  );

  // Reset to page 0 when filter changes
  const handleFilterChange = (value: string) => {
    setSelectedArchetype(value as DreamArchetype | "all");
    setCurrentPage(0);
  };

  // Empty state
  if (dreamJournal.dreams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Moon className="w-16 h-16 text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-300 mb-2">
          No Dreams Yet
        </h3>
        <p className="text-sm text-zinc-500 max-w-md">
          Your companion will dream when they sleep. Dreams are generated{" "}
          {appConfig.dreams.frequency === "daily" ? "daily" : "weekly"}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Moon className="w-6 h-6" />
            Dream Journal
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            {dreamJournal.totalDreams} dream
            {dreamJournal.totalDreams !== 1 ? "s" : ""} recorded
            {" • "}
            {filteredDreams.length} shown
          </p>
        </div>

        {/* Filter by archetype */}
        <Select value={selectedArchetype} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Dreams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dreams</SelectItem>
            {ARCHETYPES.map((archetype) => (
              <SelectItem key={archetype} value={archetype}>
                {archetype}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active dream residue notice */}
      {dreamJournal.activeDreamResidue && (
        <div className="bg-amber-600/10 border border-amber-600/30 rounded-lg p-4">
          <p className="text-sm text-amber-400">
            <strong>Active Dream Residue:</strong>{" "}
            {dreamJournal.activeDreamResidue.name}
            {" — "}
            {dreamJournal.activeDreamResidue.description}
          </p>
        </div>
      )}

      {/* Dream grid */}
      {filteredDreams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-zinc-500">
            No dreams found for {selectedArchetype}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {paginatedDreams.map((dream) => (
            <DreamCard
              key={dream.id}
              dream={dream}
              theme={appConfig.dreams.theme}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-sm text-zinc-400 px-4">
            Page {currentPage + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Tier upgrade prompt for FREE users */}
      {appConfig.tier === "free" && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 text-center">
          <p className="text-sm text-zinc-400 mb-2">
            Free tier: Weekly dreams with basic detail (max 10 entries)
          </p>
          <p className="text-xs text-zinc-500">
            Upgrade to Premium for daily detailed dreams, or Mythic for
            personality drift
          </p>
        </div>
      )}
    </div>
  );
}
