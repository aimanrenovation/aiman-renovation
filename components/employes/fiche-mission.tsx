"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FicheMission } from "@/lib/employes/types-mission";

interface Props {
  chantierId: string;
}

export function FicheMissionClient({ chantierId }: Props) {
  const [mission, setMission] = useState<FicheMission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [etapes, setEtapes] = useState<FicheMission["etapes"]>([]);
  const [materiel, setMateriel] = useState<FicheMission["materiel"]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/employes/mission/${chantierId}`);
        if (!res.ok) throw new Error("Impossible de charger la fiche mission.");
        const data: FicheMission = await res.json();
        if (cancelled) return;
        setMission(data);
        setEtapes(data.etapes);
        setMateriel(data.materiel);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur");
      }
    }
    load();
    return () => { cancelled = true; };
  }, [chantierId]);

  function toggleEtape(index: number) {
    setEtapes((prev) =>
      prev.map((e, i) => (i === index ? { ...e, done: !e.done } : e))
    );
  }

  function toggleMateriel(index: number) {
    setMateriel((prev) =>
      prev.map((m, i) => (i === index ? { ...m, checked: !m.checked } : m))
    );
  }

  function mapsUrl(lat: number, lng: number, adresse: string) {
    const q = encodeURIComponent(`${adresse}`);
    // On iOS / Android, geo: intent ouvre Maps nativement ; sinon Google Maps web
    if (typeof navigator !== "undefined" && /iPhone|iPad/i.test(navigator.userAgent)) {
      return `maps://maps.apple.com/?daddr=${lat},${lng}&q=${q}`;
    }
    if (typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent)) {
      return `geo:${lat},${lng}?q=${q}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
        <Link
          href="/espace-employes/dashboard"
          className="text-sm font-medium text-[#E50000] underline-offset-2 hover:underline"
        >
          &larr; Retour au dashboard
        </Link>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200" />
        <div className="h-32 animate-pulse rounded-2xl bg-neutral-100" />
        <div className="h-48 animate-pulse rounded-2xl bg-neutral-100" />
      </div>
    );
  }

  const adresseComplete = `${mission.adresse}, ${mission.codePostal} ${mission.ville}`;

  return (
    <div className="flex flex-col gap-5 pb-4">
      {/* Retour */}
      <Link
        href="/espace-employes/dashboard"
        className="inline-flex items-center gap-1 text-sm font-medium text-[#E50000]"
      >
        <span>&larr;</span> Retour
      </Link>

      {/* Header chantier */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-lg font-bold text-neutral-900">{mission.chantierNom}</h1>
        <p className="mt-1 text-sm text-neutral-500">{adresseComplete}</p>
        <p className="mt-1 text-xs text-neutral-400">Client : {mission.clientNom}</p>

        {mission.tempsTrajet && (
          <p className="mt-2 text-xs text-neutral-500">
            Trajet estimé : {mission.tempsTrajet.minutes} min ({mission.tempsTrajet.km} km)
          </p>
        )}

        <a
          href={mapsUrl(mission.lat, mission.lng, adresseComplete)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-[#E50000] px-4 text-sm font-semibold text-white shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145c.186-.1.446-.25.749-.449a13.688 13.688 0 002.34-1.97C15.752 14.105 18 10.848 18 7.5A8 8 0 002 7.5c0 3.348 2.248 6.605 4.297 8.858a13.684 13.684 0 002.34 1.97c.303.2.563.35.749.449a5.728 5.728 0 00.3.153l.005.003zM10 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
              clipRule="evenodd"
            />
          </svg>
          Ouvrir dans Maps
        </a>

        {mission.description && (
          <p className="mt-3 text-sm text-neutral-700">{mission.description}</p>
        )}
      </section>

      {/* Alerte meteo */}
      {mission.meteo?.alerte && (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-start gap-2">
            <span className="text-lg">&#9888;</span>
            <div>
              <div className="text-sm font-semibold text-amber-900">Alerte meteo</div>
              <p className="text-sm text-amber-800">{mission.meteo.alerte}</p>
            </div>
          </div>
        </section>
      )}

      {mission.meteo && !mission.meteo.alerte && (
        <div className="flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2 text-sm text-neutral-600">
          <span>{mission.meteo.temp}&deg;C</span>
          <span>&middot;</span>
          <span>{mission.meteo.conditions}</span>
        </div>
      )}

      {/* Etapes */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Etapes ({etapes.filter((e) => e.done).length}/{etapes.length})
        </h2>
        <ul className="flex flex-col gap-2">
          {etapes.map((e, i) => (
            <li key={e.numero}>
              <button
                type="button"
                onClick={() => toggleEtape(i)}
                className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-neutral-50"
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    e.done
                      ? "border-[#E50000] bg-[#E50000] text-white"
                      : "border-neutral-300 text-neutral-400"
                  }`}
                >
                  {e.done ? "\u2713" : e.numero}
                </span>
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium ${e.done ? "text-neutral-400 line-through" : "text-neutral-900"}`}
                  >
                    {e.titre}
                  </div>
                  <div className="text-xs text-neutral-500">{e.description}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Materiel */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Materiel ({materiel.filter((m) => m.checked).length}/{materiel.length})
        </h2>
        <ul className="flex flex-col gap-1">
          {materiel.map((m, i) => (
            <li key={m.nom}>
              <button
                type="button"
                onClick={() => toggleMateriel(i)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-neutral-50"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-xs ${
                    m.checked
                      ? "border-[#E50000] bg-[#E50000] text-white"
                      : "border-neutral-300"
                  }`}
                >
                  {m.checked ? "\u2713" : ""}
                </span>
                <span
                  className={`flex-1 text-sm ${m.checked ? "text-neutral-400 line-through" : "text-neutral-900"}`}
                >
                  {m.nom}
                </span>
                <span className="text-xs text-neutral-400">x{m.quantite}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Photos */}
      {mission.photos.length > 0 && (
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Photos du RDV
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {mission.photos.map((p) => (
              <div
                key={p.url}
                className="flex w-40 shrink-0 flex-col gap-1"
              >
                <div className="h-28 w-40 rounded-xl bg-neutral-200 object-cover" />
                <span className="truncate text-xs text-neutral-500">{p.caption}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Documents */}
      {mission.documents.length > 0 && (
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Documents
          </h2>
          <ul className="flex flex-col gap-2">
            {mission.documents.map((d) => (
              <li key={d.nom}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-neutral-400">
                    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                  <span className="flex-1 truncate">{d.nom}</span>
                  <span className="text-xs uppercase text-neutral-400">{d.type}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Contraintes */}
      {mission.contraintes.length > 0 && (
        <section className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-800">
            Contraintes
          </h2>
          <ul className="flex flex-col gap-1">
            {mission.contraintes.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-amber-900">
                <span className="mt-0.5 shrink-0">&#9888;</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
