"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  assistantName: string;
  assistantPhoto: string;
  onSend: (text: string) => void;
  onClose: () => void;
}

function TypingIndicator() {
  return (
    <div className="mr-8 flex w-fit items-center gap-1 rounded-2xl bg-gray-100 px-4 py-3 text-gray-500">
      <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
      <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
      <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
    </div>
  );
}

const CTA_CONFIG: Record<string, { label: string; href: string; external?: boolean }> = {
  calculateur: { label: "Estimer mon budget →", href: "/devis" },
  devis: { label: "Demander un devis gratuit →", href: "/devis" },
  rdv: { label: "Prendre rendez-vous →", href: "/devis" },
  appel: { label: "Appeler maintenant", href: "tel:+33633496925", external: true },
};

export function ChatWindow({
  messages,
  loading,
  cta,
  assistantName,
  assistantPhoto,
  onSend,
  onClose,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Prevent scroll propagation to body
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const atTop = scrollTop <= 0 && e.deltaY < 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
    if (atTop || atBottom) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
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

  const ctaInfo = cta ? CTA_CONFIG[cta] : null;

  return (
    <div
      className="fixed bottom-20 right-6 z-50 flex h-[500px] w-80 flex-col overflow-hidden overscroll-contain rounded-2xl border border-gray-200 bg-white shadow-2xl max-md:inset-x-4 max-md:right-auto max-md:w-auto max-md:bottom-20"
      style={{ animation: "slideUp 0.3s ease-out" }}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
    >
      {/* Header with assistant photo */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-[#E50000] to-[#B80000] px-4 py-3 text-white">
        <img
          src={assistantPhoto}
          alt={assistantName}
          width={36}
          height={36}
          className="h-9 w-9 rounded-full border-2 border-white/30 object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-tight">{assistantName} · AIMAN</p>
          <p className="text-xs opacity-80">En ligne</p>
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

      {/* Messages — isolated scroll */}
      <div
        ref={messagesContainerRef}
        className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-4"
        style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
      >
        {messages.map((msg) => (
          <div
            key={msg.timestamp + msg.role}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={[
                "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "user" ? "ml-8 bg-[#E50000] text-white" : "mr-8 bg-gray-100 text-gray-900",
              ].join(" ")}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && <TypingIndicator />}

        {/* CTA — only shown when API says so (after qualification) */}
        {ctaInfo && !loading && (
          <div className="flex justify-start">
            {ctaInfo.external ? (
              <a
                href={ctaInfo.href}
                className="inline-block rounded-xl bg-[#E50000] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#CC0000]"
              >
                {ctaInfo.label}
              </a>
            ) : (
              <Link
                href={ctaInfo.href}
                className="inline-block rounded-xl bg-[#E50000] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#CC0000]"
              >
                {ctaInfo.label}
              </Link>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-gray-200 bg-white px-3 py-2">
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
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E50000] text-white transition hover:bg-[#CC0000] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
