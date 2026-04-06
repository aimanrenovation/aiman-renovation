"use client";

import { CheckCircle, Phone, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import type { DevisAction } from "../devis-types";

interface StepSuccessProps {
  dispatch: React.Dispatch<DevisAction>;
}

export function StepSuccessOverlay({ dispatch }: StepSuccessProps) {
  const t = useTranslations("devis.success");

  return (
    <div className="w-full max-w-md mx-4">
      <div className="bg-[#111] rounded-3xl p-10 shadow-2xl border border-white/10 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">{t("title")}</h2>
        <p className="text-gray-300 mb-6">
          {t("message")}
        </p>
        <p className="text-gray-400 text-sm mb-8">
          {t("email_sent")}
        </p>

        <div className="space-y-3">
          <LinkButton
            href="/"
            size="lg"
            className="w-full bg-[#E50000] hover:bg-red-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> {t("back_home")}
          </LinkButton>
          <LinkButton
            href="tel:0633496925"
            external
            variant="outline"
            size="lg"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <Phone className="w-4 h-4 mr-2" /> {t("call_now")}
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
