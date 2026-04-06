"use client";

import { useState } from "react";
import { ChevronLeft, Download, Share2, Camera, Ruler, CheckCircle } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    title: "Téléchargez MagicPlan",
    icon: Download,
    content: "L'application est gratuite et disponible sur iPhone et Android.",
    action: {
      label: "Ouvrir MagicPlan",
      onClick: () => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const store = isIOS
          ? "https://apps.apple.com/app/magicplan/id427424432"
          : "https://play.google.com/store/apps/details?id=com.sensopia.magicplan";
        window.location.href = "magicplan://";
        setTimeout(() => { window.location.href = store; }, 1500);
      },
    },
  },
  {
    title: "Scannez chaque pièce",
    icon: Camera,
    content:
      "Ouvrez l'app, créez un nouveau projet, puis scannez chaque pièce en suivant les instructions. Pointez votre téléphone vers les coins de la pièce — MagicPlan détecte les murs automatiquement.",
    tips: [
      "Commencez par la pièce principale",
      "Tenez le téléphone à hauteur de poitrine",
      "Tournez lentement, coin par coin",
      "Les portes et fenêtres sont détectées automatiquement",
    ],
  },
  {
    title: "Vérifiez les mesures",
    icon: Ruler,
    content:
      "Une fois toutes les pièces scannées, vérifiez le plan 2D généré. Corrigez les mesures si besoin en tapant sur les cotes.",
  },
  {
    title: "Partagez-nous le plan",
    icon: Share2,
    content:
      "Exportez votre plan depuis MagicPlan (bouton Partager), puis ajoutez le fichier ou le lien dans votre demande de devis. On reçoit les mesures exactes pour un chiffrage précis.",
    tips: [
      "Export PDF ou lien de partage",
      "Joignez-le dans le champ 'Message' du devis",
      "Ou envoyez-le par email à contact@aiman-renovation.fr",
    ],
  },
];

export default function MagicPlanGuidePage() {
  const [openStep, setOpenStep] = useState(0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/10 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/devis"
            className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Retour au devis</span>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <Ruler className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold">
            Scannez vos pièces avec{" "}
            <span className="text-blue-400">MagicPlan</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            En 5 minutes, obtenez un plan précis de votre maison. On utilise
            vos mesures pour un devis au centime près.
          </p>
          <div className="flex justify-center gap-3">
            {["Gratuit", "5 min", "Sans compte"].map((t) => (
              <span
                key={t}
                className="bg-white/5 border border-white/10 text-white/70 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isOpen = openStep === i;
            const isDone = openStep > i;

            return (
              <div
                key={i}
                className={`rounded-xl border transition-all ${
                  isOpen
                    ? "bg-white/5 border-blue-500/40"
                    : isDone
                    ? "bg-white/[0.02] border-green-500/30"
                    : "bg-white/[0.02] border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenStep(i)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDone
                        ? "bg-green-500/20"
                        : isOpen
                        ? "bg-blue-500/20"
                        : "bg-white/5"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${
                          isOpen ? "text-blue-400" : "text-gray-500"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">
                        Étape {i + 1}
                      </span>
                    </div>
                    <h3
                      className={`font-semibold text-sm ${
                        isDone ? "text-green-300" : "text-white"
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    <p className="text-gray-400 text-sm leading-relaxed pl-14">
                      {step.content}
                    </p>

                    {step.tips && (
                      <div className="pl-14 space-y-1.5">
                        {step.tips.map((tip, j) => (
                          <div
                            key={j}
                            className="flex items-start gap-2 text-xs text-gray-500"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {step.action && (
                      <div className="pl-14">
                        <button
                          onClick={step.action.onClick}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                        >
                          {step.action.label}
                        </button>
                      </div>
                    )}

                    {i < STEPS.length - 1 && (
                      <div className="pl-14">
                        <button
                          onClick={() => setOpenStep(i + 1)}
                          className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
                        >
                          Suivant →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-[#111] border border-white/10 rounded-xl p-5 text-center space-y-3">
          <p className="text-gray-400 text-sm">
            Pas de téléphone sous la main ? Pas de souci.
          </p>
          <p className="text-white text-sm font-medium">
            Envoyez votre devis maintenant, vous pourrez nous transmettre le
            plan MagicPlan plus tard par email.
          </p>
          <Link
            href="/devis"
            className="inline-block bg-[#E50000] hover:bg-red-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Retour au devis
          </Link>
        </div>
      </div>
    </div>
  );
}
