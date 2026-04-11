"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChatBubble } from "./chat-bubble";
import { ChatWindow } from "./chat-window";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("chat_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("chat_visitor_id", id);
  }
  return id;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [cta, setCta] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const visitorId = useRef("");

  useEffect(() => {
    visitorId.current = getVisitorId();
  }, []);

  // Hide on /espace-employes pages
  useEffect(() => {
    setHidden(window.location.pathname.startsWith("/espace-employes"));
  }, []);

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Bonjour ! \u{1F44B} Je suis l'assistant AIMAN RENOVATION. Comment puis-je vous aider ? R\u00e9novation salle de bain, cuisine, fa\u00e7ade, peinture... je suis l\u00e0 pour r\u00e9pondre \u00e0 vos questions !",
          timestamp: Date.now(),
        },
      ]);
    }
  }, [open, messages.length]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: Message = {
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: visitorId.current,
            message: text.trim(),
            conversationId,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setConversationId(data.conversationId);
          setCta(data.cta);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.message,
              timestamp: Date.now(),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "D\u00e9sol\u00e9, je rencontre un probl\u00e8me technique. Vous pouvez nous appeler au 06 33 49 69 25 ou remplir le formulaire sur /devis.",
              timestamp: Date.now(),
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Connexion perdue. R\u00e9essayez dans un instant.",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, conversationId],
  );

  if (hidden) return null;

  return (
    <>
      <ChatBubble open={open} onClick={() => setOpen(!open)} />
      {open && (
        <ChatWindow
          messages={messages}
          loading={loading}
          cta={cta}
          onSend={sendMessage}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
