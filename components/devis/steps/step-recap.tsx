// @ts-nocheck
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import type { DevisFormState, DevisAction } from "../devis-types";
import { ZONES_CONFIG, getZoneConfig } from "../devis-zones-config";

interface StepRecapProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
  onSubmit: () => Promise<void>;
}

export function StepRecapOverlay({ state, dispatch, onSubmit }: StepRecapProps) {
  const [showAfter, setShowAfter] = useState(false);

  const budgetLabels: Record<string, string> = {
    "< 5000": "< 5 000 EUR",
    "5000-15000": "5 000 - 15 000 EUR",
    "15000-30000": "15 000 - 30 000 EUR",
    "30000-50000": "30 000 - 50 000 EUR",
    "> 50000": "> 50 000 EUR",
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-black/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-2xl mx-4 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        <p className="text-sm text-gray-400 uppercase tracking-wider mb-1 text-center">Etape 6 / 6</p>
        <h2 className="text-2xl font-bold text-white text-center mb-2">Recapitulatif de votre demande</h2>

        {/* Toggle Avant / Apres */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 rounded-full p-1 flex">
            <button
              onClick={() => setShowAfter(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !showAfter ? "bg-[#E50000] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-1" /> Avant
            </button>
            <button
              onClick={() => setShowAfter(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                showAfter ? "bg-[#E50000] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-1" /> Apres
            </button>
          </div>
        </div>

        {/* Split content */}
        <div className="space-y-4 mb-6">
          {state.selectedZones.map((zoneId) => {
            const zone = ZONES_CONFIG.find((z) => z.id === zoneId);
            const zoneConfig = getZoneConfig(zoneId);
            if (!zone || !zoneConfig) return null;

            const problems = state.problems[zoneId];
            const options = state.renovationOptions[zoneId];

            return (
              <div key={zoneId} className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">{zone.label}</h3>

                {!showAfter ? (
                  <div className="space-y-1">
                    {problems.length === 0 ? (
                      <p className="text-gray-500 text-sm">Aucun probleme signale</p>
                    ) : (
                      problems.map((problemId) => {
                        const problem = zoneConfig.problems.find((p) => p.id === problemId);
                        return (
                          <div key={problemId} className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            <span className="text-gray-300">{problem?.label || problemId}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {options.length === 0 ? (
                      <p className="text-gray-500 text-sm">Aucune option selectionnee</p>
                    ) : (
                      options.map((optionId) => {
                        const option = zoneConfig.renovationOptions.find((o) => o.id === optionId);
                        return (
                          <div key={optionId} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-300">{option?.label || optionId}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Infos complementaires */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Surface</p>
            <p className="text-white font-medium">
              {state.surface ? `${state.surface} m²` : "Non renseignee"}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Budget</p>
            <p className="text-white font-medium">
              {state.budget ? budgetLabels[state.budget] : "Non renseigne"}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Contact</p>
            <p className="text-white font-medium">
              {state.contact.firstName} {state.contact.lastName}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Telephone</p>
            <p className="text-white font-medium">{state.contact.phone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-400">Email</p>
            <p className="text-white font-medium">{state.contact.email}</p>
          </div>
          {state.contact.address && (
            <div className="col-span-2">
              <p className="text-gray-400">Adresse du chantier</p>
              <p className="text-white font-medium">{state.contact.address}</p>
            </div>
          )}
          {state.photos.length > 0 && (
            <div className="col-span-2">
              <p className="text-gray-400">Photos jointes</p>
              <p className="text-white font-medium">{state.photos.length} fichier(s)</p>
            </div>
          )}
        </div>

        {/* Erreur */}
        {state.error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 mb-4 text-red-300 text-sm text-center">
            {state.error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "PREV_STEP" })}
            disabled={state.isSubmitting}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Modifier
          </Button>
          <Button
            size="lg"
            onClick={onSubmit}
            disabled={state.isSubmitting}
            className="bg-[#E50000] hover:bg-red-700 text-white px-8 text-lg"
          >
            {state.isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" /> Envoyer ma demande
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
