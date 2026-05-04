"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  CalendarDays,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle,
  Loader2,
  Check,
} from "lucide-react";
import {
  validateName,
  validateEmailFormat,
  validatePhone,
  validateAddressString,
} from "@/lib/validation/devis";

interface RdvBookingFormProps {
  conversationId: string | null;
  sujet?: string;
  onSuccess: (slot: { date: string; heure: number }) => void;
  onCancel: () => void;
}

const TODAY = new Date();
const MAX_DAYS_AHEAD = 30;

/** Format YYYY-MM-DD */
function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Next N weekdays (+ Saturday) from today, skipping Sundays */
function getAvailableDates(): { value: string; label: string }[] {
  const dates: { value: string; label: string }[] = [];
  const d = new Date(TODAY);
  d.setDate(d.getDate() + 1); // start from tomorrow
  while (dates.length < 10) {
    const dow = d.getDay(); // 0=Sun
    if (dow !== 0) {
      dates.push({
        value: toDateStr(d),
        label: new Intl.DateTimeFormat("fr-FR", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }).format(d),
      });
    }
    d.setDate(d.getDate() + 1);
    if (d.getTime() > TODAY.getTime() + MAX_DAYS_AHEAD * 86400000) break;
  }
  return dates;
}

// ---- Subject validation ----
const GENERIC_SUBJECTS = [
  "rdv",
  "test",
  "j'en sais rien",
  "je sais pas",
  "bonjour",
  "hello",
  "rien",
  "...",
  "???",
  "aaaa",
  "asdf",
];

function validateSubject(raw: string): { ok: boolean; msg?: string } {
  const v = raw.trim();
  if (v.length < 10)
    return {
      ok: false,
      msg: "Décrivez votre projet en au moins 10 caractères.",
    };
  if (GENERIC_SUBJECTS.some((g) => v.toLowerCase() === g)) {
    return { ok: false, msg: "Veuillez décrire votre projet de rénovation." };
  }
  return { ok: true };
}

// ---- Mapbox autocomplete (inline, light version for chat widget) ----
interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
}

interface AddressFieldProps {
  value: string;
  validated: boolean;
  onTypingChange: (v: string) => void;
  onSelect: (params: { address: string; lat: number; lng: number }) => void;
  error?: string;
}

function AddressField({
  value,
  validated,
  onTypingChange,
  onSelect,
  error,
}: AddressFieldProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<MapboxFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      const features: MapboxFeature[] = data.features || [];
      setResults(features);
      setIsOpen(features.length > 0);
    } catch {
      setResults([]);
      setIsOpen(false);
    }
    setIsLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onTypingChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (f: MapboxFeature) => {
    setQuery(f.place_name);
    onSelect({ address: f.place_name, lat: f.center[1], lng: f.center[0] });
    setIsOpen(false);
    setResults([]);
  };

  const borderClass = error
    ? "border-red-400"
    : validated
      ? "border-green-400"
      : "border-gray-200";

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="11 rue de Bâle, 68300 Saint-Louis"
          className={`w-full rounded-lg border ${borderClass} pl-7 pr-8 py-1.5 text-xs text-gray-900 focus:border-[#E50000] focus:outline-none`}
        />
        {isLoading && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-gray-400" />
        )}
        {!isLoading && validated && (
          <Check className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-green-500" />
        )}
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-40 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => handleSelect(r)}
              className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 flex items-start gap-1.5"
            >
              <MapPin className="w-3 h-3 text-[#E50000] flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{r.place_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Error message for a field ----
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-0.5 text-[11px] text-red-500">{msg}</p>;
}

// ---- Main form ----

export function RdvBookingForm({
  conversationId,
  sujet,
  onSuccess,
  onCancel,
}: RdvBookingFormProps) {
  const availableDates = getAvailableDates();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<number[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedHeure, setSelectedHeure] = useState<number | null>(null);

  // Contact fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [addressValidated, setAddressValidated] = useState(false);
  const [addressCoords, setAddressCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [subjectField, setSubjectField] = useState(sujet || "");

  // Per-field errors (shown after blur or submit attempt)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [step, setStep] = useState<
    "datetime" | "contact" | "submitting" | "done"
  >("datetime");
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    setSlots([]);
    setSelectedHeure(null);
    fetch(`/api/chatbot/book-appointment?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots || []);
      })
      .catch(() => setSlots([8, 9, 10, 11, 14, 15, 16]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate]);

  // Sync sujet prop to subjectField
  useEffect(() => {
    if (sujet && !subjectField) setSubjectField(sujet);
  }, [sujet]); // eslint-disable-line react-hooks/exhaustive-deps

  function formatHeure(h: number): string {
    return `${String(h).padStart(2, "0")}h00`;
  }

  function handleNextStep() {
    if (!selectedDate || selectedHeure === null) {
      setGlobalError("Veuillez choisir une date et un créneau.");
      return;
    }
    setGlobalError(null);
    setStep("contact");
  }

  // Validate a single field and return error string or ""
  function validateField(name: string, value: string): string {
    switch (name) {
      case "firstName": {
        const r = validateName(value);
        if (!r.ok)
          return "Prénom invalide (min. 2 caractères, pas de test/pseudo).";
        return "";
      }
      case "lastName": {
        const r = validateName(value);
        if (!r.ok)
          return "Nom invalide (min. 2 caractères, pas de test/pseudo).";
        return "";
      }
      case "telephone": {
        const r = validatePhone(value);
        if (!r.ok)
          return "Téléphone invalide (FR/CH/DE/LU, ex: 06 33 49 69 25).";
        return "";
      }
      case "email": {
        const r = validateEmailFormat(value);
        if (!r.ok) return "Email invalide.";
        return "";
      }
      case "address": {
        if (!addressValidated) return "Sélectionnez une adresse dans la liste.";
        const r = validateAddressString(value);
        if (!r.ok) return "Adresse incomplète (numéro + rue requis).";
        return "";
      }
      case "subjectField": {
        const r = validateSubject(value);
        if (!r.ok) return r.msg!;
        return "";
      }
      default:
        return "";
    }
  }

  function handleBlur(name: string, value: string) {
    setTouched((t) => ({ ...t, [name]: true }));
    const err = validateField(name, value);
    setFieldErrors((fe) => ({ ...fe, [name]: err }));
  }

  // Validate all contact fields; returns true if all OK
  function validateAllFields(): boolean {
    const fields: [string, string][] = [
      ["firstName", firstName],
      ["lastName", lastName],
      ["telephone", telephone],
      ["email", email],
      ["address", address],
      ["subjectField", subjectField],
    ];
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    let hasError = false;
    for (const [name, val] of fields) {
      newTouched[name] = true;
      const err = validateField(name, val);
      newErrors[name] = err;
      if (err) hasError = true;
    }
    setTouched(newTouched);
    setFieldErrors(newErrors);
    return !hasError;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAllFields()) {
      setGlobalError("Corrigez les erreurs ci-dessus avant de confirmer.");
      return;
    }
    setGlobalError(null);
    setStep("submitting");

    try {
      const res = await fetch("/api/chatbot/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          telephone: telephone.trim(),
          address: address.trim(),
          addressValidated,
          addressLat: addressCoords?.lat,
          addressLng: addressCoords?.lng,
          date: selectedDate,
          heure: selectedHeure,
          sujet: subjectField.trim() || sujet || undefined,
          conversationId,
        }),
      });

      if (res.ok) {
        setStep("done");
        setTimeout(
          () => onSuccess({ date: selectedDate, heure: selectedHeure! }),
          2000,
        );
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.error === "slot_taken") {
          setGlobalError(
            "Ce créneau vient d'être pris. Choisissez un autre horaire.",
          );
          setStep("datetime");
          setSelectedHeure(null);
          if (selectedDate) {
            setSlotsLoading(true);
            fetch(`/api/chatbot/book-appointment?date=${selectedDate}`)
              .then((r) => r.json())
              .then((d) => setSlots(d.slots || []))
              .finally(() => setSlotsLoading(false));
          }
        } else if (data.field) {
          // Server-side field error
          setFieldErrors((fe) => ({
            ...fe,
            [data.field]: data.detail || "Champ invalide.",
          }));
          setGlobalError("Corrigez les erreurs et réessayez.");
          setStep("contact");
        } else {
          setGlobalError(
            "Une erreur est survenue. Réessayez ou appelez le 06 33 49 69 25.",
          );
          setStep("contact");
        }
      }
    } catch {
      setGlobalError("Connexion perdue. Réessayez dans un instant.");
      setStep("contact");
    }
  }

  if (step === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-green-50 p-5 text-center">
        <CheckCircle className="h-10 w-10 text-green-500" />
        <p className="text-sm font-semibold text-green-800">RDV confirmé !</p>
        <p className="text-xs text-green-700">
          Un email de confirmation vous a été envoyé.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
        <CalendarDays className="h-4 w-4 text-[#E50000]" />
        Choisissez un créneau
      </p>

      {step === "datetime" && (
        <>
          {/* Date selector */}
          <div className="mb-3">
            <label className="mb-1 block text-xs text-gray-500">Date</label>
            <div className="flex flex-wrap gap-1.5">
              {availableDates.slice(0, 6).map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setSelectedDate(d.value)}
                  className={[
                    "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
                    selectedDate === d.value
                      ? "border-[#E50000] bg-[#E50000] text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-[#E50000]",
                  ].join(" ")}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div className="mb-3">
              <label className="mb-1 flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" /> Heure
              </label>
              {slotsLoading ? (
                <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
                  <Loader2 className="h-3 w-3 animate-spin" /> Chargement des
                  créneaux…
                </div>
              ) : slots.length === 0 ? (
                <p className="text-xs text-gray-400">
                  Aucun créneau disponible ce jour.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {slots.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setSelectedHeure(h)}
                      className={[
                        "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
                        selectedHeure === h
                          ? "border-[#E50000] bg-[#E50000] text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-[#E50000]",
                      ].join(" ")}
                    >
                      {formatHeure(h)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {globalError && (
            <p className="mb-2 text-xs text-red-500">{globalError}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={!selectedDate || selectedHeure === null}
              className="flex-1 rounded-lg bg-[#E50000] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#CC0000] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Suivant →
            </button>
          </div>
        </>
      )}

      {(step === "contact" || step === "submitting") && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <p className="text-xs text-gray-500">
            {selectedDate &&
              selectedHeure !== null &&
              `${new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${selectedDate}T12:00:00`))} à ${formatHeure(selectedHeure)}`}
          </p>

          {/* Prénom + Nom */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-0.5 flex items-center gap-1 text-xs text-gray-500">
                <User className="h-3 w-3" /> Prénom *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => handleBlur("firstName", firstName)}
                placeholder="Prénom"
                maxLength={50}
                required
                className={`w-full rounded-lg border px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#E50000] focus:outline-none ${touched.firstName && fieldErrors.firstName ? "border-red-400" : "border-gray-200"}`}
              />
              {touched.firstName && <FieldError msg={fieldErrors.firstName} />}
            </div>
            <div className="flex-1">
              <label className="mb-0.5 flex items-center gap-1 text-xs text-gray-500">
                <User className="h-3 w-3" /> Nom *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => handleBlur("lastName", lastName)}
                placeholder="Nom"
                maxLength={50}
                required
                className={`w-full rounded-lg border px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#E50000] focus:outline-none ${touched.lastName && fieldErrors.lastName ? "border-red-400" : "border-gray-200"}`}
              />
              {touched.lastName && <FieldError msg={fieldErrors.lastName} />}
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <label className="mb-0.5 flex items-center gap-1 text-xs text-gray-500">
              <Phone className="h-3 w-3" /> Téléphone *
            </label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              onBlur={() => handleBlur("telephone", telephone)}
              placeholder="06 33 49 69 25 ou +41 XX XXX XX XX"
              maxLength={25}
              required
              className={`w-full rounded-lg border px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#E50000] focus:outline-none ${touched.telephone && fieldErrors.telephone ? "border-red-400" : "border-gray-200"}`}
            />
            {touched.telephone && <FieldError msg={fieldErrors.telephone} />}
          </div>

          {/* Email */}
          <div>
            <label className="mb-0.5 flex items-center gap-1 text-xs text-gray-500">
              <Mail className="h-3 w-3" /> Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email", email)}
              placeholder="votre@email.com"
              maxLength={200}
              required
              className={`w-full rounded-lg border px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#E50000] focus:outline-none ${touched.email && fieldErrors.email ? "border-red-400" : "border-gray-200"}`}
            />
            {touched.email && <FieldError msg={fieldErrors.email} />}
          </div>

          {/* Adresse chantier */}
          <div>
            <label className="mb-0.5 flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" /> Adresse du chantier *
            </label>
            <AddressField
              value={address}
              validated={addressValidated}
              onTypingChange={(v) => {
                setAddress(v);
                setAddressValidated(false);
                setAddressCoords(null);
                if (touched.address) {
                  setFieldErrors((fe) => ({
                    ...fe,
                    address: "Sélectionnez une adresse dans la liste.",
                  }));
                }
              }}
              onSelect={({ address: a, lat, lng }) => {
                setAddress(a);
                setAddressValidated(true);
                setAddressCoords({ lat, lng });
                setTouched((t) => ({ ...t, address: true }));
                setFieldErrors((fe) => ({ ...fe, address: "" }));
              }}
              error={touched.address ? fieldErrors.address : undefined}
            />
            {touched.address && <FieldError msg={fieldErrors.address} />}
            {!addressValidated && address.length > 0 && !touched.address && (
              <p className="mt-0.5 text-[11px] text-amber-500">
                Choisissez une adresse dans la liste de suggestions.
              </p>
            )}
          </div>

          {/* Sujet */}
          <div>
            <label className="mb-0.5 flex items-center gap-1 text-xs text-gray-500">
              <MessageSquare className="h-3 w-3" /> Sujet / projet *
            </label>
            <input
              type="text"
              value={subjectField}
              onChange={(e) => setSubjectField(e.target.value)}
              onBlur={() => handleBlur("subjectField", subjectField)}
              placeholder="Ex: rénovation salle de bain, carrelage, peinture…"
              maxLength={300}
              required
              className={`w-full rounded-lg border px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#E50000] focus:outline-none ${touched.subjectField && fieldErrors.subjectField ? "border-red-400" : "border-gray-200"}`}
            />
            {touched.subjectField && (
              <FieldError msg={fieldErrors.subjectField} />
            )}
          </div>

          {globalError && <p className="text-xs text-red-500">{globalError}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setStep("datetime");
                setGlobalError(null);
              }}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50"
              disabled={step === "submitting"}
            >
              ← Retour
            </button>
            <button
              type="submit"
              disabled={step === "submitting"}
              className="flex-1 rounded-lg bg-[#E50000] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#CC0000] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === "submitting" ? (
                <span className="flex items-center justify-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Réservation…
                </span>
              ) : (
                "Confirmer le RDV"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
