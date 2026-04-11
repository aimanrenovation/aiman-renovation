"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  cta: string | null;
  onSend: (text: string) => void;
  onClose: () => void;
}

function TypingIndicator() {
  return (
    <div className="mr-8 flex items-center gap-1 rounded-2xl bg-gray-100 px-4 py-3 text-gray-500 w-fit">
      <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
      <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
      <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
    </div>
  );
}

export function ChatWindow({
  messages,
  loading,
  cta,
  onSend,
  onClose,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div
      className="fixed bottom-20 right-6 z-50 flex h-[500px] w-80 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl max-md:inset-x-4 max-md:right-auto max-md:w-auto max-md:bottom-20"
      style={{ animation: "slideUp 0.3s ease-out" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#E50000] to-[#B80000] px-4 py-3 text-white">
        <div>
          <p className="text-sm font-bold leading-tight">AIMAN RENOVATION</p>
          <p className="text-xs opacity-90">Assistant en ligne</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le chat"
          className="rounded-full p-1 transition hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.timestamp + msg.role}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          >
            <div
              className={[
                "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "user"
                  ? "ml-8 bg-[#E50000] text-white"
                  : "mr-8 bg-gray-100 text-gray-900",
              ].join(" ")}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && <TypingIndicator />}

        {/* CTA */}
        {cta === "devis" && !loading && (
          <div className="flex justify-start" style={{ animation: "fadeIn 0.2s ease-out" }}>
            <Link
              href="/devis"
              className="inline-block rounded-xl bg-[#E50000] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#CC0000]"
            >
              Demander un devis gratuit &rarr;
            </Link>
          </div>
        )}
        {cta === "appel" && !loading && (
          <div className="flex justify-start" style={{ animation: "fadeIn 0.2s ease-out" }}>
            <a
              href="tel:+33633496925"
              className="inline-block rounded-xl bg-[#E50000] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#CC0000]"
            >
              Appeler maintenant
            </a>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t border-gray-200 bg-white px-3 py-2"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Votre message..."
          rows={1}
          className="flex-1 resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#E50000] focus:outline-none focus:ring-1 focus:ring-[#E50000]"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          aria-label="Envoyer"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E50000] text-white transition hover:bg-[#CC0000] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
