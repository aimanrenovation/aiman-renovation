# i18n Trilingue (FR/DE/EN) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make aiman-renovation.fr fully accessible in French, German (Swiss), and English with locale-prefixed routing (`/de/`, `/en/`), auto-detection, translated blueprints, and Swiss cities in zone d'intervention.

**Architecture:** `next-intl` with App Router `[locale]` dynamic segment. `localePrefix: 'as-needed'` keeps FR at root (`/services`), DE/EN get prefixes (`/de/services`, `/en/services`). Middleware handles locale detection via cookie → Accept-Language → default FR. Translation JSON files in `messages/`.

**Tech Stack:** Next.js 16 App Router, next-intl, TypeScript, Tailwind CSS 4, GSAP, shadcn/ui

**Important:** Check AGENTS.md — Next.js 16 may have breaking changes. Read `node_modules/next/dist/docs/` before writing code. Use `proxy.ts` if Next.js 16 requires it instead of `middleware.ts`.

---

## File Structure

```
messages/
  fr.json                          ← Source de vérité (~400 clés)
  de.json                          ← Allemand suisse (Hochdeutsch)
  en.json                          ← Anglais britannique
i18n/
  routing.ts                       ← Config locales, pathnames, localePrefix
  request.ts                       ← getRequestConfig pour Server Components
  navigation.ts                    ← Link, redirect, usePathname locale-aware
middleware.ts                      ← createMiddleware de next-intl
app/
  [locale]/                        ← Nouveau wrapper
    layout.tsx                     ← Locale-aware (lang attr, metadata, JSON-LD, hreflang)
    page.tsx                       ← Homepage
    services/page.tsx
    services/[slug]/page.tsx
    a-propos/page.tsx
    contact/page.tsx
    devis/page.tsx
    faq/page.tsx
    realisations/page.tsx
    cgv/page.tsx
    mentions-legales/page.tsx
    politique-confidentialite/page.tsx
    not-found.tsx
  api/                             ← INCHANGÉ (hors [locale])
    contact/route.ts
    devis/route.ts
  sitemap.ts                       ← Multilingue (3 locales × toutes les pages)
  robots.ts                        ← Inchangé
components/
  layout/navbar.tsx                ← + LanguageSwitcher
  layout/footer.tsx                ← Traduit via useTranslations
  layout/language-switcher.tsx     ← NOUVEAU — drapeaux FR/DE/EN
```

---

### Task 1: Install next-intl & Create Config

**Files:**
- Modify: `package.json` (add next-intl)
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `i18n/navigation.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Install next-intl**

```bash
cd /Users/Aiman/aiman-renovation && npm install next-intl
```

- [ ] **Step 2: Create routing config**

```typescript
// i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "de", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
});
```

- [ ] **Step 3: Create request config**

```typescript
// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Create navigation helpers**

```typescript
// i18n/navigation.ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 5: Update next.config.ts**

```typescript
// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json i18n/ next.config.ts
git commit -m "feat(i18n): install next-intl and create config"
```

---

### Task 2: Create Middleware

**Files:**
- Create: `middleware.ts`

NOTE: Next.js 16 may use `proxy.ts` instead of `middleware.ts`. Check `node_modules/next/dist/docs/` first. If proxy.ts is required, adapt the middleware code to proxy.ts format. next-intl's `createMiddleware` should work in both.

- [ ] **Step 1: Create middleware**

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

- [ ] **Step 2: Test locally**

```bash
cd /Users/Aiman/aiman-renovation && npm run dev
```

Visit `http://localhost:3000` — should still work (FR default, no prefix).
Visit `http://localhost:3000/de` — should show empty page (no [locale] layout yet).

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat(i18n): add locale detection middleware"
```

---

### Task 3: Create French Translation File (messages/fr.json)

**Files:**
- Create: `messages/fr.json`

Extract ALL hardcoded French strings from the codebase into a structured JSON. This is the source of truth.

- [ ] **Step 1: Create messages/fr.json**

Extract strings from these sources:
- `lib/constants.ts` → `nav.*`, `common.*`
- `app/page.tsx` → `home.*`
- `app/a-propos/page.tsx` → `about.*`
- `app/services/page.tsx` → `services.*`
- `lib/services.ts` → `services.items.*` (12 services × title, shortTitle, description, features[], longDescription, process[], whyPro, priceRange)
- `app/contact/page.tsx` → `contact.*`
- `app/devis/page.tsx` → `devis.*`
- `components/devis/devis-zones-config.ts` → `devis.zones.*`, `devis.works.*`
- `components/devis/panels/panel-recap.tsx` → `devis.recap.*`
- `components/devis/panels/panel-travaux.tsx` → `devis.panel.*`
- `lib/faq.ts` → `faq.*` (29 items × category, question, answer)
- `app/not-found.tsx` → `notFound.*` (8 variants)
- `components/layout/footer.tsx` → `footer.*`
- `app/cgv/page.tsx` → `cgv.*`
- `app/mentions-legales/page.tsx` → `legal.*`
- `app/politique-confidentialite/page.tsx` → `privacy.*`
- `app/realisations/page.tsx` → `realisations.*`
- `lib/email-templates/devis-confirmation.ts` → `email.*`
- `app/layout.tsx` → `seo.*` (metadata titles, descriptions per page)

Structure:

```json
{
  "nav": {
    "home": "Accueil",
    "services": "Services",
    "realisations": "Réalisations",
    "about": "À propos",
    "contact": "Contact",
    "cta": "Devis gratuit"
  },
  "common": {
    "slogan": "Nous rénovons jusqu'au bout de vos rêves !",
    "phone": "06 33 49 69 25",
    "email": "contact@aiman-renovation.fr",
    "city": "Saint-Louis et environs",
    "back": "Retour",
    "next": "Suivant",
    "send": "Envoyer"
  },
  "home": {
    "rouleau_text": "Chaque coup de rouleau,\nchaque joint posé,\nchaque câble tiré —\nc'est notre signature.",
    "result_text": "LE RÉSULTAT PARLE DE LUI-MÊME",
    "zone_title": "ZONE D'INTERVENTION",
    "zone_subtitle": "Saint-Louis et sud du Haut-Rhin, à la frontière suisse et allemande.",
    "zone_beyond": "et au-delà",
    "zones": ["Saint-Louis", "Huningue", "Hésingue", "Village-Neuf", "Blotzheim", "Bartenheim", "Kembs", "Sierentz", "Leymen", "Hagenthal", "Rosenau", "Hégenheim"]
  },
  "devis": {
    "zones": {
      "cuisine": "Cuisine",
      "sdb": "Salle de bain",
      "wc": "WC",
      "garage": "Garage",
      "vestibule": "Vestibule",
      "salon": "Salon",
      "sam": "Salle à manger",
      "chambre1": "Chambre 1",
      "chambre2": "Chambre 2",
      "terrasse": "Terrasse",
      "jardin": "Jardin",
      "haie": "Haie",
      "facades": "Façades",
      "toiture": "Toiture"
    },
    "works": { "...extracted from ZONES_CONFIG workItems..." }
  },
  "seo": {
    "home_title": "Rénovation Maison Saint-Louis 68300 | Devis Gratuit — Aiman Renovation",
    "home_description": "Artisan rénovation à Saint-Louis (68300) : cuisine, salle de bain, façades, isolation, peinture, carrelage. 19 ans d'expérience en Haut-Rhin. Devis gratuit sous 4 jours."
  },
  "footer": {
    "services_title": "Services",
    "nav_title": "Navigation",
    "contact_title": "Contact",
    "copyright": "© {year} Aiman Renovation. Tous droits réservés.",
    "legal": "Mentions légales",
    "cgv": "CGV",
    "privacy": "Confidentialité"
  },
  "notFound": {
    "badge": "Erreur 404",
    "back_home": "Retour à l'accueil",
    "ask_quote": "Demander un devis",
    "need_help": "Besoin d'aide ?",
    "variants": [
      { "title": "Oups, mur porteur !", "subtitle": "Même les meilleurs plans ont parfois un mur au mauvais endroit." },
      "... 7 more variants ..."
    ]
  }
}
```

**IMPORTANT:** Read EVERY page file to extract ALL strings. Don't miss any. The `about` page alone has ~50+ strings (story texts, process steps, engagements, certifications). The FAQ has 29 items. Services has 12 items with rich content.

- [ ] **Step 2: Commit**

```bash
git add messages/fr.json
git commit -m "feat(i18n): extract French translation strings (~400 keys)"
```

---

### Task 4: Create German Translation File (messages/de.json)

**Files:**
- Create: `messages/de.json`

- [ ] **Step 1: Translate fr.json → de.json**

Translation guidelines:
- **Hochdeutsch standard** with Swiss terms where relevant ("Offerte" instead of "Kostenvoranschlag")
- **Currency:** € (on facture en euros, pas CHF)
- **Zone d'intervention DE:** Include Swiss cities: Basel, Riehen, Allschwil, Binningen, Lörrach, Weil am Rhein + French cities: Saint-Louis, Huningue, etc.
- **SEO keywords:** "Renovation Basel", "Handwerker Basel Region", "Küche renovieren", "Badezimmer renovieren Basel", "Fassade renovieren"
- **Metadata titles** optimized for German search: "Hausrenovierung Basel Region | Kostenlose Offerte — Aiman Renovation"
- **Schema areaServed** extended: Basel, Riehen, Allschwil, Binningen, Lörrach, Weil am Rhein

Key translations:
```json
{
  "nav": {
    "home": "Startseite",
    "services": "Leistungen",
    "realisations": "Referenzen",
    "about": "Über uns",
    "contact": "Kontakt",
    "cta": "Kostenlose Offerte"
  },
  "home": {
    "zone_title": "EINSATZGEBIET",
    "zone_subtitle": "Basel und Umgebung — wir arbeiten grenzüberschreitend in Frankreich und der Schweiz.",
    "zones": ["Basel", "Riehen", "Allschwil", "Binningen", "Lörrach", "Weil am Rhein", "Saint-Louis", "Huningue", "Hésingue", "Village-Neuf", "Blotzheim", "Bartenheim"]
  },
  "seo": {
    "home_title": "Hausrenovierung Basel Region | Kostenlose Offerte — Aiman Renovation",
    "home_description": "Renovierungshandwerker in der Region Basel: Küche, Bad, Fassade, Dämmung, Malerarbeiten, Fliesen. 19 Jahre Erfahrung. Kostenlose Offerte innerhalb von 4 Tagen."
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add messages/de.json
git commit -m "feat(i18n): add German (Swiss) translations with Basel-area zones"
```

---

### Task 5: Create English Translation File (messages/en.json)

**Files:**
- Create: `messages/en.json`

- [ ] **Step 1: Translate fr.json → en.json**

Translation guidelines:
- **British English** (clientèle UK/expat en Suisse)
- **Zone d'intervention EN:** Include Swiss cities too: Basel, Riehen, Allschwil + French cities
- **SEO keywords:** "Home renovation Basel area", "Renovation contractor Saint-Louis", "Kitchen renovation Basel"
- **Metadata titles:** "Home Renovation Basel Area | Free Quote — Aiman Renovation"

Key translations:
```json
{
  "nav": {
    "home": "Home",
    "services": "Services",
    "realisations": "Portfolio",
    "about": "About",
    "contact": "Contact",
    "cta": "Free quote"
  },
  "home": {
    "zone_title": "SERVICE AREA",
    "zone_subtitle": "Basel area and southern Alsace — we work across the French-Swiss-German border.",
    "zones": ["Basel", "Riehen", "Allschwil", "Binningen", "Lörrach", "Weil am Rhein", "Saint-Louis", "Huningue", "Hésingue", "Village-Neuf", "Blotzheim", "Bartenheim"]
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add messages/en.json
git commit -m "feat(i18n): add English translations with tri-border zones"
```

---

### Task 6: Restructure App Router — Move Pages to [locale]/

**Files:**
- Create: `app/[locale]/layout.tsx`
- Move: ALL page files from `app/X/page.tsx` to `app/[locale]/X/page.tsx`
- Move: `app/not-found.tsx` → `app/[locale]/not-found.tsx`
- Keep: `app/api/` stays at root (NOT inside [locale])
- Keep: `app/sitemap.ts` stays at root
- Keep: `app/robots.ts` stays at root
- Modify: `app/layout.tsx` (strip to bare minimum — just html/body/fonts, no Navbar/Footer)
- Keep: `app/globals.css` at root

- [ ] **Step 1: Create app/[locale]/layout.tsx**

This is the main locale-aware layout. It wraps children with `NextIntlClientProvider`, sets `<html lang>`, renders Navbar/Footer, JSON-LD, and hreflang.

```typescript
// app/[locale]/layout.tsx
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/3d/providers/SmoothScrollProvider";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SmoothScrollProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScrollProvider>
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 2: Simplify app/layout.tsx to bare root**

```typescript
// app/layout.tsx — Root layout (locale-agnostic)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const archivoBlack = localFont({
  src: "./fonts/ArchivoBlack-Regular.ttf",
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
  metadataBase: new URL("https://aiman-renovation.fr"),
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${inter.variable} ${archivoBlack.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
```

NOTE: Remove `lang="fr"` from html tag — the `[locale]/layout.tsx` will set it dynamically. Actually, `next-intl` handles the lang attribute via the locale. If the root layout needs `lang`, add it dynamically in the locale layout using a `<script>` or handle via next-intl's built-in support.

- [ ] **Step 3: Move all pages into [locale]/**

Move each file:
```bash
cd /Users/Aiman/aiman-renovation/app
mkdir -p "[locale]"
# Move page files (NOT api, NOT sitemap, NOT robots, NOT globals.css, NOT layout.tsx, NOT fonts/)
mv page.tsx "[locale]/"
mv a-propos "[locale]/"
mv services "[locale]/"
mv contact "[locale]/"
mv devis "[locale]/"
mv faq "[locale]/"
mv realisations "[locale]/"
mv cgv "[locale]/"
mv mentions-legales "[locale]/"
mv politique-confidentialite "[locale]/"
mv not-found.tsx "[locale]/"
```

Verify structure:
```bash
find app -name "page.tsx" -o -name "layout.tsx" -o -name "route.ts" | sort
```

Expected:
```
app/[locale]/a-propos/page.tsx
app/[locale]/cgv/page.tsx
app/[locale]/contact/page.tsx
app/[locale]/devis/page.tsx
app/[locale]/faq/page.tsx
app/[locale]/layout.tsx
app/[locale]/mentions-legales/page.tsx
app/[locale]/not-found.tsx
app/[locale]/page.tsx
app/[locale]/politique-confidentialite/page.tsx
app/[locale]/realisations/page.tsx
app/[locale]/services/[slug]/page.tsx
app/[locale]/services/page.tsx
app/api/contact/route.ts
app/api/devis/route.ts
app/layout.tsx
```

- [ ] **Step 4: Test build**

```bash
cd /Users/Aiman/aiman-renovation && npm run build
```

Fix any import path issues. All `@/` imports should still work since we only moved within `app/`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(i18n): restructure app router with [locale] segment"
```

---

### Task 7: Update Pages to Use Translations

**Files:**
- Modify: `app/[locale]/page.tsx` (homepage)
- Modify: `app/[locale]/a-propos/page.tsx`
- Modify: `app/[locale]/services/page.tsx`
- Modify: `app/[locale]/services/[slug]/page.tsx`
- Modify: `app/[locale]/contact/page.tsx`
- Modify: `app/[locale]/faq/page.tsx`
- Modify: `app/[locale]/realisations/page.tsx`
- Modify: `app/[locale]/devis/page.tsx`
- Modify: `app/[locale]/cgv/page.tsx`
- Modify: `app/[locale]/mentions-legales/page.tsx`
- Modify: `app/[locale]/politique-confidentialite/page.tsx`
- Modify: `app/[locale]/not-found.tsx`

For each page, the pattern is:

**Server Components** (most pages):
```typescript
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function SomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = useTranslations("namespace");
  // Replace hardcoded strings with t("key")
}
```

**Client Components** (devis, not-found, etc.):
```typescript
"use client";
import { useTranslations } from "next-intl";

export default function SomePage() {
  const t = useTranslations("namespace");
  // Replace hardcoded strings with t("key")
}
```

- [ ] **Step 1: Update homepage (app/[locale]/page.tsx)**

Replace hardcoded ZONES array and French strings with `useTranslations("home")`:
- `t("rouleau_text")` for paint roller section
- `t("result_text")` for result banner
- `t("zone_title")`, `t("zone_subtitle")`, `t("zone_beyond")`
- `t.raw("zones")` for zone list (returns array)

- [ ] **Step 2: Update not-found (app/[locale]/not-found.tsx)**

Replace VARIANTS array with `t.raw("notFound.variants")`. Replace all button labels.

- [ ] **Step 3: Update all remaining pages**

For each page, replace French hardcoded strings with `t("key")` calls. Each page uses its own namespace:
- `about` page → `useTranslations("about")`
- `services` page → `useTranslations("services")`
- `contact` page → `useTranslations("contact")`
- `faq` page → `useTranslations("faq")`
- etc.

**IMPORTANT:** For pages that export `generateMetadata`, make it locale-aware:

```typescript
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    title: t("services_title"),
    description: t("services_description"),
    alternates: {
      canonical: `https://aiman-renovation.fr/${locale === "fr" ? "" : locale + "/"}services`,
      languages: {
        fr: "https://aiman-renovation.fr/services",
        de: "https://aiman-renovation.fr/de/services",
        en: "https://aiman-renovation.fr/en/services",
      },
    },
  };
}
```

- [ ] **Step 4: Commit**

```bash
git add app/
git commit -m "feat(i18n): translate all pages with next-intl"
```

---

### Task 8: Update Navbar with Language Switcher

**Files:**
- Modify: `components/layout/navbar.tsx`
- Create: `components/layout/language-switcher.tsx`

- [ ] **Step 1: Create LanguageSwitcher component**

```typescript
// components/layout/language-switcher.tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";

const FLAGS: Record<string, { label: string; flag: React.ReactNode }> = {
  fr: {
    label: "Français",
    flag: (
      <svg width="20" height="14" viewBox="0 0 20 14">
        <rect width="7" height="14" fill="#002B7F" />
        <rect x="7" width="6" height="14" fill="#FFF" />
        <rect x="13" width="7" height="14" fill="#CE1126" />
      </svg>
    ),
  },
  de: {
    label: "Deutsch",
    flag: (
      <svg width="20" height="14" viewBox="0 0 20 14">
        {/* Split diagonal: Germany top-left, Switzerland bottom-right */}
        <defs>
          <clipPath id="de-top"><polygon points="0,0 20,0 0,14" /></clipPath>
          <clipPath id="de-bot"><polygon points="20,0 20,14 0,14" /></clipPath>
        </defs>
        <g clipPath="url(#de-top)">
          <rect width="20" height="5" fill="#000" />
          <rect y="5" width="20" height="4" fill="#DD0000" />
          <rect y="9" width="20" height="5" fill="#FFCC00" />
        </g>
        <g clipPath="url(#de-bot)">
          <rect width="20" height="14" fill="#FF0000" />
          <rect x="8" y="3" width="4" height="8" fill="#FFF" />
          <rect x="6" y="5" width="8" height="4" fill="#FFF" />
        </g>
        <line x1="0" y1="14" x2="20" y2="0" stroke="#FFF" strokeWidth="0.5" />
      </svg>
    ),
  },
  en: {
    label: "English",
    flag: (
      <svg width="20" height="14" viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
      </svg>
    ),
  },
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
        aria-label="Change language"
      >
        {FLAGS[locale].flag}
        <svg width="10" height="6" viewBox="0 0 10 6" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden min-w-[140px]">
          {routing.locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
                l === locale ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {FLAGS[l].flag}
              <span>{FLAGS[l].label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update navbar.tsx**

Replace `next/navigation` imports with `@/i18n/navigation`. Add `useTranslations`. Add `<LanguageSwitcher />` next to CTA button (desktop) and in mobile menu.

```typescript
// Key changes in navbar.tsx:
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

// In the component:
const t = useTranslations("nav");
// Replace NAV_LINKS with translated links:
const navLinks = [
  { href: "/", label: t("home") },
  { href: "/services", label: t("services") },
  { href: "/realisations", label: t("realisations") },
  { href: "/a-propos", label: t("about") },
  { href: "/contact", label: t("contact") },
];
// CTA: t("cta")
// Add <LanguageSwitcher /> between nav links and CTA on desktop
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/
git commit -m "feat(i18n): add language switcher with flag dropdowns"
```

---

### Task 9: Update Footer

**Files:**
- Modify: `components/layout/footer.tsx`

- [ ] **Step 1: Replace hardcoded strings**

Use `useTranslations("footer")` for:
- Section titles ("Services", "Navigation", "Contact")
- "et environs" → `t("area")`
- "Tous droits réservés" → `t("copyright", { year: new Date().getFullYear() })`
- "Mentions légales", "CGV", "Confidentialité" → `t("legal")`, `t("cgv")`, `t("privacy")`
- "FAQ" → `t("faq")`

Replace `next/link` with `@/i18n/navigation` `Link`.

- [ ] **Step 2: Commit**

```bash
git add components/layout/footer.tsx
git commit -m "feat(i18n): translate footer"
```

---

### Task 10: Update Devis Blueprint for i18n

**Files:**
- Modify: `components/devis/devis-zones-config.ts`
- Modify: `components/devis/blueprint/blueprint-interactive.tsx`
- Modify: `components/devis/devis-blueprint.tsx`
- Modify: `components/devis/panels/panel-travaux.tsx`
- Modify: `components/devis/panels/panel-recap.tsx`
- Modify: `app/api/devis/route.ts`
- Modify: `lib/email-templates/devis-confirmation.ts`

- [ ] **Step 1: Make ZONES_CONFIG translation-key based**

Instead of hardcoded French labels, use translation keys:
```typescript
// devis-zones-config.ts
// Change label: "Cuisine" → labelKey: "cuisine"
// Change workItems label: "Sol" → labelKey: "sol"
```

Then in components, use `t(`zones.${zone.labelKey}`)` and `t(`works.${workItem.labelKey}`)`.

- [ ] **Step 2: Update blueprint-interactive.tsx**

Add `useTranslations("devis")` and pass translated zone labels to SVG text elements.

Load locale-specific blueprint image:
```typescript
const locale = useLocale();
const blueprintSrc = locale === "fr"
  ? "/images/blueprint-plan.jpeg"
  : `/images/blueprint-plan-${locale}.jpeg`;
```

NOTE: Blueprint images for DE and EN need to exist at:
- `public/images/blueprint-plan-de.jpeg`
- `public/images/blueprint-plan-en.jpeg`

Copy from `~/Downloads/` as specified in spec:
```bash
cp ~/Downloads/blueprint\ allemand.jpg public/images/blueprint-plan-de.jpeg
cp ~/Downloads/blueprint\ anglais.jpg public/images/blueprint-plan-en.jpeg
```

If those files don't exist yet, use the FR image as placeholder for all locales.

- [ ] **Step 3: Update panel-travaux.tsx**

Replace hardcoded work item labels with `t(`works.${item.labelKey}`)`.

- [ ] **Step 4: Update panel-recap.tsx**

Translate all labels: budget, contact fields, MagicPlan wizard steps, submit button.

- [ ] **Step 5: Update API route for locale**

In `app/api/devis/route.ts`, read a `locale` field from FormData:
```typescript
const locale = formData.get("locale") as string || "fr";
```

Pass it to the email template function.

- [ ] **Step 6: Update email template**

Make `devis-confirmation.ts` accept a locale param and use translated strings for the client email. Aiman's copy stays in French.

- [ ] **Step 7: Update localStorage key**

In `devis-blueprint.tsx`, prefix localStorage key with locale:
```typescript
const storageKey = `devis-state-${locale}`;
```

- [ ] **Step 8: Commit**

```bash
git add components/devis/ app/api/devis/ lib/email-templates/
git commit -m "feat(i18n): translate devis blueprint, panels, and emails"
```

---

### Task 11: Update Sitemap & JSON-LD

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/[locale]/layout.tsx` (JSON-LD + hreflang)

- [ ] **Step 1: Multilingue sitemap**

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";

const BASE = "https://aiman-renovation.fr";
const LOCALES = ["fr", "de", "en"] as const;

function localizedUrl(path: string, locale: string) {
  return locale === "fr" ? `${BASE}${path}` : `${BASE}/${locale}${path}`;
}

function localizedEntry(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]) {
  return LOCALES.map((locale) => ({
    url: localizedUrl(path, locale),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((l) => [l, localizedUrl(path, l)])),
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...localizedEntry("/", 1, "weekly"),
    ...localizedEntry("/services", 0.9, "monthly"),
    ...SERVICES.flatMap((s) => localizedEntry(`/services/${s.slug}`, 0.8, "monthly")),
    ...localizedEntry("/realisations", 0.8, "weekly"),
    ...localizedEntry("/a-propos", 0.6, "monthly"),
    ...localizedEntry("/devis", 0.9, "monthly"),
    ...localizedEntry("/contact", 0.7, "monthly"),
    ...localizedEntry("/faq", 0.6, "monthly"),
    ...localizedEntry("/cgv", 0.3, "yearly"),
  ];
}
```

- [ ] **Step 2: Locale-aware JSON-LD**

In `app/[locale]/layout.tsx`, generate JSON-LD with:
- `inLanguage` set to current locale
- `areaServed` extended for DE: add Basel, Riehen, Allschwil, Binningen, Lörrach, Weil am Rhein
- Service names translated
- Slogan translated

```typescript
import { getTranslations } from "next-intl/server";

// In LocaleLayout:
const t = await getTranslations({ locale, namespace: "schema" });
const areaServed = locale === "de" || locale === "en"
  ? [
      { "@type": "City", name: "Basel", sameAs: "https://en.wikipedia.org/wiki/Basel" },
      { "@type": "City", name: "Riehen" },
      { "@type": "City", name: "Allschwil" },
      { "@type": "City", name: "Binningen" },
      { "@type": "City", name: "Lörrach" },
      { "@type": "City", name: "Weil am Rhein" },
      { "@type": "City", name: "Saint-Louis" },
      { "@type": "City", name: "Huningue" },
      // ... more cities
    ]
  : [
      { "@type": "City", name: "Saint-Louis", sameAs: "https://fr.wikipedia.org/wiki/Saint-Louis_(Haut-Rhin)" },
      // ... existing French cities
    ];
```

- [ ] **Step 3: Add hreflang to metadata**

In each page's `generateMetadata`, add `alternates.languages`:
```typescript
alternates: {
  languages: {
    fr: "https://aiman-renovation.fr/services",
    de: "https://aiman-renovation.fr/de/services",
    en: "https://aiman-renovation.fr/en/services",
    "x-default": "https://aiman-renovation.fr/services",
  },
},
```

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/[locale]/layout.tsx
git commit -m "feat(i18n): multilingue sitemap, JSON-LD with Swiss cities, hreflang"
```

---

### Task 12: Update Link Imports Across Components

**Files:**
- Modify: ALL components that use `next/link` → use `@/i18n/navigation` `Link`
- Modify: ALL components that use `next/navigation` `usePathname` → use `@/i18n/navigation`

- [ ] **Step 1: Find all next/link imports**

```bash
cd /Users/Aiman/aiman-renovation && grep -rn "from \"next/link\"" components/ app/[locale]/ --include="*.tsx" --include="*.ts"
```

Replace each with:
```typescript
import { Link } from "@/i18n/navigation";
```

- [ ] **Step 2: Find all next/navigation usePathname**

```bash
grep -rn "from \"next/navigation\"" components/ --include="*.tsx" --include="*.ts"
```

Replace `usePathname` and `useRouter` from `next/navigation` with `@/i18n/navigation` equivalents (in client components only).

**EXCEPTION:** Keep `next/navigation` for `notFound()` function — it's a Next.js built-in, not a routing helper.

- [ ] **Step 3: Test build**

```bash
npm run build
```

Fix any remaining import errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(i18n): replace next/link with locale-aware Link everywhere"
```

---

### Task 13: Final Testing & Deploy

- [ ] **Step 1: Test all 3 locales locally**

```bash
npm run dev
```

Test checklist:
- [ ] `http://localhost:3000` → FR homepage, no prefix
- [ ] `http://localhost:3000/de` → DE homepage
- [ ] `http://localhost:3000/en` → EN homepage
- [ ] `http://localhost:3000/services` → FR services
- [ ] `http://localhost:3000/de/services` → DE services
- [ ] `http://localhost:3000/devis` → FR devis with FR blueprint
- [ ] `http://localhost:3000/de/devis` → DE devis with DE blueprint
- [ ] Language switcher works and preserves current page
- [ ] 404 page shows translated content
- [ ] All nav links work in each locale
- [ ] Footer links work in each locale
- [ ] View source: hreflang tags present
- [ ] View source: JSON-LD has correct `inLanguage`
- [ ] DE zone d'intervention includes Basel, Riehen, Allschwil, Binningen
- [ ] EN zone d'intervention includes Basel area + French cities

- [ ] **Step 2: Build and check for errors**

```bash
npm run build
```

- [ ] **Step 3: Push to deploy**

```bash
git push
```

Vercel auto-deploys from push.

- [ ] **Step 4: Test production URLs**

- `https://aiman-renovation.fr` → FR
- `https://aiman-renovation.fr/de` → DE
- `https://aiman-renovation.fr/en` → EN
- `https://aiman-renovation.fr/sitemap.xml` → all 3 locales × all pages
