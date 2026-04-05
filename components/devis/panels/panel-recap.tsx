"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Send, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-8">
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
