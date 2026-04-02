"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Ruler, Wallet } from "lucide-react";
import type { DevisFormState, DevisAction, BudgetRange } from "../devis-types";

interface StepSurfaceBudgetProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "< 5000", label: "< 5 000 EUR" },
  { value: "5000-15000", label: "5 000 - 15 000 EUR" },
  { value: "15000-30000", label: "15 000 - 30 000 EUR" },
  { value: "30000-50000", label: "30 000 - 50 000 EUR" },
  { value: "> 50000", label: "> 50 000 EUR" },
];

export function StepSurfaceBudgetOverlay({ state, dispatch }: StepSurfaceBudgetProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      {/* Panneau central */}
      <div className="pointer-events-auto bg-black/85 backdrop-blur-md rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl border border-white/10">
        <p className="text-sm text-gray-400 uppercase tracking-wider mb-1 text-center">Etape 4 / 6</p>
        <h2 className="text-2xl font-bold text-white text-center mb-6">Surface et budget</h2>

        {/* Surface */}
        <div className="space-y-2 mb-6">
          <Label className="text-white flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#E50000]" />
            Surface approximative (m²)
          </Label>
          <Input
            type="number"
            placeholder="Ex: 25"
            value={state.surface || ""}
            onChange={(e) =>
              dispatch({
                type: "SET_SURFACE",
                surface: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-lg h-12"
          />
        </div>

        {/* Budget */}
        <div className="space-y-2 mb-6">
          <Label className="text-white flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#E50000]" />
            Fourchette de budget
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {BUDGET_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => dispatch({ type: "SET_BUDGET", budget: option.value })}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                  state.budget === option.value
                    ? "bg-[#E50000] text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message optionnel */}
        <div className="space-y-2 mb-6">
          <Label className="text-white">Message complementaire (optionnel)</Label>
          <Textarea
            placeholder="Decrivez votre projet en quelques mots..."
            value={state.message}
            onChange={(e) => dispatch({ type: "SET_MESSAGE", message: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 min-h-[80px]"
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "PREV_STEP" })}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Retour
          </Button>
          <Button
            size="lg"
            onClick={() => dispatch({ type: "NEXT_STEP" })}
            className="bg-[#E50000] hover:bg-red-700 text-white px-8"
          >
            Continuer <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
