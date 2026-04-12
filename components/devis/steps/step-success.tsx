"use client";

import { useRef, useState } from "react";
import { CheckCircle, Phone, ArrowLeft, Smartphone, Mail, Upload, X, Loader2, AlertCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { LinkButton } from "@/components/ui/link-button";
import type { DevisAction } from "../devis-types";

interface StepSuccessProps {
  dispatch: React.Dispatch<DevisAction>;
  magicplanProjectId: string | null;
  clientEmail: string;
  clientName: string;
}

const MAX_FILES = 10;
const MAX_SIZE = 50 * 1024 * 1024;
const ACCEPT = "application/pdf,image/*,.xml,.svg";

export function StepSuccessOverlay({
  dispatch: _dispatch,
  magicplanProjectId,
  clientEmail,
  clientName,
}: StepSuccessProps) {
  const t = useTranslations("devis.success");
  const locale = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  function addFiles(files: FileList | null) {
    if (!files) return;
    const incoming = Array.from(files);
    const merged = [...selectedFiles, ...incoming].slice(0, MAX_FILES);
    setSelectedFiles(merged);
    setUploadStatus("idle");
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) return;

    // Local size validation
    for (const f of selectedFiles) {
      if (f.size > MAX_SIZE) {
        setUploadStatus("error");
        setErrorMsg(t("upload_max_size"));
        return;
      }
    }

    setUploading(true);
    setUploadStatus("idle");
    setErrorMsg("");

    try {
      const fd = new FormData();
      for (const f of selectedFiles) fd.append("files", f, f.name);
      if (magicplanProjectId) fd.append("magicplanProjectId", magicplanProjectId);
      fd.append("clientEmail", clientEmail);
      fd.append("clientName", clientName);
      fd.append("locale", locale);

      const res = await fetch("/api/devis/magicplan-upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || "upload_failed");
      }

      setUploadStatus("success");
      setSelectedFiles([]);
    } catch (err) {
      setUploadStatus("error");
      const code = err instanceof Error ? err.message : "upload_failed";
      setErrorMsg(
        code === "email_failed"
          ? t("upload_error_email")
          : code === "no_files" || code === "too_many_files"
            ? t("upload_error_count")
            : code === "file_too_large"
              ? t("upload_max_size")
              : "",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div data-lenis-prevent className="w-full max-w-md mx-4 max-h-[90dvh] overflow-y-auto overscroll-contain">
      <div className="bg-[#111] rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">{t("title")}</h2>
        <p className="text-gray-300 mb-6">{t("message")}</p>
        <p className="text-gray-400 text-sm mb-8">{t("email_sent")}</p>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 sm:p-6 mb-6 text-left">
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

        {/* Direct upload block */}
        {uploadStatus === "success" ? (
          // ✅ FULL-WIDTH SUCCESS BLOCK — persistent, large, bold
          <div className="bg-green-500/20 border-2 border-green-500 rounded-2xl p-6 sm:p-8 mb-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/40">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-400 mb-2">
              {t("upload_success_title")}
            </h3>
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
              {t("upload_success_message")}
            </p>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 sm:p-6 mb-6 text-left">
            <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
              <Upload className="w-5 h-5" />
              <h3 className="font-semibold text-sm">{t("upload_title")}</h3>
            </div>
            <p className="text-gray-300 text-xs text-center mb-4">{t("upload_subtitle")}</p>

            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPT}
              onChange={(e) => addFiles(e.target.files)}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading || selectedFiles.length >= MAX_FILES}
              className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-3 rounded-lg transition-colors mb-3"
            >
              {t("upload_choose_files")}
            </button>

            {selectedFiles.length > 0 && (
              <div className="mb-3">
                <p className="text-gray-400 text-xs mb-2">
                  {t("upload_selected")} ({selectedFiles.length}/{MAX_FILES})
                </p>
                <ul className="space-y-1.5">
                  {selectedFiles.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center justify-between gap-2 bg-white/5 rounded-lg px-3 py-2"
                    >
                      <span className="text-gray-200 text-xs truncate flex-1">
                        {f.name}{" "}
                        <span className="text-gray-500">({(f.size / 1024).toFixed(0)} KB)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        disabled={uploading}
                        className="shrink-0 text-gray-400 hover:text-red-400 disabled:opacity-40"
                        aria-label={t("upload_remove")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("upload_sending")}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {t("upload_send")}
                </>
              )}
            </button>

            {uploadStatus === "error" && (
              <div className="mt-4 bg-red-500/20 border-2 border-red-500/60 rounded-xl p-4 flex gap-3 items-start">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-red-300 text-sm font-semibold mb-1">
                    {t("upload_error_title")}
                  </p>
                  <p className="text-red-200 text-xs leading-relaxed">
                    {errorMsg ? `${errorMsg} — ` : ""}
                    {t("upload_error_call")}{" "}
                    <a href="tel:0939245515" className="underline font-semibold whitespace-nowrap">
                      09 39 24 55 15
                    </a>
                  </p>
                </div>
              </div>
            )}
            <p className="mt-3 text-gray-500 text-[10px] text-center">
              {t("upload_max_count")} · {t("upload_max_size")}
            </p>
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
            href="tel:0939245515"
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
