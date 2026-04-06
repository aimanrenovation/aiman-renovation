"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      nom: (form.elements.namedItem("nom") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      telephone: (form.elements.namedItem("telephone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Server error");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="font-heading text-xl text-white mb-4">
        {t("title")}
      </h2>

      <div className="space-y-1.5">
        <label htmlFor="nom" className="text-sm font-medium text-gray-300">
          {t("label_name")}
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          placeholder={t("placeholder_name")}
          className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000]/50 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-300">
          {t("label_email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={t("placeholder_email")}
          className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000]/50 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="telephone" className="text-sm font-medium text-gray-300">
          {t("label_phone")}
        </label>
        <input
          id="telephone"
          name="telephone"
          type="tel"
          placeholder={t("placeholder_phone")}
          className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000]/50 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium text-gray-300">
          {t("label_message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={t("placeholder_message")}
          className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000]/50 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-[#E50000] hover:bg-[#B80000] text-white font-semibold py-4 text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>

      {status === "success" && (
        <p className="text-green-400 text-sm text-center">
          {t("success")}
        </p>
      )}

      {status === "error" && (
        <p className="text-red-400 text-sm text-center">
          {t("error")}
        </p>
      )}
    </form>
  );
}
