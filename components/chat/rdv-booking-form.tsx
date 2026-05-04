"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  Loader2,
} from "lucide-react";

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
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [step, setStep] = useState<
    "datetime" | "contact" | "submitting" | "done"
  >("datetime");
  const [error, setError] = useState<string | null>(null);

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

  function formatHeure(h: number): string {
    return `${String(h).padStart(2, "0")}h00`;
  }

  function handleNextStep() {
    if (!selectedDate || selectedHeure === null) {
      setError("Veuillez choisir une date et un créneau.");
      return;
    }
    setError(null);
    setStep("contact");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nom.trim() || !email.trim()) {
      setError("Nom et email sont obligatoires.");
      return;
    }
    setError(null);
    setStep("submitting");

    try {
      const res = await fetch("/api/chatbot/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom.trim(),
          email: email.trim(),
          telephone: telephone.trim() || undefined,
          date: selectedDate,
          heure: selectedHeure,
          sujet: sujet || undefined,
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
          setError(
            "Ce créneau vient d'être pris. Choisissez un autre horaire.",
          );
          setStep("datetime");
          setSelectedHeure(null);
          // Refresh slots
          if (selectedDate) {
            setSlotsLoading(true);
            fetch(`/api/chatbot/book-appointment?date=${selectedDate}`)
              .then((r) => r.json())
              .then((d) => setSlots(d.slots || []))
              .finally(() => setSlotsLoading(false));
          }
        } else {
          setError(
            "Une erreur est survenue. Réessayez ou appelez le 06 33 49 69 25.",
          );
          setStep("contact");
        }
      }
    } catch {
      setError("Connexion perdue. Réessayez dans un instant.");
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

          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

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

          <div>
            <label className="mb-0.5 flex items-center gap-1 text-xs text-gray-500">
              <User className="h-3 w-3" /> Nom *
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Votre nom"
              maxLength={100}
              required
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#E50000] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-0.5 flex items-center gap-1 text-xs text-gray-500">
              <Mail className="h-3 w-3" /> Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              maxLength={200}
              required
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#E50000] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-0.5 flex items-center gap-1 text-xs text-gray-500">
              <Phone className="h-3 w-3" /> Téléphone (optionnel)
            </label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="06 XX XX XX XX"
              maxLength={20}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#E50000] focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setStep("datetime");
                setError(null);
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
