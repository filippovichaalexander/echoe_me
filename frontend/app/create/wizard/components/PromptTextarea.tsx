"use client";

import React from "react";

export interface PromptTextareaProps {
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  recommendedMin?: number;
  disabled?: boolean;
  placeholder?: string;
  onEnter?: () => void;
}

export function PromptTextarea({
  value,
  onChange,
  maxLength,
  recommendedMin,
  disabled,
  placeholder,
  onEnter,
}: PromptTextareaProps) {
  const len = value.length;
  const counterColor =
    len > maxLength ? "text-red-400" : recommendedMin && len >= recommendedMin ? "text-green-400" : "text-yellow-400";

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const raw = e.target.value;
    const next = raw.length > maxLength ? raw.slice(0, maxLength) : raw;
    onChange(next);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (onEnter && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <>
      <div className="relative">
        <textarea
          placeholder={placeholder}
          rows={4}
          className="w-full bg-gray-900 rounded-lg px-4 py-3 pr-16 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 disabled:opacity-60 disabled:pointer-events-none resize-y min-h-[6rem]"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <span className={`text-xs tabular-nums ${counterColor}`}>{len}/{maxLength}</span>
        </div>
      </div>
      {typeof recommendedMin === "number" && (
        <p className="text-xs text-gray-500">
          Рекомендуем написать не менее {recommendedMin} символов (не обязательное требование). Не более {maxLength} символов.
        </p>
      )}
    </>
  );
}

