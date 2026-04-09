"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { ChevronLeft, Send, Loader2, Ruler } from "lucide-react";
import { ZONES_CONFIG } from "../devis-zones-config";
import { AddressAutocomplete } from "./address-autocomplete";
import type { DevisState, DevisAction, BudgetRange } from "../devis-types";
import {
  validateName,
  validateEmailFormat,
  validatePhone,
  validateAddressString,
} from "@/lib/validation/devis";

interface PanelRecapProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
  onSubmit: (extra: { honeypot: string }) => void;
}

const BUDGET_OPTIONS: BudgetRange[] = [
  "< 5000",
  "5000-15000",
  "15000-30000",
  "30000-50000",
  "> 50000",
];

function MagicPlanSection() {
  const t = useTranslations("devis.panel_recap");

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Ruler className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm">{t("magicplan_title")}</h4>
          <p className="text-gray-400 text-xs mt-1">{t("magicplan_auto_info")}</p>
        </div>
      </div>
    </div>
  );
}

type FieldName = "firstName" | "lastName" | "phone" | "email" | "address";

export function PanelRecap({ state, dispatch, onSubmit }: PanelRecapProps) {
  const t = useTranslations("devis.panel_recap");
  const tZones = useTranslations("devis.zones");
  const tErrors = useTranslations("devis.validation");

  // Honeypot — bots fill, humans don't
  const [honeypot, setHoneypot] = useState("");

  // Track which fields have been touched (for onBlur validation)
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    firstName: false,
    lastName: false,
    phone: false,
    email: false,
    address: false,
  });

  function markTouched(field: FieldName) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  const zonesWithWorks = ZONES_CONFIG.filter(
    (z) => state.selectedWorks[z.id] && state.selectedWorks[z.id].length > 0
  );

  const totalWorks = zonesWithWorks.reduce(
    (sum, z) => sum + state.selectedWorks[z.id].length,
    0
  );

  // --- Per-field validation results ---
  const errors = useMemo(() => {
    const r: Partial<Record<FieldName, string>> = {};
    const c = state.contact;

    const firstName = validateName(c.firstName);
    if (!firstName.ok) r.firstName = firstName.code;

    const lastName = validateName(c.lastName);
    if (!lastName.ok) r.lastName = lastName.code;

    const email = validateEmailFormat(c.email);
    if (!email.ok) r.email = email.code;

    const phone = validatePhone(c.phone);
    if (!phone.ok) r.phone = phone.code;

    // Address: must be both format-valid AND geocoded via Mapbox selection
    const addrFormat = validateAddressString(c.address);
    if (!addrFormat.ok) {
      r.address = addrFormat.code;
    } else if (!c.addressValidated) {
      r.address = "address_not_geocoded";
    }

    return r;
  }, [state.contact]);

  const isFormValid =
    Object.keys(errors).length === 0 && totalWorks > 0 && honeypot === "";

  function fieldError(field: FieldName): string | null {
    if (!touched[field]) return null;
    const code = errors[field];
    if (!code) return null;
    try {
      return tErrors(code);
    } catch {
      return tErrors("generic");
    }
  }

  return (
    <div className="bg-[#0A0A0A] px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => dispatch({ type: "ZOOM_OUT" })}
            className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{t("back")}</span>
          </button>
          <h2 className="text-xl font-semibold text-white">{t("title")}</h2>
          <span className="text-sm text-white/50">
            {t("works_zones", { works: totalWorks, zones: zonesWithWorks.length })}
          </span>
        </div>

        {/* Zones avec travaux */}
        <div className="space-y-3">
          {zonesWithWorks.map((zone) => (
            <div
              key={zone.id}
              className="bg-[#111] rounded-xl border border-white/10 p-4"
            >
              <h3 className="text-white font-medium mb-2">{tZones(`${zone.labelKey}.label`)}</h3>
              <div className="flex flex-wrap gap-2">
                {state.selectedWorks[zone.id].map((workId) => {
                  const workItem = zone.workItems.find(
                    (w) => w.id === workId
                  );
                  const workLabel = workItem
                    ? tZones(`${zone.labelKey}.workItems.${workItem.labelKey}`)
                    : workId;
                  return (
                    <Badge
                      key={workId}
                      className="bg-[#E50000] text-white hover:bg-[#E50000]/80 border-none"
                    >
                      {workLabel}
                    </Badge>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">{t("budget_title")}</h3>
          <div className="flex flex-wrap gap-2">
            {BUDGET_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() =>
                  dispatch({
                    type: "SET_BUDGET",
                    budget: state.budget === option ? null : option,
                  })
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  state.budget === option
                    ? "bg-[#E50000] text-white border-[#E50000]"
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                }`}
              >
                {option} €
              </button>
            ))}
          </div>
        </div>

        {/* MagicPlan CTA */}
        <MagicPlanSection />

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-white font-medium">
            {t("message_label")}
          </Label>
          <Textarea
            id="message"
            placeholder={t("message_placeholder")}
            value={state.message}
            onChange={(e) =>
              dispatch({ type: "SET_MESSAGE", message: e.target.value })
            }
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
          />
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-white font-medium">{t("contact_title")}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-white/70 text-sm">
                {t("label_firstname")}
              </Label>
              <Input
                id="firstName"
                value={state.contact.firstName}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CONTACT",
                    field: "firstName",
                    value: e.target.value,
                  })
                }
                onBlur={() => markTouched("firstName")}
                aria-invalid={!!fieldError("firstName")}
                className={`bg-white/5 text-white ${fieldError("firstName") ? "border-red-500/60" : "border-white/10"}`}
              />
              {fieldError("firstName") && (
                <p className="text-red-400 text-xs">{fieldError("firstName")}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-white/70 text-sm">
                {t("label_lastname")}
              </Label>
              <Input
                id="lastName"
                value={state.contact.lastName}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CONTACT",
                    field: "lastName",
                    value: e.target.value,
                  })
                }
                onBlur={() => markTouched("lastName")}
                aria-invalid={!!fieldError("lastName")}
                className={`bg-white/5 text-white ${fieldError("lastName") ? "border-red-500/60" : "border-white/10"}`}
              />
              {fieldError("lastName") && (
                <p className="text-red-400 text-xs">{fieldError("lastName")}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-white/70 text-sm">
              {t("label_phone")}
            </Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={state.contact.phone}
              onChange={(e) =>
                dispatch({
                  type: "SET_CONTACT",
                  field: "phone",
                  value: e.target.value,
                })
              }
              onBlur={() => markTouched("phone")}
              aria-invalid={!!fieldError("phone")}
              className={`bg-white/5 text-white ${fieldError("phone") ? "border-red-500/60" : "border-white/10"}`}
              placeholder="+33 6 33 49 69 25"
            />
            {fieldError("phone") && (
              <p className="text-red-400 text-xs">{fieldError("phone")}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white/70 text-sm">
              {t("label_email")}
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={state.contact.email}
              onChange={(e) =>
                dispatch({
                  type: "SET_CONTACT",
                  field: "email",
                  value: e.target.value,
                })
              }
              onBlur={() => markTouched("email")}
              aria-invalid={!!fieldError("email")}
              className={`bg-white/5 text-white ${fieldError("email") ? "border-red-500/60" : "border-white/10"}`}
            />
            {fieldError("email") && (
              <p className="text-red-400 text-xs">{fieldError("email")}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-white/70 text-sm">
              {t("label_address")}
            </Label>
            <AddressAutocomplete
              value={state.contact.address}
              validated={state.contact.addressValidated}
              invalid={!!fieldError("address")}
              onTypingChange={(val) => {
                dispatch({ type: "SET_CONTACT", field: "address", value: val });
                if (!touched.address) markTouched("address");
              }}
              onSelect={({ address, lat, lng }) => {
                dispatch({ type: "SET_ADDRESS_GEO", address, lat, lng });
                markTouched("address");
              }}
            />
            {fieldError("address") ? (
              <p className="text-red-400 text-xs">{fieldError("address")}</p>
            ) : (
              <p className="text-gray-500 text-xs">{t("address_hint")}</p>
            )}
          </div>

          {/* Honeypot — hidden from humans, bots fill it. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              top: "-9999px",
              width: 0,
              height: 0,
              overflow: "hidden",
            }}
          >
            <label htmlFor="website-url">Website</label>
            <input
              id="website-url"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>
        </div>

        {/* Error */}
        {state.error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {state.error}
          </div>
        )}

        {/* Submit */}
        <Button
          onClick={() => onSubmit({ honeypot })}
          disabled={!isFormValid || state.isSubmitting}
          className="w-full bg-[#E50000] hover:bg-[#E50000]/90 text-white font-semibold py-6 text-base disabled:opacity-40"
        >
          {state.isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              {t("submit_sending")}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {t("submit_button")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
