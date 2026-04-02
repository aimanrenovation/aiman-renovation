"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Image,
} from "lucide-react";
import type { DevisFormState, DevisAction } from "../devis-types";

interface StepPhotosContactProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

export function StepPhotosContactOverlay({ state, dispatch }: StepPhotosContactProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      dispatch({ type: "ADD_PHOTOS", files: Array.from(files) });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isValid =
    state.contact.firstName.trim() !== "" &&
    state.contact.phone.trim() !== "" &&
    state.contact.email.trim() !== "";

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-black/85 backdrop-blur-md rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl border border-white/10 max-h-[85vh] overflow-y-auto">
        <p className="text-sm text-gray-400 uppercase tracking-wider mb-1 text-center">Etape 5 / 6</p>
        <h2 className="text-2xl font-bold text-white text-center mb-6">Photos et coordonnees</h2>

        {/* Upload photos */}
        <div className="space-y-3 mb-6">
          <Label className="text-white flex items-center gap-2">
            <Image className="w-4 h-4 text-[#E50000]" />
            Photos de l&apos;existant (optionnel)
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-[#E50000]/50 transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-white text-sm">Cliquez pour ajouter des photos</p>
            <p className="text-gray-500 text-xs mt-1">JPG, PNG — max 10 Mo par fichier</p>
          </button>

          {/* Apercu photos */}
          {state.photos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {state.photos.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>
                  <button
                    onClick={() => dispatch({ type: "REMOVE_PHOTO", index })}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  <p className="text-[10px] text-gray-500 truncate w-16 mt-0.5">{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coordonnees */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white text-sm flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#E50000]" /> Prenom *
              </Label>
              <Input
                value={state.contact.firstName}
                onChange={(e) => dispatch({ type: "SET_CONTACT", field: "firstName", value: e.target.value })}
                placeholder="Prenom"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white text-sm">Nom</Label>
              <Input
                value={state.contact.lastName}
                onChange={(e) => dispatch({ type: "SET_CONTACT", field: "lastName", value: e.target.value })}
                placeholder="Nom"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-white text-sm flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#E50000]" /> Telephone *
            </Label>
            <Input
              type="tel"
              value={state.contact.phone}
              onChange={(e) => dispatch({ type: "SET_CONTACT", field: "phone", value: e.target.value })}
              placeholder="06 12 34 56 78"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white text-sm flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#E50000]" /> Email *
            </Label>
            <Input
              type="email"
              value={state.contact.email}
              onChange={(e) => dispatch({ type: "SET_CONTACT", field: "email", value: e.target.value })}
              placeholder="votre@email.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white text-sm flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#E50000]" /> Adresse du chantier
            </Label>
            <Input
              value={state.contact.address}
              onChange={(e) => dispatch({ type: "SET_CONTACT", field: "address", value: e.target.value })}
              placeholder="14 rue de la Paix, 68300 Saint-Louis"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>
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
            disabled={!isValid}
            onClick={() => dispatch({ type: "NEXT_STEP" })}
            className="bg-[#E50000] hover:bg-red-700 text-white px-8 disabled:opacity-30"
          >
            Voir le recapitulatif <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
