"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
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

      if (!res.ok) throw new Error("Erreur serveur");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="font-heading text-xl text-white mb-4">
        ENVOYEZ-NOUS UN MESSAGE
      </h2>

      <div className="space-y-1.5">
        <label htmlFor="nom" className="text-sm font-medium text-gray-300">
          Nom
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          placeholder="Votre nom"
          className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000]/50 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="votre@email.com"
          className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000]/50 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="telephone" className="text-sm font-medium text-gray-300">
          T&eacute;l&eacute;phone
        </label>
        <input
          id="telephone"
          name="telephone"
          type="tel"
          placeholder="06 00 00 00 00"
          className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000]/50 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium text-gray-300">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="D&eacute;crivez votre projet..."
          className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000]/50 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-[#E50000] hover:bg-[#B80000] text-white font-semibold py-4 text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === "sending" ? "Envoi en cours..." : "Envoyer le message"}
      </button>

      {status === "success" && (
        <p className="text-green-400 text-sm text-center">
          Message envoy&eacute; avec succ&egrave;s ! Nous vous r&eacute;pondrons sous 4 jours.
        </p>
      )}

      {status === "error" && (
        <p className="text-red-400 text-sm text-center">
          Une erreur est survenue. Veuillez r&eacute;essayer ou nous appeler directement.
        </p>
      )}
    </form>
  );
}
