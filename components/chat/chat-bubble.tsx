"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

interface ChatBubbleProps {
  open: boolean;
  onClick: () => void;
}

export function ChatBubble({ open, onClick }: ChatBubbleProps) {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Fermer le chat" : "Ouvrir le chat"}
      className={[
        "fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-[#E50000] text-white shadow-lg transition-all duration-300 hover:bg-[#CC0000] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E50000] focus-visible:ring-offset-2",
        "h-14 w-14 md:h-14 md:w-14 h-12 w-12",
        pulse && !open ? "animate-pulse" : "",
      ]
        .join(" ")
        .trim()}
    >
      {open ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
    </button>
  );
}
