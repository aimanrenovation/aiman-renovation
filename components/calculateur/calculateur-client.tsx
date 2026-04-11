"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import prixData from "@/lib/calculateur-prix.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type TypeTravaux = (typeof prixData.types)[number];
type Option = TypeTravaux["options"][number];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function calcOptionPrice(
  opt: Option,
  surface: number,
): { bas: number; haut: number; qty: number } {
  const qty =
    opt.unite === "forfait" || opt.unite === "unite" ? 1 : surface;
  return { bas: opt.prix_bas * qty, haut: opt.prix_haut * qty, qty };
}

function formatEuro(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function CalculateurClient() {
  const t = useTranslations("calculateur");

  /* State */
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<TypeTravaux | null>(null);
  const [surface, setSurface] = useState(10);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(),
  );
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  /* Direction for slide animation */
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [animKey, setAnimKey] = useState(0);

  /* Navigate steps */
  const goTo = useCallback(
    (next: number) => {
      setDirection(next > step ? "left" : "right");
      setAnimKey((k) => k + 1);
      setStep(next);
    },
    [step],
  );

  /* When type is selected, initialize surface + default options */
  const selectType = useCallback(
    (type: TypeTravaux) => {
      setSelectedType(type);
      setSurface(type.surface_default);
      setSelectedOptions(
        new Set(type.options.filter((o) => o.defaut).map((o) => o.id)),
      );
      goTo(1);
    },
    [goTo],
  );

  /* Toggle option */
  const toggleOption = useCallback((id: string) => {
    setSelectedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /* Compute totals */
  const { totalBas, totalHaut, breakdown } = useMemo(() => {
    if (!selectedType)
      return { totalBas: 0, totalHaut: 0, breakdown: [] as any[] };
    const rows = selectedType.options
      .filter((o) => selectedOptions.has(o.id))
      .map((o) => {
        const { bas, haut, qty } = calcOptionPrice(o, surface);
        return { id: o.id, unite: o.unite, qty, bas, haut };
      });
    return {
      totalBas: rows.reduce((s, r) => s + r.bas, 0),
      totalHaut: rows.reduce((s, r) => s + r.haut, 0),
      breakdown: rows,
    };
  }, [selectedType, selectedOptions, surface]);

  /* Submit form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    setSubmitting(true);
    setError(false);
    try {
      const body = {
        source: "calculateur",
        type_travaux: selectedType.id,
        surface,
        options: Array.from(selectedOptions),
        estimation_basse: totalBas,
        estimation_haute: totalHaut,
        nom: formData.nom,
        telephone: formData.telephone,
        email: formData.email,
        adresse: formData.adresse,
      };
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("fail");
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  /* Fade-in on mount */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* ---------------------------------------------------------------- */
  /*  Slide wrapper                                                    */
  /* ---------------------------------------------------------------- */
  const slideClass =
    direction === "left"
      ? "animate-slideInRight"
      : "animate-slideInLeft";

  return (
    <section
      className={`min-h-screen bg-black px-4 py-16 text-white transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
    >
      <div className="mx-auto max-w-4xl">
        {/* Progress bar */}
        <div className="mb-10">
          <p className="mb-2 text-center text-sm text-white/50">
            {t("step_label", { current: step + 1, total: 4 })}
          </p>
          <div className="mx-auto h-1 max-w-md overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#E50000] to-[#a10000] transition-all duration-500"
              style={{ width: `${((step + 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/*  STEP 0 — Type Selection                                     */}
        {/* ============================================================ */}
        {step === 0 && (
          <div key={`step0-${animKey}`} className={slideClass}>
            <h1 className="mb-2 text-center text-3xl font-bold md:text-4xl">
              {t("step0_title")}
            </h1>
            <p className="mb-10 text-center text-white/50">
              {t("step0_subtitle")}
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {prixData.types.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => selectType(type)}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur transition-all duration-200 hover:scale-105 hover:border-[#E50000]/40 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(229,0,0,0.15)]"
                >
                  <span className="block text-4xl">{type.icon}</span>
                  <span className="mt-3 block text-lg font-semibold">
                    {t(`type_${type.id}` as any)}
                  </span>
                  <span className="mt-1 block text-sm text-white/40">
                    {t(`type_${type.id}_desc` as any)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  STEP 1 — Details                                            */}
        {/* ============================================================ */}
        {step === 1 && selectedType && (
          <div key={`step1-${animKey}`} className={slideClass}>
            <button
              type="button"
              onClick={() => goTo(0)}
              className="mb-6 flex items-center gap-1 text-sm text-white/50 transition hover:text-white"
            >
              <span>&larr;</span> {t("back")}
            </button>

            {/* Badge */}
            <div className="mb-8 flex items-center gap-3">
              <span className="text-3xl">{selectedType.icon}</span>
              <h2 className="text-2xl font-bold">
                {t(`type_${selectedType.id}` as any)}
              </h2>
            </div>

            {/* Surface slider */}
            <div className="mb-8">
              <label className="mb-2 block text-sm font-medium text-white/70">
                {t("surface")}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={selectedType.surface_min}
                  max={selectedType.surface_max}
                  value={surface}
                  onChange={(e) => setSurface(Number(e.target.value))}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-[#E50000] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E50000]"
                />
                <span className="min-w-[4rem] rounded-xl bg-white/10 px-3 py-1.5 text-center text-lg font-bold">
                  {surface} {t("surface_unit")}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-xs text-white/30">
                <span>{selectedType.surface_min} {t("surface_unit")}</span>
                <span>{selectedType.surface_max} {t("surface_unit")}</span>
              </div>
            </div>

            {/* Options */}
            <div className="mb-8">
              <h3 className="mb-4 text-sm font-medium text-white/70">
                {t("options_title")}
              </h3>
              <div className="space-y-2">
                {selectedType.options.map((opt) => {
                  const uniteLabel =
                    opt.unite === "m2" || opt.unite === "ml"
                      ? t(`option_per_${opt.unite === "m2" ? "m2" : "ml"}` as any)
                      : t("option_forfait");
                  return (
                    <label
                      key={opt.id}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOptions.has(opt.id)}
                        onChange={() => toggleOption(opt.id)}
                        className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#E50000]"
                      />
                      <span className="flex-1 font-medium">
                        {t(`opt_${opt.id}` as any)}
                      </span>
                      <span className="text-sm text-white/40">
                        {t("option_from")} {opt.prix_bas}&euro; {uniteLabel}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => goTo(2)}
              disabled={selectedOptions.size === 0}
              className="w-full rounded-xl bg-gradient-to-r from-[#E50000] to-[#a10000] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-40"
            >
              {t("next")} &rarr;
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/*  STEP 2 — Estimation                                         */}
        {/* ============================================================ */}
        {step === 2 && selectedType && (
          <div key={`step2-${animKey}`} className={slideClass}>
            <button
              type="button"
              onClick={() => goTo(1)}
              className="mb-6 flex items-center gap-1 text-sm text-white/50 transition hover:text-white"
            >
              <span>&larr;</span> {t("back")}
            </button>

            <h2 className="mb-1 text-2xl font-bold">{t("step2_title")}</h2>
            <p className="mb-6 text-white/50">
              {t(`type_${selectedType.id}` as any)} &mdash; {surface}{" "}
              {t("surface_unit")}
            </p>

            {/* Breakdown table */}
            <div className="mb-6 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-white/50">
                    <th className="px-4 py-3 font-medium">{t("table_option")}</th>
                    <th className="px-4 py-3 font-medium text-right">
                      {t("table_quantity")}
                    </th>
                    <th className="px-4 py-3 font-medium text-right">
                      {t("table_low")}
                    </th>
                    <th className="px-4 py-3 font-medium text-right">
                      {t("table_high")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                    >
                      <td className="px-4 py-3 font-medium">
                        {t(`opt_${row.id}` as any)}
                      </td>
                      <td className="px-4 py-3 text-right text-white/60">
                        {row.qty}{" "}
                        {row.unite === "forfait" || row.unite === "unite"
                          ? ""
                          : row.unite}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatEuro(row.bas)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatEuro(row.haut)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total bar */}
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-900/60 to-emerald-800/40 p-6 text-center">
              <p className="mb-1 text-sm font-medium uppercase tracking-wider text-emerald-300/70">
                {t("total_range")}
              </p>
              <p className="text-3xl font-bold md:text-4xl">
                {formatEuro(totalBas)}{" "}
                <span className="text-white/40">&rarr;</span>{" "}
                {formatEuro(totalHaut)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => goTo(3)}
              className="w-full rounded-xl bg-gradient-to-r from-[#E50000] to-[#a10000] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:shadow-xl"
            >
              {t("cta_devis")} &rarr;
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/*  STEP 3 — Contact Form                                       */}
        {/* ============================================================ */}
        {step === 3 && selectedType && (
          <div key={`step3-${animKey}`} className={slideClass}>
            <button
              type="button"
              onClick={() => goTo(2)}
              className="mb-6 flex items-center gap-1 text-sm text-white/50 transition hover:text-white"
            >
              <span>&larr;</span> {t("back")}
            </button>

            {/* Success state */}
            {submitted ? (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-5xl text-emerald-400 animate-bounce">
                  &#10003;
                </div>
                <h2 className="mb-2 text-2xl font-bold">
                  {t("success_title")}
                </h2>
                <p className="text-white/60">{t("success_message")}</p>
              </div>
            ) : (
              <>
                <h2 className="mb-1 text-2xl font-bold">{t("step3_title")}</h2>
                <p className="mb-6 text-white/50">{t("step3_subtitle")}</p>

                {/* Mini summary */}
                <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedType.icon}</span>
                      <span className="font-semibold">
                        {t(`type_${selectedType.id}` as any)}
                      </span>
                      <span className="text-white/40">
                        {surface} {t("surface_unit")}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-400">
                      {formatEuro(totalBas)} &mdash; {formatEuro(totalHaut)}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/70">
                      {t("form_nom")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) =>
                        setFormData((d) => ({ ...d, nom: e.target.value }))
                      }
                      placeholder={t("form_nom_placeholder")}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#E50000]/50 focus:outline-none focus:ring-1 focus:ring-[#E50000]/30"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/70">
                      {t("form_telephone")} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telephone}
                      onChange={(e) =>
                        setFormData((d) => ({
                          ...d,
                          telephone: e.target.value,
                        }))
                      }
                      placeholder={t("form_telephone_placeholder")}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#E50000]/50 focus:outline-none focus:ring-1 focus:ring-[#E50000]/30"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/70">
                      {t("form_email")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((d) => ({ ...d, email: e.target.value }))
                      }
                      placeholder={t("form_email_placeholder")}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#E50000]/50 focus:outline-none focus:ring-1 focus:ring-[#E50000]/30"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/70">
                      {t("form_adresse")}
                    </label>
                    <input
                      type="text"
                      value={formData.adresse}
                      onChange={(e) =>
                        setFormData((d) => ({
                          ...d,
                          adresse: e.target.value,
                        }))
                      }
                      placeholder={t("form_adresse_placeholder")}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#E50000]/50 focus:outline-none focus:ring-1 focus:ring-[#E50000]/30"
                    />
                  </div>

                  {error && (
                    <p className="rounded-xl bg-red-900/30 px-4 py-2 text-sm text-red-300">
                      {t("error_message")}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-gradient-to-r from-[#E50000] to-[#a10000] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
                  >
                    {submitting ? t("form_submitting") : t("form_submit")}
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>

      {/* Slide animations via inline style tag */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out both; }
        .animate-slideInLeft  { animation: slideInLeft  0.3s ease-out both; }
      `}</style>
    </section>
  );
}
