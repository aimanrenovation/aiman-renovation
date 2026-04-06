"use client";

import { useRef, useEffect } from "react";
import { CheckCircle, Phone, ArrowLeft, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/link-button";
import type { DevisAction } from "../devis-types";

interface StepSuccessProps {
  dispatch: React.Dispatch<DevisAction>;
  magicplanProjectId: string | null;
}

function QRCodeCanvas({ value, size = 160 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Placeholder — will be replaced by qrcode library in Task 10
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";

    const lines = value.match(/.{1,20}/g) || [value];
    lines.forEach((line, i) => {
      ctx.fillText(line, size / 2, size / 2 - (lines.length * 6) + i * 14);
    });
  }, [value, size]);

  return <canvas ref={canvasRef} width={size} height={size} className="rounded-lg" />;
}

export function StepSuccessOverlay({ dispatch, magicplanProjectId }: StepSuccessProps) {
  const t = useTranslations("devis.success");

  const deepLink = magicplanProjectId
    ? `magicplanstd://project/${magicplanProjectId}`
    : null;

  return (
    <div className="w-full max-w-md mx-4">
      <div className="bg-[#111] rounded-3xl p-10 shadow-2xl border border-white/10 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">{t("title")}</h2>
        <p className="text-gray-300 mb-6">{t("message")}</p>
        <p className="text-gray-400 text-sm mb-8">{t("email_sent")}</p>

        {deepLink && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 mb-8 space-y-4">
            <div className="flex items-center justify-center gap-2 text-blue-400">
              <Smartphone className="w-5 h-5" />
              <h3 className="font-semibold text-sm">{t("magicplan_title")}</h3>
            </div>
            <p className="text-gray-300 text-sm">{t("magicplan_subtitle")}</p>

            <div className="flex justify-center">
              <QRCodeCanvas value={deepLink} />
            </div>

            <a
              href={deepLink}
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors text-center"
            >
              {t("magicplan_open")}
            </a>

            <p className="text-gray-500 text-xs">{t("magicplan_hint")}</p>
          </div>
        )}

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
