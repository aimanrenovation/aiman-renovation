"use client";

import { CheckCircle, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";
import type { DevisAction } from "../devis-types";

interface StepSuccessProps {
  dispatch: React.Dispatch<DevisAction>;
}

export function StepSuccessOverlay({ dispatch }: StepSuccessProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-black/90 backdrop-blur-md rounded-3xl p-10 w-full max-w-md mx-4 shadow-2xl border border-white/10 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">Demande envoyee !</h2>
        <p className="text-gray-300 mb-6">
          Merci pour votre confiance. Nous avons bien recu votre demande de devis et vous recontactons sous 24h.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Un email de confirmation a ete envoye a votre adresse.
        </p>

        <div className="space-y-3">
          <LinkButton
            href="/"
            size="lg"
            className="w-full bg-[#E50000] hover:bg-red-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour a l&apos;accueil
          </LinkButton>
          <LinkButton
            href="tel:0633496925"
            external
            variant="outline"
            size="lg"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <Phone className="w-4 h-4 mr-2" /> Appeler maintenant
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
