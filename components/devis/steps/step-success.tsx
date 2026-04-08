"use client";

import { CheckCircle, Phone, ArrowLeft, Smartphone, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/link-button";
import type { DevisAction } from "../devis-types";

interface StepSuccessProps {
  dispatch: React.Dispatch<DevisAction>;
  magicplanProjectId: string | null;
}

export function StepSuccessOverlay({ dispatch: _dispatch, magicplanProjectId: _magicplanProjectId }: StepSuccessProps) {
  const t = useTranslations("devis.success");

  return (
    <div className="w-full max-w-md mx-4">
      <div className="bg-[#111] rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">{t("title")}</h2>
        <p className="text-gray-300 mb-6">{t("message")}</p>
        <p className="text-gray-400 text-sm mb-8">{t("email_sent")}</p>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 sm:p-6 mb-8 text-left">
          <div className="flex items-center justify-center gap-2 text-blue-400 mb-3">
            <Smartphone className="w-5 h-5" />
            <h3 className="font-semibold text-sm">{t("magicplan_title")}</h3>
          </div>
          <p className="text-gray-300 text-sm text-center mb-5">{t("magicplan_subtitle")}</p>

          <ol className="space-y-3 mb-5">
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center">1</span>
              <span className="text-gray-300 text-sm leading-relaxed">{t("magicplan_step1")}</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center">2</span>
              <span className="text-gray-300 text-sm leading-relaxed">{t("magicplan_step2")}</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center">3</span>
              <span className="text-gray-300 text-sm leading-relaxed">
                {t("magicplan_step3")}{" "}
                <a href="mailto:contact@aiman-renovation.fr" className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1">
                  <Mail className="w-3 h-3" />contact@aiman-renovation.fr
                </a>
              </span>
            </li>
          </ol>

          <div className="flex gap-2">
            <a
              href="https://apps.apple.com/app/magicplan/id427424432"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium py-3 rounded-lg text-center transition-colors"
            >
              📱 App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.sensopia.magicplan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium py-3 rounded-lg text-center transition-colors"
            >
              🤖 Play Store
            </a>
          </div>
        </div>

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
