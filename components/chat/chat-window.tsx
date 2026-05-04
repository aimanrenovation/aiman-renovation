"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Send, X } from "lucide-react";
import Link from "next/link";
import { RdvBookingForm } from "./rdv-booking-form";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface Qualification {
  type_travaux?: string | null;
  surface?: string | null;
  localisation?: string | null;
  [key: string]: string | null | undefined;
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  cta: string | null;
  qualification: Qualification | null;
  conversationId: string | null;
  assistantName: string;
  assistantTitle: string;
  assistantPhoto: string;
  online: boolean;
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

// CTAs that resolve to a link (rdv is handled separately via inline booking form)
const CTA_LINK_CONFIG: Record<
  string,
  { label: string; href: string; external?: boolean }
> = {
  calculateur: { label: "Estimer mon budget →", href: "/devis" },
  devis: { label: "Demander un devis gratuit →", href: "/devis" },
  appel: {
    label: "Appeler maintenant",
    href: "tel:+33633496925",
    external: true,
  },
};

export function ChatWindow({
  messages,
  loading,
  cta,
  qualification,
  conversationId,
  assistantName,
  assistantTitle,
  assistantPhoto,
  online,
  onSend,
  onClose,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [showRdvForm, setShowRdvForm] = useState(false);
  const [rdvDone, setRdvDone] = useState(false);

  // Frontend guard: only open the RDV widget when cta === "rdv" AND all 3 qualification
  // fields are present. This is a safety net in case the API guard is bypassed.
  const qualComplete =
    !!qualification?.type_travaux &&
    !!qualification?.surface &&
    !!qualification?.localisation;

  useEffect(() => {
    if (cta === "rdv" && qualComplete && !rdvDone) {
      setShowRdvForm(true);
    }
  }, [cta, qualComplete, rdvDone]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatRootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ========== SCROLL ISOLATION (non-passive listeners) ==========
  useEffect(() => {
    const root = chatRootRef.current;
    const container = messagesContainerRef.current;
    if (!root || !container) return;

    // Block wheel scroll from leaking to body
    function onWheel(e: WheelEvent) {
      const { scrollTop, scrollHeight, clientHeight } = container!;
      const atTop = scrollTop <= 0 && e.deltaY < 0;
      const atBottom =
        scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atBottom) {
        e.preventDefault();
      }
      e.stopPropagation();
    }

    // Block touch scroll from leaking to body
    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      const { scrollTop, scrollHeight, clientHeight } = container!;
      const deltaY = touchStartY - e.touches[0].clientY;
      const atTop = scrollTop <= 0 && deltaY < 0;
      const atBottom =
        scrollTop + clientHeight >= scrollHeight - 1 && deltaY > 0;
      if (atTop || atBottom) {
        e.preventDefault();
      }
      e.stopPropagation();
    }

    // Prevent body scroll when chat is open
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = origOverflow;
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
    };
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

  const ctaInfo = cta && cta !== "rdv" ? CTA_LINK_CONFIG[cta] : null;

  return (
    <div
      ref={chatRootRef}
      className="fixed bottom-36 right-6 z-50 flex h-[450px] w-80 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl max-md:inset-x-4 max-md:right-auto max-md:bottom-36 max-md:h-[400px] max-md:w-auto"
      style={{ animation: "slideUp 0.3s ease-out" }}
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
          <p className="text-sm font-bold leading-tight">{assistantName}</p>
          <p className="truncate text-[10px] opacity-70">
            {assistantTitle} · AIMAN RENOVATION
          </p>
          <div className="mt-0.5 flex items-center gap-1">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${online ? "bg-green-400" : "bg-gray-400"}`}
            />
            <span className="text-[10px] opacity-70">
              {online ? "En ligne" : "Hors ligne"}
            </span>
          </div>
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

      {/* Messages — fully isolated scroll */}
      <div
        ref={messagesContainerRef}
        className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
        style={{
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.timestamp + msg.role}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
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

        {/* Standard CTAs (calculateur, devis, appel) */}
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

        {/* Inline booking form */}
        {showRdvForm && !rdvDone && (
          <div className="mr-2">
            <RdvBookingForm
              conversationId={conversationId}
              sujet={
                messages
                  .filter((m) => m.role === "user")
                  .map((m) => m.content)
                  .slice(-1)[0]
              }
              onSuccess={({ date, heure }) => {
                setShowRdvForm(false);
                setRdvDone(true);
                const dateLabel = new Intl.DateTimeFormat("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }).format(new Date(`${date}T12:00:00`));
                onSend(
                  `__rdv_confirmed__:${dateLabel} à ${String(heure).padStart(2, "0")}h00`,
                );
              }}
              onCancel={() => setShowRdvForm(false)}
            />
          </div>
        )}

        {rdvDone && (
          <div className="mr-2 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-800">
            ✓ Rendez-vous confirmé — un email vous a été envoyé.
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
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E50000] text-white transition hover:bg-[#CC0000] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

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
      `}</style>
    </div>
  );
}
