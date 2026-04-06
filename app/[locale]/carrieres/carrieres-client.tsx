"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Mail, Phone, MapPin, Briefcase, Sparkles, Heart, TrendingUp,
  Send, X, Loader2, CheckCircle, Upload, FileText, Globe, Link2,
} from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { COMPANY } from "@/lib/constants";

const VALUE_ICONS = [Heart, Sparkles, TrendingUp, Briefcase];

interface Position {
  title: string;
  type: string;
  description: string;
  requirements: string[];
}

function ApplyModal({
  open, onClose, defaultPosition, positions,
}: {
  open: boolean;
  onClose: () => void;
  defaultPosition: string;
  positions: Position[];
}) {
  const t = useTranslations("carrieres.form");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch("/api/carrieres", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("error_generic"));
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error_generic"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-bold text-lg">{t("title")}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">{t("success_title")}</h3>
            <p className="text-gray-400 text-sm mb-6">{t("success_message")}</p>
            <button
              onClick={onClose}
              className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {t("close")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Position */}
            <div>
              <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                {t("position_label")} *
              </label>
              <select
                name="position"
                required
                defaultValue={defaultPosition}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#E50000] text-sm"
              >
                {positions.map((p) => (
                  <option key={p.title} value={p.title} className="bg-[#111]">
                    {p.title}
                  </option>
                ))}
                <option value={t("spontaneous_option")} className="bg-[#111]">
                  {t("spontaneous_option")}
                </option>
              </select>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                  {t("firstname_label")} *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#E50000] text-sm"
                />
              </div>
              <div>
                <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                  {t("lastname_label")} *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#E50000] text-sm"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                  {t("email_label")} *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#E50000] text-sm"
                />
              </div>
              <div>
                <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                  {t("phone_label")} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#E50000] text-sm"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                {t("experience_label")}
              </label>
              <input
                type="text"
                name="experience"
                placeholder={t("experience_placeholder")}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#E50000] text-sm placeholder:text-white/30"
              />
            </div>

            {/* Files */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                  <FileText className="w-3.5 h-3.5 inline mr-1" />
                  {t("cv_label")}
                </label>
                <input
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-xs text-gray-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#E50000]/15 file:text-[#E50000] hover:file:bg-[#E50000]/25 file:cursor-pointer cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                  <Upload className="w-3.5 h-3.5 inline mr-1" />
                  {t("motivation_label")}
                </label>
                <input
                  type="file"
                  name="motivation"
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-xs text-gray-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#E50000]/15 file:text-[#E50000] hover:file:bg-[#E50000]/25 file:cursor-pointer cursor-pointer"
                />
              </div>
            </div>
            <p className="text-gray-500 text-xs">{t("files_hint")}</p>

            {/* Social networks */}
            <div className="space-y-3 pt-2">
              <p className="text-white/70 text-xs uppercase tracking-wider">{t("social_label")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="url"
                    name="linkedin"
                    placeholder="LinkedIn"
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-[#E50000] text-sm placeholder:text-white/30"
                  />
                </div>
                <div className="relative">
                  <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="url"
                    name="facebook"
                    placeholder="Facebook"
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-[#E50000] text-sm placeholder:text-white/30"
                  />
                </div>
                <div className="relative">
                  <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="url"
                    name="instagram"
                    placeholder="Instagram"
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-[#E50000] text-sm placeholder:text-white/30"
                  />
                </div>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="url"
                    name="website"
                    placeholder={t("website_placeholder")}
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-[#E50000] text-sm placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                {t("message_label")}
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder={t("message_placeholder")}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#E50000] text-sm placeholder:text-white/30 resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#E50000] hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t("submit")}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CarrieresClient() {
  const t = useTranslations("carrieres");
  const positions = t.raw("positions") as Position[];
  const values = t.raw("values") as Array<{ title: string; description: string }>;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  function openModal(position?: string) {
    setSelectedPosition(position || positions[0]?.title || "");
    setModalOpen(true);
  }

  return (
    <main className="bg-black text-white">
      {/* Hero with team image */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/equipe-recrutement.jpg"
            alt={t("hero_image_alt")}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-32 w-full">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E50000]/20 border border-[#E50000]/40 text-[#E50000] text-xs font-semibold tracking-wider uppercase mb-6">
              {t("badge")}
            </span>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
              {t("hero_title_line1")}
              <br />
              <span className="text-[#E50000]">{t("hero_title_line2")}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
              {t("hero_subtitle")}
            </p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 bg-[#E50000] hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base"
            >
              <Send className="w-5 h-5" />
              {t("hero_cta")}
            </button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl mb-4">
              {t("why_title")} <span className="text-[#E50000]">{t("why_title_highlight")}</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t("why_subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = VALUE_ICONS[i] ?? Briefcase;
              return (
                <div
                  key={i}
                  className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-[#E50000]/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E50000]/15 border border-[#E50000]/30 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#E50000]" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl mb-4">
              {t("positions_title")}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t("positions_subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positions.map((pos, i) => (
              <div
                key={i}
                className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-[#E50000]/40 transition-colors flex flex-col"
              >
                <div className="mb-4">
                  <h3 className="text-white font-bold text-lg md:text-xl mb-2">{pos.title}</h3>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium">
                    {pos.type}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-1">{pos.description}</p>
                <ul className="space-y-1.5 mb-5">
                  {pos.requirements.map((req, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-[#E50000] mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openModal(pos.title)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#E50000] hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                >
                  <Send className="w-4 h-4" />
                  {t("apply_button")}
                </button>
              </div>
            ))}
          </div>

          {/* Spontaneous */}
          <div className="mt-12 bg-gradient-to-br from-[#E50000]/10 to-[#E50000]/5 border border-[#E50000]/30 rounded-2xl p-8 text-center">
            <h3 className="text-white font-bold text-xl md:text-2xl mb-3">
              {t("spontaneous_title")}
            </h3>
            <p className="text-gray-300 text-sm mb-6 max-w-2xl mx-auto">{t("spontaneous_text")}</p>
            <button
              onClick={() => openModal(t("spontaneous_option"))}
              className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm"
            >
              <Send className="w-4 h-4" />
              {t("spontaneous_cta")}
            </button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl mb-4">{t("contact_title")}</h2>
          <p className="text-gray-400 mb-12">{t("contact_subtitle")}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={`mailto:${COMPANY.email}`}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-[#E50000]/40 transition-colors group"
            >
              <Mail className="w-6 h-6 text-[#E50000] mx-auto mb-3" />
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("contact_email_label")}</p>
              <p className="text-white text-sm font-medium group-hover:text-[#E50000] transition-colors break-all">
                {COMPANY.email}
              </p>
            </a>
            <a
              href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-[#E50000]/40 transition-colors group"
            >
              <Phone className="w-6 h-6 text-[#E50000] mx-auto mb-3" />
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("contact_phone_label")}</p>
              <p className="text-white text-sm font-medium group-hover:text-[#E50000] transition-colors">
                {COMPANY.mobile}
              </p>
            </a>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <MapPin className="w-6 h-6 text-[#E50000] mx-auto mb-3" />
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("contact_location_label")}</p>
              <p className="text-white text-sm font-medium">{COMPANY.city}</p>
            </div>
          </div>

          <div className="mt-12">
            <LinkButton
              href="/contact"
              size="lg"
              className="bg-transparent border border-white/20 text-white hover:bg-white/10"
            >
              {t("contact_more")}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <ApplyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultPosition={selectedPosition}
        positions={positions}
      />
    </main>
  );
}
