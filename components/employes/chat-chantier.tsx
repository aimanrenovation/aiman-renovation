"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

function playNotificationBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 660;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
    osc.onended = () => ctx.close();
  } catch {
    // AudioContext not available
  }
}

interface Message {
  id: string;
  chantierId: string;
  employeId: string;
  contenu: string;
  lu: boolean;
  createdAt: string;
  expediteurPrenom: string;
  expediteurNom: string;
}

interface ChatChantierProps {
  chantierId: string;
  chantierNom: string;
  currentEmployeId: string;
  initialMessages: Message[];
}

function formatHeure(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function formatDateSeparator(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();
  if (d.toDateString() === today) return "Aujourd'hui";
  if (d.toDateString() === yesterday) return "Hier";
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

export function ChatChantier({
  chantierId,
  chantierNom,
  currentEmployeId,
  initialMessages,
}: ChatChantierProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto-scroll on mount and new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Poll every 10 seconds
  const prevCountRef = useRef(messages.length);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/employes/messages?chantier_id=${chantierId}`);
        if (res.ok) {
          const data = (await res.json()) as { messages: Message[] };
          const fresh = data.messages.map((m) => ({
            ...m,
            createdAt: typeof m.createdAt === "string" ? m.createdAt : new Date(m.createdAt).toISOString(),
          }));

          // Detect new messages from other users
          if (fresh.length > prevCountRef.current) {
            const newest = fresh[fresh.length - 1];
            if (newest && newest.employeId !== currentEmployeId) {
              playNotificationBeep();
              if (typeof navigator !== "undefined" && navigator.vibrate) {
                navigator.vibrate(100);
              }
              if (document.hidden) {
                const originalTitle = document.title;
                document.title = "\uD83D\uDCAC Nouveau message \u2014 Aiman \u00C9quipe";
                const onVisible = () => {
                  if (!document.hidden) {
                    document.title = originalTitle;
                    document.removeEventListener("visibilitychange", onVisible);
                  }
                };
                document.addEventListener("visibilitychange", onVisible);
              }
            }
          }
          prevCountRef.current = fresh.length;
          setMessages(fresh);
        }
      } catch {
        // silently ignore polling errors
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [chantierId, currentEmployeId]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/employes/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chantier_id: chantierId, contenu: trimmed }),
      });
      if (res.ok) {
        setText("");
        // Fetch fresh messages
        const listRes = await fetch(`/api/employes/messages?chantier_id=${chantierId}`);
        if (listRes.ok) {
          const data = (await listRes.json()) as { messages: Message[] };
          setMessages(data.messages.map((m) => ({
            ...m,
            createdAt: typeof m.createdAt === "string" ? m.createdAt : new Date(m.createdAt).toISOString(),
          })));
        }
        inputRef.current?.focus();
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  // Group messages by date for separators
  const grouped: { date: string; msgs: Message[] }[] = [];
  for (const m of messages) {
    const dateKey = new Date(m.createdAt).toDateString();
    const last = grouped[grouped.length - 1];
    if (last && last.date === dateKey) {
      last.msgs.push(m);
    } else {
      grouped.push({ date: dateKey, msgs: [m] });
    }
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 8rem)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-3">
        <Link
          href="/espace-employes/messages"
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-600 transition-colors active:bg-neutral-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="truncate text-base font-bold">{chantierNom}</h1>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-3">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-neutral-400">
            Pas encore de message. Commencez la conversation !
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {grouped.map((group) => (
              <div key={group.date}>
                <div className="my-2 text-center text-[10px] font-medium uppercase text-neutral-400">
                  {formatDateSeparator(group.msgs[0].createdAt)}
                </div>
                {group.msgs.map((m) => {
                  const isMine = m.employeId === currentEmployeId;
                  return (
                    <div
                      key={m.id}
                      className={`mb-2 flex flex-col ${isMine ? "items-end" : "items-start"}`}
                    >
                      {!isMine && (
                        <span className="mb-0.5 text-[10px] font-medium text-neutral-500">
                          {m.expediteurPrenom} {m.expediteurNom.charAt(0)}.
                        </span>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                          isMine
                            ? "bg-[#E50000] text-white"
                            : "bg-neutral-100 text-neutral-900"
                        }`}
                      >
                        {m.contenu}
                      </div>
                      <span className="mt-0.5 text-[10px] text-neutral-400">
                        {formatHeure(m.createdAt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        className="mt-2 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Votre message..."
          className="flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-neutral-400"
          disabled={sending}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E50000] text-white transition-opacity disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
