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

const MAGIC_STEPS = [
  { title: "Téléchargez MagicPlan", icon: Download, content: "L'application est gratuite et disponible sur iPhone et Android.", hasAction: true },
  { title: "Scannez chaque pièce", icon: Camera, content: "Créez un nouveau projet, puis scannez chaque pièce. Pointez votre téléphone vers les coins — MagicPlan détecte les murs automatiquement.", tips: ["Tenez le téléphone à hauteur de poitrine", "Tournez lentement, coin par coin"] },
  { title: "Vérifiez les mesures", icon: Ruler, content: "Vérifiez le plan 2D généré. Corrigez les mesures si besoin en tapant sur les cotes." },
  { title: "Partagez-nous le plan", icon: Share2, content: "Exportez votre plan (bouton Partager), puis mentionnez-le dans le message du devis ou envoyez-le à contact@aiman-renovation.fr." },
];

function MagicPlanSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

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
          onClick={() => setIsOpen(true)}
          className="block w-full text-center bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm font-medium py-2.5 rounded-lg border border-blue-500/30 transition-colors"
        >
          Voir le guide MagicPlan →
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[80dvh] overflow-y-auto overscroll-contain" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-[#111] z-10">
              <h3 className="text-white font-semibold">Guide MagicPlan</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {MAGIC_STEPS.map((step, i) => {
                const Icon = step.icon;
                const open = activeStep === i;
                const done = activeStep > i;
                return (
                  <div key={i} className={`rounded-xl border transition-all ${open ? "bg-white/5 border-blue-500/40" : done ? "border-green-500/30" : "border-white/10"}`}>
                    <button onClick={() => setActiveStep(i)} className="w-full flex items-center gap-3 p-3 text-left">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? "bg-green-500/20" : open ? "bg-blue-500/20" : "bg-white/5"}`}>
                        {done ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Icon className={`w-4 h-4 ${open ? "text-blue-400" : "text-gray-500"}`} />}
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">Étape {i + 1}</span>
                        <h4 className={`text-sm font-semibold ${done ? "text-green-300" : "text-white"}`}>{step.title}</h4>
                      </div>
                    </button>
                    {open && (
                      <div className="px-3 pb-3 space-y-2">
                        <p className="text-gray-400 text-xs leading-relaxed pl-12">{step.content}</p>
                        {step.tips && (
                          <div className="pl-12 space-y-1">
                            {step.tips.map((tip, j) => (
                              <div key={j} className="flex items-start gap-1.5 text-xs text-gray-500">
                                <CheckCircle className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {step.hasAction && (
                          <div className="pl-12">
                            <button
                              onClick={() => {
                                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                                window.open(isIOS ? "https://apps.apple.com/app/magicplan/id427424432" : "https://play.google.com/store/apps/details?id=com.sensopia.magicplan", "_blank");
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                              Télécharger MagicPlan
                            </button>
                          </div>
                        )}
                        {i < MAGIC_STEPS.length - 1 && (
                          <div className="pl-12">
                            <button onClick={() => setActiveStep(i + 1)} className="text-blue-400 text-xs font-medium hover:text-blue-300">Suivant →</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-white/10">
              <button onClick={() => setIsOpen(false)} className="w-full bg-[#E50000] hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                Fermer et continuer mon devis
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

        {/* MagicPlan CTA */}
        <MagicPlanSection />

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
