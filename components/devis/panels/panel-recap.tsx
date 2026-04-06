"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, Send, Loader2, X, Download, Camera, Ruler, Share2, CheckCircle } from "lucide-react";
import { ZONES_CONFIG } from "../devis-zones-config";
import { AddressAutocomplete } from "./address-autocomplete";
import type { DevisState, DevisAction, BudgetRange } from "../devis-types";

interface PanelRecapProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
  onSubmit: () => void;
}

const BUDGET_OPTIONS: BudgetRange[] = [
  "< 5000",
  "5000-15000",
  "15000-30000",
  "30000-50000",
  "> 50000",
];

const WIZARD_ICONS = [Download, Camera, Ruler, CheckCircle, Share2];
const WIZARD_VISUALS = ["📱", "➕", "🔄", "✅", "📤"];

function MagicPlanSection() {
  const t = useTranslations("devis.panel_recap");
  const tWiz = useTranslations("devis.magicplan_wizard");
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const stepsCount = 5;
  const Icon = WIZARD_ICONS[step];
  const isLast = step === stepsCount - 1;

  const stepTitle = tWiz(`steps.${step}.title`);
  const stepSubtitle = tWiz(`steps.${step}.subtitle`);
  const stepInstruction = tWiz(`steps.${step}.instruction`);

  // Check if step has action_label (only step 0)
  const hasAction = step === 0;
  const actionLabel = hasAction ? tWiz(`steps.${step}.action_label`) : "";

  const handleDownload = () => {
    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);
    if (isIOS) {
      window.open("https://apps.apple.com/app/magicplan/id427424432", "_blank");
    } else if (isAndroid) {
      window.open("https://play.google.com/store/apps/details?id=com.sensopia.magicplan", "_blank");
    } else {
      window.open("https://www.magicplan.app", "_blank");
    }
  };

  // Steps with tips arrays: 2 and 4 (0-indexed)
  const hasTipsArray = step === 2 || step === 4;
  const tipsCount = step === 2 ? 4 : step === 4 ? 2 : 0;

  // Steps with single tip: 0, 1, 3
  const hasSingleTip = step === 0 || step === 1 || step === 3;

  return (
    <>
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Ruler className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">{t("magicplan_title")}</h4>
            <p className="text-gray-400 text-xs mt-1">
              {t("magicplan_subtitle")}
            </p>
          </div>
        </div>
        <button
          onClick={() => { setStep(0); setIsOpen(true); }}
          className="block w-full text-center bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm font-medium py-2.5 rounded-lg border border-blue-500/30 transition-colors"
        >
          {t("magicplan_guide_button")}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Progress bar */}
            <div className="h-1.5 bg-white/5">
              <div
                className="h-full bg-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / stepsCount) * 100}%` }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4">
              <span className="text-xs text-gray-500 font-medium">
                {tWiz("step_label", { current: step + 1, total: stepsCount })}
              </span>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-6 text-center space-y-5">
              {/* Visual */}
              <div className="w-20 h-20 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto text-4xl">
                {WIZARD_VISUALS[step]}
              </div>

              {/* Title */}
              <div>
                <h3 className="text-white text-lg font-bold">{stepTitle}</h3>
                <p className="text-blue-400 text-xs font-medium mt-1">{stepSubtitle}</p>
              </div>

              {/* Instruction */}
              <p className="text-gray-300 text-sm leading-relaxed">
                {stepInstruction}
              </p>

              {/* Tips (array) */}
              {hasTipsArray && (
                <div className="bg-white/5 rounded-xl p-4 space-y-2 text-left">
                  {Array.from({ length: tipsCount }, (_, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>{tWiz(`steps.${step}.tips.${i}`)}</span>
                    </div>
                  ))}
                </div>
              )}

              {hasSingleTip && (
                <p className="text-gray-500 text-xs italic">{tWiz(`steps.${step}.tip`)}</p>
              )}

              {/* Action button (step 0 only) */}
              {hasAction && (
                <button
                  onClick={handleDownload}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors w-full"
                >
                  {actionLabel}
                </button>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 p-5 border-t border-white/10">
              {step > 0 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-3 rounded-xl transition-colors"
                >
                  {tWiz("previous")}
                </button>
              ) : (
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-medium py-3 rounded-xl transition-colors"
                >
                  {tWiz("skip")}
                </button>
              )}
              <button
                onClick={() => isLast ? setIsOpen(false) : setStep(step + 1)}
                className={`flex-[2] text-white text-sm font-semibold py-3 rounded-xl transition-colors ${
                  isLast ? "bg-[#E50000] hover:bg-red-700" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isLast ? tWiz("finish") : tWiz("next")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PanelRecap({ state, dispatch, onSubmit }: PanelRecapProps) {
  const t = useTranslations("devis.panel_recap");
  const tZones = useTranslations("devis.zones");

  const zonesWithWorks = ZONES_CONFIG.filter(
    (z) => state.selectedWorks[z.id] && state.selectedWorks[z.id].length > 0
  );

  const totalWorks = zonesWithWorks.reduce(
    (sum, z) => sum + state.selectedWorks[z.id].length,
    0
  );

  const isFormValid =
    state.contact.firstName.trim() !== "" &&
    state.contact.phone.trim() !== "" &&
    state.contact.email.trim() !== "" &&
    state.contact.address.trim() !== "" &&
    totalWorks > 0;

  return (
    <div className="bg-[#0A0A0A] px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => dispatch({ type: "ZOOM_OUT" })}
            className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{t("back")}</span>
          </button>
          <h2 className="text-xl font-semibold text-white">{t("title")}</h2>
          <span className="text-sm text-white/50">
            {t("works_zones", { works: totalWorks, zones: zonesWithWorks.length })}
          </span>
        </div>

        {/* Zones avec travaux */}
        <div className="space-y-3">
          {zonesWithWorks.map((zone) => (
            <div
              key={zone.id}
              className="bg-[#111] rounded-xl border border-white/10 p-4"
            >
              <h3 className="text-white font-medium mb-2">{tZones(`${zone.labelKey}.label`)}</h3>
              <div className="flex flex-wrap gap-2">
                {state.selectedWorks[zone.id].map((workId) => {
                  const workItem = zone.workItems.find(
                    (w) => w.id === workId
                  );
                  const workLabel = workItem
                    ? tZones(`${zone.labelKey}.workItems.${workItem.labelKey}`)
                    : workId;
                  return (
                    <Badge
                      key={workId}
                      className="bg-[#E50000] text-white hover:bg-[#E50000]/80 border-none"
                    >
                      {workLabel}
                    </Badge>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">{t("budget_title")}</h3>
          <div className="flex flex-wrap gap-2">
            {BUDGET_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() =>
                  dispatch({
                    type: "SET_BUDGET",
                    budget: state.budget === option ? null : option,
                  })
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  state.budget === option
                    ? "bg-[#E50000] text-white border-[#E50000]"
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                }`}
              >
                {option} €
              </button>
            ))}
          </div>
        </div>

        {/* MagicPlan CTA + lien */}
        <MagicPlanSection />
        <div className="space-y-1.5">
          <Label htmlFor="magicplan" className="text-white/70 text-sm">
            {t("magicplan_link_label")}
          </Label>
          <Input
            id="magicplan"
            type="url"
            placeholder={t("magicplan_link_placeholder")}
            value={state.magicplanLink}
            onChange={(e) =>
              dispatch({ type: "SET_MAGICPLAN_LINK", link: e.target.value })
            }
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
          <p className="text-gray-500 text-xs">{t("magicplan_link_hint")}</p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-white font-medium">
            {t("message_label")}
          </Label>
          <Textarea
            id="message"
            placeholder={t("message_placeholder")}
            value={state.message}
            onChange={(e) =>
              dispatch({ type: "SET_MESSAGE", message: e.target.value })
            }
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
          />
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-white font-medium">{t("contact_title")}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-white/70 text-sm">
                {t("label_firstname")}
              </Label>
              <Input
                id="firstName"
                value={state.contact.firstName}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CONTACT",
                    field: "firstName",
                    value: e.target.value,
                  })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-white/70 text-sm">
                {t("label_lastname")}
              </Label>
              <Input
                id="lastName"
                value={state.contact.lastName}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CONTACT",
                    field: "lastName",
                    value: e.target.value,
                  })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-white/70 text-sm">
              {t("label_phone")}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={state.contact.phone}
              onChange={(e) =>
                dispatch({
                  type: "SET_CONTACT",
                  field: "phone",
                  value: e.target.value,
                })
              }
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white/70 text-sm">
              {t("label_email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={state.contact.email}
              onChange={(e) =>
                dispatch({
                  type: "SET_CONTACT",
                  field: "email",
                  value: e.target.value,
                })
              }
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-white/70 text-sm">
              {t("label_address")}
            </Label>
            <AddressAutocomplete
              value={state.contact.address}
              onChange={(val) =>
                dispatch({
                  type: "SET_CONTACT",
                  field: "address",
                  value: val,
                })
              }
            />
            <p className="text-gray-500 text-xs">{t("address_hint")}</p>
          </div>
        </div>

        {/* Error */}
        {state.error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {state.error}
          </div>
        )}

        {/* Submit */}
        <Button
          onClick={onSubmit}
          disabled={!isFormValid || state.isSubmitting}
          className="w-full bg-[#E50000] hover:bg-[#E50000]/90 text-white font-semibold py-6 text-base disabled:opacity-40"
        >
          {state.isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              {t("submit_sending")}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {t("submit_button")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
