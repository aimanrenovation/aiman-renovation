"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Check } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  validated: boolean;
  onTypingChange: (value: string) => void;
  onSelect: (params: { address: string; lat: number; lng: number }) => void;
  invalid?: boolean;
}

interface MapboxFeature {
  id: string;
  place_name: string;
  place_type: string;
  center: [number, number]; // [lng, lat]
  precise: boolean;
}

export function AddressAutocomplete({
  value,
  validated,
  onTypingChange,
  onSelect,
  invalid,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<MapboxFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // External → internal sync
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onTypingChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (feature: MapboxFeature) => {
    setQuery(feature.place_name);
    onSelect({
      address: feature.place_name,
      lat: feature.center[1],
      lng: feature.center[0],
    });
    setIsOpen(false);
    setResults([]);
  };

  const borderClass = invalid
    ? "border-red-500/60"
    : validated
      ? "border-green-500/60"
      : "border-white/10";

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Input
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Tapez votre adresse..."
          className={`bg-white/5 ${borderClass} text-white pl-9 pr-9`}
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#4A9EFF] border-t-transparent rounded-full animate-spin" />
        )}
        {!isLoading && validated && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          data-lenis-prevent
          className="absolute z-50 w-full mt-1 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[200px] overflow-y-auto"
        >
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex items-start gap-2"
            >
              <MapPin className="w-4 h-4 text-[#E50000] flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{r.place_name}</span>
              {!r.precise && (
                <span className="ml-auto text-[10px] text-yellow-400 shrink-0">~</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
