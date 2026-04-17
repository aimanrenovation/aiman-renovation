"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChatBubble } from "./chat-bubble";
import { ChatWindow } from "./chat-window";
import {
  getAssistant,
  isBusinessHours,
  type ChatAssistant,
} from "@/lib/chat/assistants";

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
  const [assistant, setAssistant] = useState<ChatAssistant | null>(null);
  const [online, setOnline] = useState(false);
  const visitorId = useRef("");

  useEffect(() => {
    visitorId.current = getVisitorId();
    setAssistant(getAssistant(visitorId.current));
    setOnline(isBusinessHours());
    // Re-check every minute
    const interval = setInterval(() => setOnline(isBusinessHours()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setHidden(window.location.pathname.startsWith("/espace-employes"));
  }, []);

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0 && assistant) {
      setMessages([
        {
          role: "assistant",
          content: `Bonjour ! 👋 Je suis ${assistant.name} d'AIMAN RENOVATION. Comment puis-je vous aider ?`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [open, messages.length, assistant]);

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
            { role: "assistant", content: data.message, timestamp: Date.now() },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Désolé, je rencontre un problème technique. Appelez-nous au 06 33 49 69 25.",
              timestamp: Date.now(),
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Connexion perdue. Réessayez dans un instant.",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, conversationId],
  );

  if (hidden || !assistant) return null;

  return (
    <>
      <ChatBubble open={open} onClick={() => setOpen(!open)} />
      {open && (
        <ChatWindow
          messages={messages}
          loading={loading}
          cta={cta}
          assistantName={assistant.name}
          assistantTitle={assistant.title}
          assistantPhoto={assistant.photo}
          online={online}
          onSend={sendMessage}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
