"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { apiClient } from "@/lib/api/client";

export interface ChatMessage {
  id: string;
  role: "user" | "avatar";
  text: string;
  timestamp?: string;
}

interface ChatHistoryMessage {
  id: string;
  timestamp: string;
  prompt: string | undefined;
  response: string | undefined;
}

/** Тип создания: история чата в UI фильтруется по этой сущности. Все сообщения по-прежнему сохраняются в аватаре. */
export interface AvatarChatSidebarProps {
  creationType?: string | null;
}

export default function AvatarChatSidebar({ creationType }: AvatarChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const params = new URLSearchParams({ limit: "50" });
      if (creationType) params.set("creation_type", creationType);
      const data = await apiClient.get<{ messages: ChatHistoryMessage[] }>(
        `/api/avatar/chat/history?${params.toString()}`
      );
      const list: ChatMessage[] = [];
      for (const m of data.messages || []) {
        if (m.prompt) {
          list.push({
            id: `${m.id}-user`,
            role: "user",
            text: m.prompt,
            timestamp: m.timestamp,
          });
        }
        if (m.response) {
          list.push({
            id: `${m.id}-avatar`,
            role: "avatar",
            text: m.response,
            timestamp: m.timestamp,
          });
        }
      }
      setMessages(list);
    } catch {
      setMessages([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [creationType]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const data = await apiClient.post<{ response: string }>("/api/avatar/chat", {
        message: text,
        ...(creationType ? { creation_type: creationType } : {}),
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `avatar-${Date.now()}`,
          role: "avatar",
          text: data.response,
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка отправки");
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="flex flex-col h-full bg-gray-800/80 border-r border-gray-700/50">
      <div className="p-4 border-b border-gray-700/50">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span aria-hidden>🎭</span>
          Чат с аватаром
        </h2>
        <p className="text-gray-400 text-xs mt-1">
          {creationType
            ? `История только по «${creationType}». Все диалоги сохраняются в аватаре.`
            : "Запросы и ответы сохраняются и учитываются аватаром"}
        </p>
      </div>
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        {loadingHistory ? (
          <p className="text-gray-500 text-sm">Загрузка истории…</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {creationType
              ? `Чат по «${creationType}». Напиши — аватар запомнит для всех своих ответов.`
              : "Напиши что-нибудь — аватар запомнит и будет учитывать в создании музыки."}
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700/80 text-gray-100 border border-gray-600/50"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t border-gray-700/50">
        {error && (
          <p className="text-red-400 text-xs mb-2">{error}</p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Сообщение аватару…"
            className="flex-1 min-w-0 bg-gray-900 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            disabled={loading}
          />
          <button
            type="button"
            onClick={send}
            disabled={loading || !input.trim()}
            className="rounded-xl px-4 py-2.5 text-sm font-medium bg-purple-600 hover:bg-purple-500 transition disabled:opacity-50"
          >
            {loading ? "…" : "Отправить"}
          </button>
        </div>
      </div>
    </aside>
  );
}
