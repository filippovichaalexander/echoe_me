"use client";

import {
  STYLE_OPTIONS,
  INSTRUMENTS_OPTIONS,
  MOOD_OPTIONS,
  TAGS_VISIBLE_COUNT,
} from "@/lib/data/musicTags";

export type TagCategory = "style" | "instruments" | "mood";

const POOLS: Record<TagCategory, string[]> = {
  style: STYLE_OPTIONS,
  instruments: INSTRUMENTS_OPTIONS,
  mood: MOOD_OPTIONS,
};

const LABELS: Record<TagCategory, string> = {
  style: "Стиль",
  instruments: "Инструменты",
  mood: "Настроение",
};

function getVisibleOptions(pool: string[], selected: string[], count: number): string[] {
  const available = pool.filter((t) => !selected.includes(t));
  return available.slice(0, count);
}

interface TagBlockProps {
  category: TagCategory;
  selected: string[];
  onSelect: (tag: string) => void;
}

function TagBlock({ category, selected, onSelect }: TagBlockProps) {
  const pool = POOLS[category];
  const visible = getVisibleOptions(pool, selected, TAGS_VISIBLE_COUNT);

  return (
    <div>
      <span className="block text-sm font-medium text-gray-400 mb-2">{LABELS[category]}</span>
      <div className="flex flex-wrap gap-2">
        {visible.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onSelect(tag)}
            className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm transition"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export interface SelectedTags {
  style: string[];
  instruments: string[];
  mood: string[];
}

interface MusicTagSelectorProps {
  selected: SelectedTags;
  onSelect: (category: TagCategory, tag: string) => void;
  onRemove: (category: TagCategory, tag: string) => void;
}

export function MusicTagSelector({ selected, onSelect, onRemove }: MusicTagSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TagBlock
          category="style"
          selected={selected.style}
          onSelect={(tag) => onSelect("style", tag)}
        />
        <TagBlock
          category="instruments"
          selected={selected.instruments}
          onSelect={(tag) => onSelect("instruments", tag)}
        />
        <TagBlock
          category="mood"
          selected={selected.mood}
          onSelect={(tag) => onSelect("mood", tag)}
        />
      </div>

      {(selected.style.length > 0 || selected.instruments.length > 0 || selected.mood.length > 0) && (
        <div>
          <span className="block text-sm font-medium text-gray-400 mb-2">Выбранные теги</span>
          <div className="flex flex-wrap gap-2">
            {selected.style.map((tag) => (
              <span
                key={`style-${tag}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-900/50 text-purple-200 text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onRemove("style", tag)}
                  className="hover:text-white"
                  aria-label={`Убрать ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
            {selected.instruments.map((tag) => (
              <span
                key={`instruments-${tag}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-900/50 text-amber-200 text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onRemove("instruments", tag)}
                  className="hover:text-white"
                  aria-label={`Убрать ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
            {selected.mood.map((tag) => (
              <span
                key={`mood-${tag}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-900/50 text-cyan-200 text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onRemove("mood", tag)}
                  className="hover:text-white"
                  aria-label={`Убрать ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
