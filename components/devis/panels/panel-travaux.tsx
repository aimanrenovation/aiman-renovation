"use client";

import { useRef } from "react";
import { CheckCircle, Circle, ChevronLeft, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getZoneConfig } from "../devis-zones-config";
import type { DevisState, DevisAction } from "../devis-types";

interface PanelTravauxProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
  isMobile: boolean;
}

export function PanelTravaux({ state, dispatch, isMobile }: PanelTravauxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!state.activeZone) return null;
  const zone = getZoneConfig(state.activeZone);
  if (!zone) return null;

  const selectedWorks = state.selectedWorks[zone.id] || [];
  const note = state.zoneNotes[zone.id] || "";
  const photos = state.zonePhotos[zone.id] || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      dispatch({ type: "ADD_ZONE_PHOTOS", zone: zone.id, files: Array.from(files) });
    }
    e.target.value = "";
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "ZOOM_OUT" })}
          className="text-white hover:bg-white/10 -ml-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-lg font-bold text-white">{zone.label}</h2>
          <p className="text-sm text-gray-400">
            {selectedWorks.length > 0
              ? `${selectedWorks.length} travaux sélectionnés`
              : "Cochez les travaux à réaliser"}
          </p>
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Liste des travaux */}
        <div className="space-y-2">
          {zone.workItems.map((item) => {
            const isSelected = selectedWorks.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => dispatch({ type: "TOGGLE_WORK", zone: zone.id, workId: item.id })}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? "bg-[#E50000]/15 border border-[#E50000]/40"
                    : "bg-white/5 border border-transparent hover:bg-white/10"
                }`}
              >
                {isSelected ? (
                  <CheckCircle className="w-5 h-5 text-[#E50000] flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
                <span className={`text-sm font-medium ${isSelected ? "text-[#E50000]" : "text-white"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Description libre */}
        <div className="space-y-2">
          <label className="text-white text-sm font-semibold">
            Décrivez vos besoins pour cette pièce
          </label>
          <Textarea
            value={note}
            onChange={(e) => dispatch({ type: "SET_ZONE_NOTE", zone: zone.id, note: e.target.value })}
            placeholder="Ex: fuite sous l'évier, carrelage fissuré, souhaite une douche italienne..."
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[80px]"
          />
        </div>

        {/* Upload photos/vidéos */}
        <div className="space-y-2">
          <label className="text-white text-sm font-semibold">
            Photos / Vidéos (optionnel)
          </label>
          <p className="text-gray-500 text-xs">Ajoutez des photos pour nous aider à comprendre vos besoins</p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-white/20 text-gray-400 hover:border-[#4A9EFF]/50 hover:text-[#4A9EFF] transition-all"
          >
            <Camera className="w-5 h-5" />
            <span className="text-sm">Ajouter des photos ou vidéos</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {photos.map((file, i) => (
                <div key={i} className="relative group">
                  {file.type.startsWith("video/") ? (
                    <div className="w-full aspect-square bg-white/5 rounded-lg flex items-center justify-center text-xs text-gray-400">
                      Vidéo
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Photo ${i + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  )}
                  <button
                    onClick={() => dispatch({ type: "REMOVE_ZONE_PHOTO", zone: zone.id, index: i })}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <Button
          onClick={() => dispatch({ type: "ZOOM_OUT" })}
          className="w-full bg-[#E50000] hover:bg-red-700 text-white"
        >
          Valider et retour au plan
        </Button>
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <div className="fixed right-0 top-16 bottom-0 w-[380px] z-30 bg-[#0A0A0A]/95 backdrop-blur-xl border-l border-white/10">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl">
      <div className="flex justify-center py-2">
        <div className="w-10 h-1 rounded-full bg-white/30" />
      </div>
      {content}
    </div>
  );
}
