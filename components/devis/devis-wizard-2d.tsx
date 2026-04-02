"use client";

import { useReducer, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  Phone,
  ArrowLeft,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { devisReducer, initialDevisState } from "./devis-reducer";
import { ZONES_CONFIG, getZoneConfig } from "./devis-zones-config";
import type { DevisFormState, BudgetRange } from "./devis-types";

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "< 5000", label: "< 5 000 EUR" },
  { value: "5000-15000", label: "5 000 - 15 000 EUR" },
  { value: "15000-30000", label: "15 000 - 30 000 EUR" },
  { value: "30000-50000", label: "30 000 - 50 000 EUR" },
  { value: "> 50000", label: "> 50 000 EUR" },
];

async function submitDevis(state: DevisFormState) {
  const res = await fetch("/api/devis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...state,
      photos: [],
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Erreur lors de l'envoi");
  }
}

export function DevisWizard2D() {
  const [state, dispatch] = useReducer(devisReducer, initialDevisState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });
    try {
      await submitDevis(state);
      dispatch({ type: "SET_SUBMITTED" });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", error: err.message || "Erreur lors de l'envoi" });
    }
  };

  // Ecran succes
  if (state.isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="bg-[#111111] rounded-3xl p-10 w-full max-w-md text-center border border-white/10">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Demande envoyee !</h2>
          <p className="text-gray-300 mb-6">Nous vous recontactons sous 24h.</p>
          <div className="space-y-3">
            <Link href="/" className="flex items-center justify-center w-full h-9 bg-[#E50000] hover:bg-red-700 text-white rounded-lg text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour a l&apos;accueil
            </Link>
            <a href="tel:0633496925" className="flex items-center justify-center w-full h-9 border border-white/30 text-white hover:bg-white/10 rounded-lg text-sm font-medium">
              <Phone className="w-4 h-4 mr-2" /> Appeler
            </a>
          </div>
        </div>
      </div>
    );
  }

  const stepTitles = [
    "Zones a renover",
    "Etat actuel",
    "Renovation souhaitee",
    "Surface et budget",
    "Photos et coordonnees",
    "Recapitulatif",
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">
              Etape {state.currentStep + 1} / 6
            </span>
            <span className="text-sm text-white font-medium">
              {stepTitles[state.currentStep]}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E50000] rounded-full transition-all duration-500"
              style={{ width: `${((state.currentStep + 1) / 6) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#111111] rounded-3xl p-8 border border-white/10">
          {/* Etape 0 : Zones */}
          {state.currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Ou souhaitez-vous renover ?</h2>
              <div className="grid grid-cols-2 gap-3">
                {ZONES_CONFIG.map((zone) => {
                  const isSelected = state.selectedZones.includes(zone.id);
                  return (
                    <button
                      key={zone.id}
                      onClick={() => dispatch({ type: "TOGGLE_ZONE", zone: zone.id })}
                      className={`p-4 rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-[#E50000]/20 border-2 border-[#E50000]"
                          : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckCircle className="w-5 h-5 text-[#E50000]" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-500" />
                        )}
                        <span className={`font-medium ${isSelected ? "text-[#E50000]" : "text-white"}`}>
                          {zone.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Etape 1 : Problemes */}
          {state.currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Quel est l&apos;etat actuel ?</h2>
              {state.selectedZones.map((zoneId) => {
                const zoneConfig = getZoneConfig(zoneId);
                if (!zoneConfig) return null;
                return (
                  <div key={zoneId} className="space-y-2">
                    <h3 className="text-white font-semibold">{zoneConfig.label}</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {zoneConfig.problems.map((problem) => {
                        const isSelected = state.problems[zoneId].includes(problem.id);
                        return (
                          <button
                            key={problem.id}
                            onClick={() => dispatch({ type: "TOGGLE_PROBLEM", zone: zoneId, problemId: problem.id })}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                              isSelected
                                ? "bg-[#E50000]/20 text-[#E50000] border border-[#E50000]/40"
                                : "bg-white/5 text-white hover:bg-white/10"
                            }`}
                          >
                            {isSelected ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                            {problem.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Etape 2 : Options renovation */}
          {state.currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Quel resultat souhaitez-vous ?</h2>
              {state.selectedZones.map((zoneId) => {
                const zoneConfig = getZoneConfig(zoneId);
                if (!zoneConfig) return null;
                return (
                  <div key={zoneId} className="space-y-2">
                    <h3 className="text-white font-semibold">{zoneConfig.label}</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {zoneConfig.renovationOptions.map((option) => {
                        const isSelected = state.renovationOptions[zoneId].includes(option.id);
                        return (
                          <button
                            key={option.id}
                            onClick={() => dispatch({ type: "TOGGLE_RENOVATION_OPTION", zone: zoneId, optionId: option.id })}
                            className={`flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-all ${
                              isSelected
                                ? "bg-[#E50000]/20 border border-[#E50000]/40"
                                : "bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                              isSelected ? "bg-[#E50000]" : "border border-white/40"
                            }`}>
                              {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${isSelected ? "text-[#E50000]" : "text-white"}`}>{option.label}</p>
                              <p className="text-xs text-gray-400">{option.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Etape 3 : Surface / Budget */}
          {state.currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Surface et budget</h2>
              <div className="space-y-2">
                <Label className="text-white">Surface approximative (m²)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 25"
                  value={state.surface || ""}
                  onChange={(e) => dispatch({ type: "SET_SURFACE", surface: e.target.value ? Number(e.target.value) : null })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Fourchette de budget</Label>
                <div className="grid grid-cols-1 gap-2">
                  {BUDGET_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => dispatch({ type: "SET_BUDGET", budget: option.value })}
                      className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                        state.budget === option.value ? "bg-[#E50000] text-white" : "bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Message (optionnel)</Label>
                <Textarea
                  placeholder="Decrivez votre projet..."
                  value={state.message}
                  onChange={(e) => dispatch({ type: "SET_MESSAGE", message: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          )}

          {/* Etape 4 : Photos + Contact */}
          {state.currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Photos et coordonnees</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-white text-sm">Prenom *</Label>
                    <Input value={state.contact.firstName} onChange={(e) => dispatch({ type: "SET_CONTACT", field: "firstName", value: e.target.value })} placeholder="Prenom" className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white text-sm">Nom</Label>
                    <Input value={state.contact.lastName} onChange={(e) => dispatch({ type: "SET_CONTACT", field: "lastName", value: e.target.value })} placeholder="Nom" className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-sm">Telephone *</Label>
                  <Input type="tel" value={state.contact.phone} onChange={(e) => dispatch({ type: "SET_CONTACT", field: "phone", value: e.target.value })} placeholder="06 12 34 56 78" className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-sm">Email *</Label>
                  <Input type="email" value={state.contact.email} onChange={(e) => dispatch({ type: "SET_CONTACT", field: "email", value: e.target.value })} placeholder="votre@email.com" className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-sm">Adresse du chantier</Label>
                  <Input value={state.contact.address} onChange={(e) => dispatch({ type: "SET_CONTACT", field: "address", value: e.target.value })} placeholder="14 rue de la Paix, 68300 Saint-Louis" className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
                </div>
              </div>
            </div>
          )}

          {/* Etape 5 : Recap */}
          {state.currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Recapitulatif</h2>
              {state.selectedZones.map((zoneId) => {
                const zoneConfig = getZoneConfig(zoneId);
                if (!zoneConfig) return null;
                return (
                  <div key={zoneId} className="bg-white/5 rounded-xl p-4 space-y-2">
                    <h3 className="text-white font-semibold">{zoneConfig.label}</h3>
                    {state.problems[zoneId].length > 0 && (
                      <div>
                        <p className="text-gray-400 text-xs uppercase">Problemes</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {state.problems[zoneId].map((pId) => {
                            const p = zoneConfig.problems.find((prob) => prob.id === pId);
                            return <Badge key={pId} variant="secondary" className="bg-amber-500/20 text-amber-300 text-xs">{p?.label}</Badge>;
                          })}
                        </div>
                      </div>
                    )}
                    {state.renovationOptions[zoneId].length > 0 && (
                      <div>
                        <p className="text-gray-400 text-xs uppercase">Renovation</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {state.renovationOptions[zoneId].map((oId) => {
                            const o = zoneConfig.renovationOptions.find((opt) => opt.id === oId);
                            return <Badge key={oId} variant="secondary" className="bg-green-500/20 text-green-300 text-xs">{o?.label}</Badge>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="bg-white/5 rounded-xl p-4 text-sm space-y-1">
                <p className="text-white"><span className="text-gray-400">Contact :</span> {state.contact.firstName} {state.contact.lastName}</p>
                <p className="text-white"><span className="text-gray-400">Tel :</span> {state.contact.phone}</p>
                <p className="text-white"><span className="text-gray-400">Email :</span> {state.contact.email}</p>
                {state.surface && <p className="text-white"><span className="text-gray-400">Surface :</span> {state.surface} m²</p>}
                {state.budget && <p className="text-white"><span className="text-gray-400">Budget :</span> {state.budget}</p>}
              </div>
              {state.error && (
                <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm text-center">{state.error}</div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {state.currentStep > 0 ? (
              <Button variant="outline" onClick={() => dispatch({ type: "PREV_STEP" })} className="border-white/30 text-white hover:bg-white/10">
                <ChevronLeft className="w-4 h-4 mr-1" /> Retour
              </Button>
            ) : (
              <div />
            )}

            {state.currentStep < 5 ? (
              <Button
                size="lg"
                disabled={state.currentStep === 0 && state.selectedZones.length === 0}
                onClick={() => {
                  if (state.currentStep === 0 && state.selectedZones.length > 0) {
                    dispatch({ type: "SET_ACTIVE_ZONE", zone: state.selectedZones[0] });
                  }
                  dispatch({ type: "NEXT_STEP" });
                }}
                className="bg-[#E50000] hover:bg-red-700 text-white px-8 disabled:opacity-30"
              >
                Continuer <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={state.isSubmitting}
                className="bg-[#E50000] hover:bg-red-700 text-white px-8"
              >
                {state.isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Envoi...</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" /> Envoyer</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
