"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
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

const WIZARD_STEPS = [
  {
    icon: Download,
    title: "Téléchargez l'app",
    subtitle: "Gratuit — 2 minutes",
    instruction: "Installez MagicPlan sur votre téléphone. C'est gratuit, pas besoin de compte.",
    visual: "📱",
    action: {
      label: "Télécharger MagicPlan",
      onClick: () => {
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
      },
    },
    tip: "Déjà installé ? Passez à l'étape suivante.",
  },
  {
    icon: Camera,
    title: "Ouvrez et créez un projet",
    subtitle: "30 secondes",
    instruction: "Ouvrez MagicPlan, appuyez sur le gros bouton \"+\", puis choisissez \"Nouveau projet\". Donnez un nom (ex: \"Ma maison\").",
    visual: "➕",
    tip: "Choisissez le mode \"Scanner\" pour la détection automatique des murs.",
  },
  {
    icon: Ruler,
    title: "Scannez votre première pièce",
    subtitle: "2 minutes par pièce",
    instruction: "Placez-vous au centre de la pièce. Pointez le téléphone vers un coin et suivez les instructions à l'écran. Tournez lentement vers chaque coin.",
    visual: "🔄",
    tips: [
      "Tenez le téléphone à hauteur de poitrine",
      "Allez lentement, coin par coin",
      "Les portes et fenêtres sont détectées automatiquement",
      "Répétez pour chaque pièce à rénover",
    ],
  },
  {
    icon: CheckCircle,
    title: "Vérifiez le résultat",
    subtitle: "1 minute",
    instruction: "MagicPlan génère un plan 2D avec les mesures. Tapez sur une cote pour la corriger si besoin.",
    visual: "✅",
    tip: "Pas besoin que ce soit parfait — on affinera ensemble.",
  },
  {
    icon: Share2,
    title: "Envoyez-nous le plan",
    subtitle: "30 secondes",
    instruction: "Appuyez sur \"Partager\" dans MagicPlan, puis choisissez \"PDF\" ou \"Lien\". Copiez le lien et collez-le dans le message de votre devis ci-dessous.",
    visual: "📤",
    tips: [
      "Option 1 : Collez le lien dans le champ \"Message\" du devis",
      "Option 2 : Envoyez le PDF par email à contact@aiman-renovation.fr",
    ],
  },
];

function MagicPlanSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const current = WIZARD_STEPS[step];
  const Icon = current.icon;
  const isLast = step === WIZARD_STEPS.length - 1;

  return (
    <>
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Ruler className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">Devis plus précis avec MagicPlan</h4>
            <p className="text-gray-400 text-xs mt-1">
              Scannez vos pièces en 5 min avec l'app gratuite MagicPlan.
            </p>
          </div>
        </div>
        <button
          onClick={() => { setStep(0); setIsOpen(true); }}
          className="block w-full text-center bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm font-medium py-2.5 rounded-lg border border-blue-500/30 transition-colors"
        >
          Voir le guide MagicPlan →
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Progress bar */}
            <div className="h-1.5 bg-white/5">
              <div
                className="h-full bg-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / WIZARD_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4">
              <span className="text-xs text-gray-500 font-medium">
                Étape {step + 1} sur {WIZARD_STEPS.length}
              </span>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-6 text-center space-y-5">
              {/* Visual */}
              <div className="w-20 h-20 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto text-4xl">
                {current.visual}
              </div>

              {/* Title */}
              <div>
                <h3 className="text-white text-lg font-bold">{current.title}</h3>
                <p className="text-blue-400 text-xs font-medium mt-1">{current.subtitle}</p>
              </div>

              {/* Instruction */}
              <p className="text-gray-300 text-sm leading-relaxed">
                {current.instruction}
              </p>

              {/* Tips */}
              {current.tips && (
                <div className="bg-white/5 rounded-xl p-4 space-y-2 text-left">
                  {current.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              )}

              {current.tip && !current.tips && (
                <p className="text-gray-500 text-xs italic">{current.tip}</p>
              )}

              {/* Action button */}
              {current.action && (
                <button
                  onClick={current.action.onClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors w-full"
                >
                  {current.action.label}
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
                  ← Précédent
                </button>
              ) : (
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-medium py-3 rounded-xl transition-colors"
                >
                  Passer
                </button>
              )}
              <button
                onClick={() => isLast ? setIsOpen(false) : setStep(step + 1)}
                className={`flex-[2] text-white text-sm font-semibold py-3 rounded-xl transition-colors ${
                  isLast ? "bg-[#E50000] hover:bg-red-700" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isLast ? "Continuer mon devis" : "Suivant →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PanelRecap({ state, dispatch, onSubmit }: PanelRecapProps) {
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
            <span>Retour</span>
          </button>
          <h2 className="text-xl font-semibold text-white">Récapitulatif</h2>
          <span className="text-sm text-white/50">
            {totalWorks} travaux / {zonesWithWorks.length} zones
          </span>
        </div>

        {/* Zones avec travaux */}
        <div className="space-y-3">
          {zonesWithWorks.map((zone) => (
            <div
              key={zone.id}
              className="bg-[#111] rounded-xl border border-white/10 p-4"
            >
              <h3 className="text-white font-medium mb-2">{zone.label}</h3>
              <div className="flex flex-wrap gap-2">
                {state.selectedWorks[zone.id].map((workId) => {
                  const workItem = zone.workItems.find(
                    (w) => w.id === workId
                  );
                  return (
                    <Badge
                      key={workId}
                      className="bg-[#E50000] text-white hover:bg-[#E50000]/80 border-none"
                    >
                      {workItem?.label ?? workId}
                    </Badge>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">Budget estimé</h3>
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
            Lien MagicPlan (optionnel)
          </Label>
          <Input
            id="magicplan"
            type="url"
            placeholder="https://my.magicplan.app/..."
            value={state.magicplanLink}
            onChange={(e) =>
              dispatch({ type: "SET_MAGICPLAN_LINK", link: e.target.value })
            }
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
          <p className="text-gray-500 text-xs">Collez ici le lien de partage MagicPlan</p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-white font-medium">
            Message (optionnel)
          </Label>
          <Textarea
            id="message"
            placeholder="Décrivez votre projet, vos contraintes, vos envies..."
            value={state.message}
            onChange={(e) =>
              dispatch({ type: "SET_MESSAGE", message: e.target.value })
            }
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
          />
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-white font-medium">Vos coordonnées</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-white/70 text-sm">
                Prénom *
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
                Nom
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
              Téléphone *
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
              Email *
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
              Adresse du chantier *
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
            <p className="text-gray-500 text-xs">Suggestions automatiques — France, Allemagne, Suisse</p>
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
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Envoyer mon devis
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
