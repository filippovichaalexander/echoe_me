"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { UserTier } from "@/lib/api/types";

type NoteId = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";

interface NoteOption {
  id: NoteId;
  label: string;
}

type FamilyId =
  | "maj_min"
  | "pentatonic"
  | "blues"
  | "church"
  | "exotic_core"
  | "exotic_extended";

interface VariationOption {
  id: string;
  label: string;
}

interface FamilyOption {
  id: FamilyId;
  label: string;
  variations: VariationOption[];
  disabled?: boolean;
}

interface TierConfig {
  notes: NoteOption[];
  families: FamilyOption[];
}

const NOTES_FREE: NoteOption[] = [
  { id: "C", label: "C (До)" },
  { id: "D", label: "D (Ре)" },
  { id: "E", label: "E (Ми)" },
  { id: "F", label: "F (Фа)" },
  { id: "G", label: "G (Соль)" },
  { id: "A", label: "A (Ля)" },
  { id: "B", label: "B (Си)" },
];

const NOTES_ALL: NoteOption[] = [
  { id: "C", label: "C (До)" },
  { id: "C#", label: "C# (До#)" },
  { id: "D", label: "D (Ре)" },
  { id: "D#", label: "D# (Ре#)" },
  { id: "E", label: "E (Ми)" },
  { id: "F", label: "F (Фа)" },
  { id: "F#", label: "F# (Фа#)" },
  { id: "G", label: "G (Соль)" },
  { id: "G#", label: "G# (Соль#)" },
  { id: "A", label: "A (Ля)" },
  { id: "A#", label: "A# (Ля#)" },
  { id: "B", label: "B (Си)" },
];

const TIER_CONFIG: Record<UserTier, TierConfig> = {
  free: {
    notes: NOTES_FREE,
    families: [
      {
        id: "maj_min",
        label: "Мажор / Минор (доступно в более высоком тарифе)",
        disabled: true,
        variations: [
          { id: "major", label: "Мажор" },
          { id: "minor", label: "Минор" },
        ],
      },
      {
        id: "pentatonic",
        label: "Пентатоника",
        variations: [
          { id: "pent_major", label: "Мажорная" },
          { id: "pent_minor", label: "Минорная" },
        ],
      },
      {
        id: "blues",
        label: "Блюзовая",
        variations: [
          { id: "blues_major", label: "Мажорная" },
          { id: "blues_minor", label: "Минорная" },
        ],
      },
    ],
  },
  premium: {
    notes: NOTES_ALL,
    families: [
      {
        id: "maj_min",
        label: "Мажор / Минор",
        variations: [
          { id: "major", label: "Мажор" },
          { id: "minor", label: "Минор" },
        ],
      },
      {
        id: "pentatonic",
        label: "Пентатоника",
        variations: [
          { id: "pent_major", label: "Мажорная" },
          { id: "pent_minor", label: "Минорная" },
        ],
      },
      {
        id: "blues",
        label: "Блюзовая",
        variations: [
          { id: "blues_major", label: "Мажорная" },
          { id: "blues_minor", label: "Минорная" },
        ],
      },
      {
        id: "church",
        label: "Церковные лады",
        variations: [
          { id: "dorian", label: "Дорийский" },
          { id: "phrygian", label: "Фригийский" },
          { id: "lydian", label: "Лидийский" },
        ],
      },
      {
        id: "exotic_core",
        label: "Экзотика",
        variations: [
          { id: "hungarian_minor", label: "Венгерская" },
          { id: "wholetone", label: "Целотонная" },
          { id: "hirajoshi", label: "Хираджоши" },
        ],
      },
    ],
  },
  pro: {
    notes: NOTES_ALL,
    families: [
      {
        id: "maj_min",
        label: "Мажор / Минор",
        variations: [
          { id: "major", label: "Мажор" },
          { id: "minor", label: "Минор" },
        ],
      },
      {
        id: "pentatonic",
        label: "Пентатоника",
        variations: [
          { id: "pent_major", label: "Мажорная пентатоника" },
          { id: "pent_minor", label: "Минорная пентатоника" },
        ],
      },
      {
        id: "blues",
        label: "Блюзовая",
        variations: [
          { id: "blues_major", label: "Мажорная блюзовая" },
          { id: "blues_minor", label: "Минорная блюзовая" },
        ],
      },
      {
        id: "church",
        label: "Церковные лады",
        variations: [
          { id: "ionian", label: "Ионийский" },
          { id: "dorian", label: "Дорийский" },
          { id: "phrygian", label: "Фригийский" },
          { id: "lydian", label: "Лидийский" },
          { id: "mixolydian", label: "Миксолидийский" },
          { id: "aeolian", label: "Эолийский" },
          { id: "locrian", label: "Локрийский" },
        ],
      },
      {
        id: "exotic_extended",
        label: "Экзотика",
        variations: [
          { id: "hungarian_minor", label: "Венгерская минорная" },
          { id: "wholetone", label: "Целотонная" },
          { id: "dim_half_whole", label: "Уменьшенная (half‑whole)" },
          { id: "dim_whole_half", label: "Уменьшенная (whole‑half)" },
          { id: "hirajoshi", label: "Хираджоши" },
          { id: "kumoi", label: "Кумои" },
          { id: "iwato", label: "Ивато" },
        ],
      },
    ],
  },
};

function encodeSelection(note: NoteId, family: FamilyId, variationId: string): string {
  return `${note}|${family}|${variationId}`;
}

function decodeSelection(value: string | undefined | null): {
  note?: NoteId;
  family?: FamilyId;
  variation?: string;
} {
  if (!value) return {};
  const [note, family, variation] = value.split("|");
  return {
    note: note as NoteId | undefined,
    family: family as FamilyId | undefined,
    variation,
  };
}

export interface KeySelectorProps {
  tier: UserTier;
  value: string;
  onChange: (value: string) => void;
}

export function KeySelector({ tier, value, onChange }: KeySelectorProps) {
  const config = TIER_CONFIG[tier];

  const initial = useMemo(() => decodeSelection(value), [value]);

  const [note, setNote] = useState<NoteId>(initial.note && config.notes.some((n) => n.id === initial.note) ? initial.note : config.notes[0].id);
  const [family, setFamily] = useState<FamilyId>(
    initial.family && config.families.some((f) => f.id === initial.family) ? initial.family : config.families[0].id,
  );

  const currentFamily = config.families.find((f) => f.id === family) ?? config.families[0];
  const [variation, setVariation] = useState<string>(
    initial.variation && currentFamily.variations.some((v) => v.id === initial.variation)
      ? initial.variation
      : currentFamily.variations[0]?.id ?? "",
  );

  useEffect(() => {
    const enc = encodeSelection(note, family, variation);
    if (enc !== value) onChange(enc);
  }, [note, family, variation, value, onChange]);

  useEffect(() => {
    const decoded = decodeSelection(value);
    if (!decoded.note && !decoded.family && !decoded.variation) return;
    if (decoded.note && config.notes.some((n) => n.id === decoded.note)) {
      setNote(decoded.note);
    }
    if (decoded.family && config.families.some((f) => f.id === decoded.family)) {
      setFamily(decoded.family);
    }
    const fam = config.families.find((f) => f.id === (decoded.family as FamilyId)) ?? config.families[0];
    if (decoded.variation && fam.variations.some((v) => v.id === decoded.variation)) {
      setVariation(decoded.variation);
    }
  }, [value, config]);

  useEffect(() => {
    const fam = config.families.find((f) => f.id === family) ?? config.families[0];
    if (!fam.variations.some((v) => v.id === variation)) {
      setVariation(fam.variations[0]?.id ?? "");
    }
  }, [family, config.families, variation]);

  const [familyMenuOpen, setFamilyMenuOpen] = useState(false);
  const [hoverFamilyId, setHoverFamilyId] = useState<FamilyId | null>(null);

  const activeFamily = useMemo(
    () => config.families.find((f) => f.id === (hoverFamilyId ?? family)) ?? currentFamily,
    [config.families, currentFamily, family, hoverFamilyId],
  );

  const currentVariationLabel = currentFamily.variations.find((v) => v.id === variation)?.label ?? "";

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 min-w-[140px]">
          <p className="text-xs text-gray-500 mb-1">Основная нота</p>
          <select
            value={note}
            onChange={(e) => setNote(e.target.value as NoteId)}
            className="w-full bg-gray-900 rounded-lg px-3 py-2 text-sm text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {config.notes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <p className="text-xs text-gray-500 mb-1">{tier === "free" ? "Тип" : "Семейство / тип"}</p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setFamilyMenuOpen((o) => !o)}
              className="w-full bg-gray-900 rounded-lg px-3 py-2 text-sm text-white border border-gray-700 flex items-center justify-between gap-2 hover:border-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <span className="truncate">
                {currentFamily.label}
                {currentVariationLabel && ` · ${currentVariationLabel}`}
              </span>
              <span className="text-gray-500 text-xs">▼</span>
            </button>
            {familyMenuOpen && (
              <div className="absolute z-20 mt-1 w-full sm:w-[28rem] bg-gray-900 border border-gray-800 rounded-xl shadow-xl flex text-sm">
                <div className="w-1/2 border-r border-gray-800 max-h-60 overflow-auto">
                  {config.families.map((f) => {
                    const isDisabled = !!f.disabled;
                    const isActive = f.id === family;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        disabled={isDisabled}
                        onMouseEnter={() => !isDisabled && setHoverFamilyId(f.id)}
                        onFocus={() => !isDisabled && setHoverFamilyId(f.id)}
                        onClick={() => {
                          if (isDisabled) return;
                          setFamily(f.id);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center gap-2 ${
                          isDisabled
                            ? "text-gray-600 cursor-not-allowed"
                            : isActive
                            ? "bg-gray-800 text-white"
                            : "text-gray-300 hover:bg-gray-800/80"
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-purple-500/60" />
                        <span className="truncate">{f.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="w-1/2 max-h-60 overflow-auto">
                  {activeFamily.variations.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-gray-500">Нет доступных вариаций для этого типа.</p>
                  ) : (
                    activeFamily.variations.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setFamily(activeFamily.id);
                          setVariation(v.id);
                          setFamilyMenuOpen(false);
                          setHoverFamilyId(null);
                        }}
                        className={`w-full text-left px-3 py-2 ${
                          v.id === variation && activeFamily.id === family
                            ? "bg-purple-600/30 text-white"
                            : "text-gray-300 hover:bg-gray-800/80"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Выбрано: <span className="text-gray-300">{note}</span>,{" "}
        <span className="text-gray-300">{currentFamily.label}</span>,{" "}
        {currentFamily.variations.find((v) => v.id === variation)?.label ?? ""}
      </p>
    </div>
  );
}

