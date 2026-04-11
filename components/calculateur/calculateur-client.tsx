"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import prixData from "@/lib/calculateur-prix.json";
import {
  ArrowLeft, ArrowRight, Check, Send, Zap, Ruler,
} from "lucide-react";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type TypeTravaux = (typeof prixData.types)[number];
type Option = TypeTravaux["options"][number] & {
  group?: string;
  points_default?: number;
  points_min?: number;
  points_max?: number;
};

/* ------------------------------------------------------------------ */
/*  Icons map                                                          */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  Geo pricing                                                        */
/* ------------------------------------------------------------------ */
type GeoZone = "FR" | "DE" | "CH";
const GEO_CONFIG: Record<GeoZone, { flag: string; mult: number; devise: string; label: string }> = {
  FR: { flag: "🇫🇷", mult: 1, devise: "EUR", label: "France" },
  DE: { flag: "🇩🇪", mult: 2, devise: "EUR", label: "Deutschland" },
  CH: { flag: "🇨🇭", mult: 3, devise: "CHF", label: "Schweiz" },
};

const typeImage = (id: string) => `/images/calculateur/${id}.webp`;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function calcPrice(opt: Option, surface: number, pts: number) {
  const qty = opt.unite === "forfait" || opt.unite === "unite" ? 1
    : opt.unite === "point" ? pts : surface;
  return { bas: opt.prix_bas * qty, haut: opt.prix_haut * qty, qty };
}

function formatPrice(n: number, devise: string = "EUR") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: devise, maximumFractionDigits: 0 }).format(n);
}

/* Animated counter */
function AnimatedCounter({ target, className, devise = "EUR" }: { target: number; className?: string; devise?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    const start = ref.current;
    const diff = target - start;
    if (diff === 0) return;
    const duration = 600;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setVal(current);
      if (progress < 1) requestAnimationFrame(tick);
      else ref.current = target;
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <span className={className}>{formatPrice(val, devise)}</span>;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function CalculateurClient() {
  const t = useTranslations("calculateur");

  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<TypeTravaux | null>(null);
  const [surface, setSurface] = useState(10);
  const [nbPoints, setNbPoints] = useState(15);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({ nom: "", telephone: "", email: "", adresse: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [animKey, setAnimKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [geoZone, setGeoZone] = useState<GeoZone>("FR");

  const geo = GEO_CONFIG[geoZone];

  useEffect(() => setMounted(true), []);

  // Detect country from Vercel IP header
  useEffect(() => {
    fetch("/api/geo-detect").then(r => r.json()).then(d => {
      const c = d.country as string;
      if (c === "CH" || c === "DE") setGeoZone(c);
    }).catch(() => {});
  }, []);

  const goTo = useCallback((next: number) => {
    setDirection(next > step ? "left" : "right");
    setAnimKey(k => k + 1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const selectType = useCallback((type: TypeTravaux) => {
    setSelectedType(type);
    setSurface(type.surface_default);
    setSelectedOptions(new Set(type.options.filter(o => o.defaut).map(o => o.id)));
    const ptOpt = type.options.find(o => o.unite === "point") as Option | undefined;
    setNbPoints(ptOpt?.points_default ?? 15);
    goTo(1);
  }, [goTo]);

  const toggleOption = useCallback((id: string, opt?: Option) => {
    setSelectedOptions(prev => {
      const next = new Set(prev);
      if (opt?.group && selectedType) {
        for (const o of selectedType.options as Option[]) {
          if ((o as Option).group === opt.group && o.id !== id) next.delete(o.id);
        }
        next.add(id);
      } else {
        next.has(id) ? next.delete(id) : next.add(id);
      }
      return next;
    });
  }, [selectedType]);

  const { totalBas, totalHaut, breakdown } = useMemo(() => {
    if (!selectedType) return { totalBas: 0, totalHaut: 0, breakdown: [] as { id: string; unite: string; qty: number; bas: number; haut: number }[] };
    const rows = selectedType.options
      .filter(o => selectedOptions.has(o.id))
      .map(o => {
        const { bas, haut, qty } = calcPrice(o as Option, surface, nbPoints);
        return { id: o.id, unite: o.unite, qty, bas, haut };
      });
    const rawBas = rows.reduce((s, r) => s + r.bas, 0);
    const rawHaut = rows.reduce((s, r) => s + r.haut, 0);
    return {
      totalBas: Math.round(rawBas * geo.mult),
      totalHaut: Math.round(rawHaut * geo.mult),
      breakdown: rows.map(r => ({ ...r, bas: Math.round(r.bas * geo.mult), haut: Math.round(r.haut * geo.mult) })),
    };
  }, [selectedType, selectedOptions, surface, nbPoints, geo.mult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "calculateur",
          type_travaux: selectedType.id,
          surface,
          nb_points: nbPoints,
          options: Array.from(selectedOptions),
          estimation_basse: totalBas,
          estimation_haute: totalHaut,
          devise: geo.devise,
          pays_detecte: geoZone,
          multiplicateur_geo: geo.mult,
          ...formData,
        }),
      });
      if (!res.ok) throw new Error("fail");
      setSubmitted(true);
    } catch { setError(true); }
    finally { setSubmitting(false); }
  };

  const slideClass = direction === "left" ? "calc-slide-in-right" : "calc-slide-in-left";
  const hasPointOptions = selectedType && (selectedType.options as Option[]).some(o => o.unite === "point");

  return (
    <section className={`min-h-[100dvh] bg-black px-4 py-20 sm:py-24 text-white transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
      <div className="mx-auto max-w-3xl">

        {/* ─── Progress bar ─── */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  i < step ? "bg-[#E50000] text-white" : i === step ? "bg-[#E50000]/20 border-2 border-[#E50000] text-[#E50000]" : "bg-white/5 border border-white/10 text-white/30"
                }`}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                {i < 3 && <div className={`w-8 sm:w-12 h-0.5 transition-all duration-500 ${i < step ? "bg-[#E50000]" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-white/40 uppercase tracking-widest">
            {t("step_label", { current: step + 1, total: 4 })}
          </p>
        </div>

        {/* ═══════════ STEP 0 — Type Selection ═══════════ */}
        {step === 0 && (
          <div key={`s0-${animKey}`} className={slideClass}>
            <h1 className="mb-2 text-center text-3xl sm:text-4xl font-bold tracking-tight">
              {t("step0_title")}
            </h1>
            <p className="mb-10 text-center text-white/40 text-sm">
              {t("step0_subtitle")}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {prixData.types.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => selectType(type)}
                  className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.03] hover:border-[#E50000]/30 hover:shadow-[0_0_40px_rgba(229,0,0,0.08)]"
                >
                  <div className="relative h-28 sm:h-32 overflow-hidden">
                    <Image src={typeImage(type.id)} alt={type.id} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="p-4">
                    <span className="block text-base font-semibold tracking-tight">
                      {t(`type_${type.id}` as any)}
                    </span>
                    <span className="mt-1 block text-xs text-white/30 leading-relaxed">
                      {t(`type_${type.id}_desc` as any)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ STEP 1 — Details ═══════════ */}
        {step === 1 && selectedType && (
          <div key={`s1-${animKey}`} className={slideClass}>
            <button type="button" onClick={() => goTo(0)}
              className="mb-8 flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /> {t("back")}
            </button>

            <div className="mb-8 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl overflow-hidden border border-[#E50000]/20 relative">
                <Image src={typeImage(selectedType.id)} alt="" fill className="object-cover" sizes="48px" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{t(`type_${selectedType.id}` as any)}</h2>
                <p className="text-sm text-white/40">{t("step1_subtitle")}</p>
              </div>
            </div>

            {/* Surface slider */}
            <div className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Ruler className="h-4 w-4 text-white/40" />
                <label className="text-sm font-medium text-white/60">{t("surface")}</label>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input type="range" min={selectedType.surface_min} max={selectedType.surface_max} value={surface}
                    onChange={e => setSurface(Number(e.target.value))}
                    className="w-full h-1.5 appearance-none rounded-full bg-white/10 cursor-pointer [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E50000] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(229,0,0,0.5)]" />
                </div>
                <div className="min-w-[5rem] rounded-xl bg-white/[0.06] border border-white/[0.08] px-3 py-2 text-center">
                  <span className="text-xl font-bold">{surface}</span>
                  <span className="text-xs text-white/40 ml-1">{t("surface_unit")}</span>
                </div>
              </div>
            </div>

            {/* Points élec slider */}
            {hasPointOptions && (
              <div className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-yellow-400/60" />
                  <label className="text-sm font-medium text-white/60">{t("nb_points")}</label>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input type="range"
                      min={(selectedType.options as Option[]).find(o => o.unite === "point")?.points_min ?? 5}
                      max={(selectedType.options as Option[]).find(o => o.unite === "point")?.points_max ?? 50}
                      value={nbPoints} onChange={e => setNbPoints(Number(e.target.value))}
                      className="w-full h-1.5 appearance-none rounded-full bg-white/10 cursor-pointer [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                  </div>
                  <div className="min-w-[5rem] rounded-xl bg-white/[0.06] border border-white/[0.08] px-3 py-2 text-center">
                    <span className="text-xl font-bold">{nbPoints}</span>
                    <span className="text-xs text-white/40 ml-1">pts</span>
                  </div>
                </div>
              </div>
            )}

            {/* Options */}
            <div className="mb-8">
              <h3 className="mb-4 text-sm font-medium text-white/50 uppercase tracking-wider">{t("options_title")}</h3>
              <div className="space-y-2">
                {(selectedType.options as Option[]).map(opt => {
                  const isGrouped = !!opt.group;
                  const isSelected = selectedOptions.has(opt.id);
                  const priceHint = opt.unite === "point" ? `${opt.prix_bas}€/pt` : opt.unite === "forfait" ? `${opt.prix_bas}€` : `${opt.prix_bas}€/${opt.unite}`;
                  return (
                    <label key={opt.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border backdrop-blur-sm px-4 py-3.5 transition-all duration-200 ${
                        isSelected
                          ? "border-[#E50000]/30 bg-[#E50000]/[0.06] shadow-[0_0_20px_rgba(229,0,0,0.05)]"
                          : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]"
                      }`}>
                      <input
                        type={isGrouped ? "radio" : "checkbox"}
                        name={isGrouped ? `group-${opt.group}` : undefined}
                        checked={isSelected}
                        onChange={() => toggleOption(opt.id, opt)}
                        className="sr-only"
                      />
                      <div className={`h-5 w-5 rounded-${isGrouped ? "full" : "md"} border-2 flex items-center justify-center transition-all ${
                        isSelected ? "border-[#E50000] bg-[#E50000]" : "border-white/20 bg-transparent"
                      }`}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-sm">{t(`opt_${opt.id}` as any)}</span>
                        {isGrouped && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/30">{opt.group}</span>}
                      </div>
                      <span className="text-xs text-white/30 font-mono">{priceHint}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button type="button" onClick={() => goTo(2)} disabled={selectedOptions.size === 0}
              className="w-full rounded-2xl bg-gradient-to-r from-[#E50000] to-[#a10000] px-8 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(229,0,0,0.25)] transition-all hover:shadow-[0_12px_40px_rgba(229,0,0,0.35)] hover:scale-[1.01] disabled:opacity-30 flex items-center justify-center gap-2">
              {t("next")} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ═══════════ STEP 2 — Estimation ═══════════ */}
        {step === 2 && selectedType && (
          <div key={`s2-${animKey}`} className={slideClass}>
            <button type="button" onClick={() => goTo(1)}
              className="mb-8 flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /> {t("back")}
            </button>

            <h2 className="mb-1 text-2xl font-bold tracking-tight">{t("step2_title")}</h2>
            <p className="mb-8 text-white/40 text-sm">
              {t(`type_${selectedType.id}` as any)} — {surface} {t("surface_unit")}
              {hasPointOptions ? ` — ${nbPoints} pts élec.` : ""}
            </p>

            {/* Breakdown cards */}
            <div className="space-y-2 mb-8">
              {breakdown.map(row => {
                const pct = totalHaut > 0 ? (row.haut / totalHaut) * 100 : 0;
                return (
                  <div key={row.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{t(`opt_${row.id}` as any)}</span>
                      <span className="text-sm font-mono text-white/60">
                        {formatPrice(row.bas, geo.devise)} — {formatPrice(row.haut, geo.devise)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#E50000]/60 to-[#E50000] rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-white/30 w-10 text-right">{Math.round(pct)}%</span>
                    </div>
                    <p className="text-[10px] text-white/20 mt-1">
                      {row.qty} {row.unite === "forfait" ? "fft" : row.unite === "point" ? "pts" : row.unite}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="rounded-2xl border border-[#E50000]/20 bg-gradient-to-br from-[#E50000]/[0.08] to-transparent backdrop-blur-xl p-8 text-center mb-8">
              <p className="text-xs uppercase tracking-widest text-[#E50000]/60 mb-3 font-medium">{t("total_range")}</p>
              <div className="flex items-center justify-center gap-4 text-3xl sm:text-4xl font-bold">
                <AnimatedCounter target={totalBas} className="text-white" devise={geo.devise} />
                <ArrowRight className="h-5 w-5 text-white/20" />
                <AnimatedCounter target={totalHaut} className="text-white" devise={geo.devise} />
              </div>
              <p className="text-xs text-white/30 mt-3">{t("total_disclaimer")}</p>
            </div>

            <button type="button" onClick={() => goTo(3)}
              className="w-full rounded-2xl bg-gradient-to-r from-[#E50000] to-[#a10000] px-8 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(229,0,0,0.25)] transition-all hover:shadow-[0_12px_40px_rgba(229,0,0,0.35)] hover:scale-[1.01] animate-pulse flex items-center justify-center gap-2">
              {t("cta_devis")} <Send className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ═══════════ STEP 3 — Contact Form ═══════════ */}
        {step === 3 && selectedType && (
          <div key={`s3-${animKey}`} className={slideClass}>
            <button type="button" onClick={() => goTo(2)}
              className="mb-8 flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /> {t("back")}
            </button>

            {submitted ? (
              <div className="flex flex-col items-center py-20 text-center">
                <div className="mb-6 h-20 w-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center animate-bounce">
                  <Check className="h-10 w-10 text-emerald-400" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">{t("success_title")}</h2>
                <p className="text-white/50 max-w-sm">{t("success_message")}</p>
              </div>
            ) : (
              <>
                <h2 className="mb-1 text-2xl font-bold tracking-tight">{t("step3_title")}</h2>
                <p className="mb-8 text-white/40 text-sm">{t("step3_subtitle")}</p>

                {/* Summary */}
                <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl overflow-hidden relative">
                        <Image src={typeImage(selectedType.id)} alt="" fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm">{t(`type_${selectedType.id}` as any)}</span>
                        <span className="text-white/30 text-xs ml-2">{surface} {t("surface_unit")}</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-400 text-sm">
                      {formatPrice(totalBas, geo.devise)} — {formatPrice(totalHaut, geo.devise)}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {(["nom", "telephone", "email", "adresse"] as const).map(field => (
                    <div key={field}>
                      <label className="mb-1.5 block text-xs font-medium text-white/50 uppercase tracking-wider">
                        {t(`form_${field}` as any)} {field !== "adresse" && "*"}
                      </label>
                      <input
                        type={field === "email" ? "email" : field === "telephone" ? "tel" : "text"}
                        required={field !== "adresse"}
                        value={formData[field]}
                        onChange={e => setFormData(d => ({ ...d, [field]: e.target.value }))}
                        placeholder={t(`form_${field}_placeholder` as any)}
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:border-[#E50000]/40 focus:outline-none focus:ring-1 focus:ring-[#E50000]/20 transition-all"
                      />
                    </div>
                  ))}

                  {error && (
                    <p className="rounded-xl bg-red-900/20 border border-red-500/20 px-4 py-3 text-sm text-red-300">
                      {t("error_message")}
                    </p>
                  )}

                  <button type="submit" disabled={submitting}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#E50000] to-[#a10000] px-8 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(229,0,0,0.25)] transition-all hover:shadow-[0_12px_40px_rgba(229,0,0,0.35)] hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="h-4 w-4" /> {t("form_submit")}</>}
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes calcSlideRight { from { opacity:0; transform:translateX(60px) } to { opacity:1; transform:translateX(0) } }
        @keyframes calcSlideLeft  { from { opacity:0; transform:translateX(-60px) } to { opacity:1; transform:translateX(0) } }
        .calc-slide-in-right { animation: calcSlideRight .35s cubic-bezier(.16,1,.3,1) both }
        .calc-slide-in-left  { animation: calcSlideLeft  .35s cubic-bezier(.16,1,.3,1) both }
      `}</style>
    </section>
  );
}
