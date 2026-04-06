"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  hamlet?: string;
  village?: string;
  town?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address: NominatimAddress;
}

function formatAddress(addr: NominatimAddress): string {
  const street = [addr.house_number, addr.road].filter(Boolean).join(" ");
  const city = addr.city || addr.town || addr.village || addr.hamlet || "";
  const parts = [street, [addr.postcode, city].filter(Boolean).join(" ")].filter(Boolean);
  return parts.join(", ");
}

export function AddressAutocomplete({ value, onChange }: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync externe → interne
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Fermer au clic extérieur
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
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=fr,de,ch&limit=5&addressdetails=1&type=address`,
        { headers: { "Accept-Language": "fr" } }
      );
      const data: NominatimResult[] = await res.json();
      setResults(data);
      setIsOpen(data.length > 0);
    } catch {
      setResults([]);
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (result: NominatimResult) => {
    const formatted = formatAddress(result.address) || result.display_name;
    setQuery(formatted);
    onChange(formatted);
    setIsOpen(false);
    setResults([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Input
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Tapez votre adresse..."
          className="bg-white/5 border-white/10 text-white pl-9"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#4A9EFF] border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[200px] overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex items-start gap-2"
            >
              <MapPin className="w-4 h-4 text-[#E50000] flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{formatAddress(r.address) || r.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
