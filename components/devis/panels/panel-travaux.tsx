"use client";

import React from "react";
import { getZoneConfig } from "../devis-zones-config";
import type { DevisState, DevisAction } from "../devis-types";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ChevronLeft } from "lucide-react";

interface PanelTravauxProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
  isMobile: boolean;
}

export function PanelTravaux({ state, dispatch, isMobile }: PanelTravauxProps) {
  const zoneConfig = getZoneConfig(state.activeZone);

  if (!zoneConfig) return null;

  const selectedWorks = state.selectedWorks[zoneConfig.id] ?? [];
  const selectedCount = selectedWorks.length;

  const isSelected = (workId: string) => selectedWorks.includes(workId);

  const handleToggle = (workId: string) => {
    dispatch({ type: "TOGGLE_WORK", zone: zoneConfig.id, workId });
  };

  const handleBack = () => {
    dispatch({ type: "ZOOM_OUT" });
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Handle bar (mobile only) */}
      {isMobile && (
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/30" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-semibold text-lg truncate">
            {zoneConfig.label}
          </h2>
        </div>
        <span className="text-sm text-white/60 whitespace-nowrap">
          {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
        </span>
      </div>

      {/* Scrollable work items list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {zoneConfig.workItems.map((item) => {
          const active = isSelected(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                active
                  ? "bg-[#E50000]/15 border border-[#E50000]/30"
                  : "bg-white/5 border border-transparent hover:bg-white/10"
              }`}
            >
              {active ? (
                <CheckCircle className="w-5 h-5 text-[#E50000] shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-white/30 shrink-0" />
              )}
              <span
                className={`text-sm ${active ? "text-white font-medium" : "text-white/70"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <Button
          onClick={handleBack}
          className="w-full bg-[#E50000] hover:bg-[#E50000]/90 text-white font-semibold py-3 rounded-xl"
        >
          Valider et retour au plan
        </Button>
      </div>
    </div>
  );

  // Desktop: fixed panel on the right
  if (!isMobile) {
    return (
      <aside className="w-[380px] h-full bg-[#0A0A0A]/95 backdrop-blur-xl border-l border-white/10">
        {content}
      </aside>
    );
  }

  // Mobile: bottom drawer
  return (
    <div className="fixed inset-x-0 bottom-0 max-h-[70vh] bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl z-50">
      {content}
    </div>
  );
}
