"use client";

interface Explanation {
  decision?: Record<string, unknown>;
  context?: Record<string, unknown>;
  sources?: unknown[];
  confidence?: number;
}

export default function ExplanationView({ explanation }: { explanation: Explanation }) {
  return (
    <div className="rounded-xl bg-gray-800 border border-gray-700 p-4 text-sm">
      <h4 className="font-medium mb-2">Почему такая музыка</h4>
      {explanation.confidence !== undefined && (
        <p className="text-gray-400 mb-2">Уверенность: {(explanation.confidence * 100).toFixed(0)}%</p>
      )}
      {explanation.sources && explanation.sources.length > 0 ? (
        <ul className="list-disc pl-4 text-gray-300">
          {explanation.sources.map((s, i) => (
            <li key={i}>{JSON.stringify(s)}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">Объяснение на основе правил и истории.</p>
      )}
    </div>
  );
}
