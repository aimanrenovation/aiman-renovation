# i18n Trilingue (FR/DE/EN) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make aiman-renovation.fr fully accessible in French, German, and English with locale-prefixed routing, auto-detection, and translated blueprints.

**Architecture:** App Router `[locale]` dynamic segment wrapping all pages. Dictionary JSON files loaded server-side via `getDictionary(locale)`. Middleware detects browser language and redirects. No external i18n library.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS 4, GSAP

---

### Task 1: i18n Infrastructure — Config, Dictionary, Types

**Files:**
- Create: `lib/i18n/config.ts`
- Create: `lib/i18n/get-dictionary.ts`
- Create: `lib/i18n/dictionaries/fr.json`
- Create: `lib/i18n/dictionaries/de.json`
- Create: `lib/i18n/dictionaries/en.json`

- [ ] **Step 1: Create i18n config**

```typescript
// lib/i18n/config.ts
export const locales = ["fr", "de", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
```

- [ ] **Step 2: Create dictionary loader**

```typescript
// lib/i18n/get-dictionary.ts
import type { Locale } from "./config";

const dictionaries = {
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  de: () => import("./dictionaries/de.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["fr"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
```

- [ ] **Step 3: Create FR dictionary (source of truth)**

Create `lib/i18n/dictionaries/fr.json` with ALL translatable strings extracted from the codebase. Organized by section:

```json
{
  "nav": {
    "home": "Accueil",
    "services": "Nos services",
    "realisations": "Réalisations",
    "about": "À propos",
    "contact": "Contact",
    "devis": "Devis gratuit",
    "faq": "FAQ"
  },
  "home": {
    "hero_title": "CHAQUE COUP DE ROULEAU COMPTE",
    "hero_subtitle": "Rénovation intérieure et extérieure à Saint-Louis et environs",
    "hero_cta": "Demander un devis",
    "hero_cta_secondary": "Découvrir nos services",
    ...all homepage sections
  },
  "services": { ...all service page strings },
  "devis": {
    "click_room": "Cliquez sur une pièce pour commencer",
    "touch_room": "Touchez une pièce",
    "touch_subtitle": "Puis cochez les travaux à réaliser",
    "select_zones": "Sélectionnez les zones de votre maison à rénover",
    "send_quote": "Envoyer mon devis",
    "works_count": "travaux",
    "back_to_plan": "Retour au plan",
    "validate_back": "Valider et retour au plan",
    "works_selected": "travaux sélectionnés",
    "check_works": "Cochez les travaux à réaliser",
    "describe_needs": "Décrivez vos besoins pour cette pièce",
    "describe_placeholder": "Ex: fuite sous l'évier, carrelage fissuré, souhaite une douche italienne...",
    "photos_title": "Photos / Vidéos",
    "photos_encourage": "Plus vous ajoutez de photos, plus votre devis sera précis et rapide !",
    "photos_add": "Ajouter des photos ou vidéos",
    "summary": "Récapitulatif",
    "budget_title": "Budget estimé",
    "message_label": "Message (optionnel)",
    "message_placeholder": "Décrivez votre projet, vos contraintes, vos envies...",
    "contact_title": "Vos coordonnées",
    "firstname": "Prénom",
    "lastname": "Nom",
    "phone": "Téléphone",
    "email": "Email",
    "address": "Adresse du chantier",
    "address_placeholder": "Tapez votre adresse...",
    "address_hint": "Suggestions automatiques — France, Allemagne, Suisse",
    "magicplan_title": "Devis plus précis avec MagicPlan",
    "magicplan_desc": "Scannez vos pièces en 5 min avec l'app gratuite MagicPlan.",
    "magicplan_guide": "Voir le guide MagicPlan →",
    "magicplan_link_label": "Lien MagicPlan (optionnel)",
    "magicplan_link_placeholder": "https://my.magicplan.app/...",
    "magicplan_link_hint": "Collez ici le lien de partage MagicPlan",
    "send_button": "Envoyer mon devis",
    "sending": "Envoi en cours...",
    "back": "Retour",
    "success_title": "Demande envoyée !",
    "success_message": "Nous avons bien reçu votre demande de devis. Un email de confirmation vous a été envoyé. Nous vous recontactons sous 24h.",
    "success_new": "Nouveau devis",
    "success_home": "Retour à l'accueil",
    "success_call": "Appeler maintenant"
  },
  "devis_zones": {
    "cuisine": "Cuisine",
    "sdb": "Salle de bain",
    "wc": "WC",
    "garage": "Garage",
    "vestibule": "Vestibule / Entrée",
    "salon": "Salon",
    "sam": "Salle à manger",
    "chambre1": "Chambre 1 parentale",
    "chambre2": "Chambre 2",
    "terrasse": "Terrasse",
    "jardin": "Jardin",
    "haie": "Haie / Clôture",
    "facades": "Façades",
    "toiture": "Toiture"
  },
  "devis_works": {
    "entretien-jardin": "Entretien de jardin",
    "sol": "Sol",
    "murs-credence": "Murs / Crédence",
    "plomberie-evier": "Plomberie / Évier",
    "electricite": "Électricité",
    ...all work items
  },
  "devis_magicplan": {
    "wizard_step1_title": "Téléchargez l'app",
    "wizard_step1_subtitle": "Gratuit — 2 minutes",
    "wizard_step1_instruction": "Installez MagicPlan sur votre téléphone. C'est gratuit, pas besoin de compte.",
    "wizard_step1_tip": "Déjà installé ? Passez à l'étape suivante.",
    "wizard_download": "Télécharger MagicPlan",
    ...all 5 wizard steps
    "wizard_next": "Suivant →",
    "wizard_prev": "← Précédent",
    "wizard_skip": "Passer",
    "wizard_done": "Continuer mon devis",
    "wizard_step_of": "Étape {current} sur {total}"
  },
  "contact": { ...contact page strings },
  "about": { ...about page strings },
  "realisations": { ...realisations strings },
  "faq": { ...faq strings },
  "not_found": {
    "error": "Erreur 404",
    "help": "Besoin d'aide ?",
    "home_btn": "Retour à l'accueil",
    "devis_btn": "Demander un devis",
    "variant1_title": "Oups, mur porteur !",
    "variant1_subtitle": "Même les meilleurs plans ont parfois un mur au mauvais endroit.",
    ...all 8 variants
  },
  "footer": { ...footer strings },
  "common": {
    "back": "Retour",
    "next": "Suivant",
    "send": "Envoyer",
    "close": "Fermer",
    "loading": "Chargement..."
  },
  "seo": {
    "home_title": "Aiman Renovation — Rénovation intérieure et extérieure à Saint-Louis (68300)",
    "home_description": "Entreprise de rénovation à Saint-Louis...",
    ...all page metadata
  }
}
```

- [ ] **Step 4: Create DE dictionary**

Translate ALL keys from fr.json to German (Hochdeutsch with Swiss terms where relevant — "Offerte" not "Kostenvoranschlag", etc.).

- [ ] **Step 5: Create EN dictionary**

Translate ALL keys from fr.json to British English.

- [ ] **Step 6: Commit**

```bash
git add lib/i18n/
git commit -m "feat(i18n): add dictionary infrastructure with FR/DE/EN translations"
```

---

### Task 2: Middleware — Locale Detection & Redirect

**Files:**
- Create: `middleware.ts` (project root)

- [ ] **Step 1: Create middleware**

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isValidLocale } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

function getPreferredLocale(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) return cookieLocale;

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get("Accept-Language") || "";
  for (const locale of locales) {
    if (acceptLang.toLowerCase().includes(locale)) return locale;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public files, api routes, _next
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if pathname starts with a locale
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    // Valid locale prefix — set cookie and continue
    const response = NextResponse.next();
    response.cookies.set("locale", pathnameLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // No locale prefix — detect and redirect if not FR
  const preferred = getPreferredLocale(request);

  if (preferred === defaultLocale) {
    // FR is default, no prefix needed — just set cookie
    const response = NextResponse.next();
    response.cookies.set("locale", defaultLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // Redirect to locale-prefixed URL
  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set("locale", preferred, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico|icon.png|robots.txt|sitemap.xml).*)"],
};
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat(i18n): add locale detection middleware with cookie persistence"
```

---

### Task 3: App Router Restructure — [locale] Dynamic Segment

**Files:**
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx`
- Create: `app/[locale]/not-found.tsx`
- Move all existing page routes into `app/[locale]/`
- Modify: `app/layout.tsx` (root layout stays minimal)

- [ ] **Step 1: Create `app/[locale]/layout.tsx`**

This is the locale-aware layout that loads the dictionary and passes it via context. It replaces the current `app/layout.tsx` content (which becomes a thin shell).

```typescript
// app/[locale]/layout.tsx
import type { Locale } from "@/lib/i18n/config";
import { locales, defaultLocale, isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { DictionaryProvider } from "@/lib/i18n/dictionary-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <DictionaryProvider dictionary={dict} locale={locale}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </DictionaryProvider>
  );
}
```

- [ ] **Step 2: Create DictionaryProvider context**

```typescript
// lib/i18n/dictionary-context.tsx
"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "./get-dictionary";
import type { Locale } from "./config";

interface DictionaryContextValue {
  dict: Dictionary;
  locale: Locale;
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export function DictionaryProvider({
  children,
  dictionary,
  locale,
}: {
  children: React.ReactNode;
  dictionary: Dictionary;
  locale: Locale;
}) {
  return (
    <DictionaryContext.Provider value={{ dict: dictionary, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const ctx = useContext(DictionaryContext);
  if (!ctx) throw new Error("useDictionary must be used within DictionaryProvider");
  return ctx;
}
```

- [ ] **Step 3: Move all pages into `app/[locale]/`**

Move every route from `app/` to `app/[locale]/`:
- `app/page.tsx` → `app/[locale]/page.tsx`
- `app/services/` → `app/[locale]/services/`
- `app/devis/` → `app/[locale]/devis/`
- `app/contact/` → `app/[locale]/contact/`
- `app/a-propos/` → `app/[locale]/a-propos/`
- `app/realisations/` → `app/[locale]/realisations/`
- `app/faq/` → `app/[locale]/faq/`
- `app/cgv/` → `app/[locale]/cgv/`
- `app/mentions-legales/` → `app/[locale]/mentions-legales/`
- `app/politique-confidentialite/` → `app/[locale]/politique-confidentialite/`
- `app/not-found.tsx` → `app/[locale]/not-found.tsx`

Keep `app/layout.tsx` as root shell (html/body/fonts only, no Navbar/Footer).

- [ ] **Step 4: Update root `app/layout.tsx` to be a thin shell**

Remove Navbar, Footer, JSON-LD from root layout. Keep only html, body, fonts. The locale layout handles the rest.

- [ ] **Step 5: Verify build passes**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add app/
git commit -m "feat(i18n): restructure app router with [locale] dynamic segment"
```

---

### Task 4: Blueprint Images — Copy & Configure Per Locale

**Files:**
- Copy: blueprint images to `public/images/`
- Modify: `components/devis/blueprint/blueprint-interactive.tsx`

- [ ] **Step 1: Copy and rename blueprint images**

```bash
cp "public/images/blueprint-plan.jpeg" "public/images/blueprint-plan-fr.jpeg"
cp "$HOME/Downloads/blueprint allemand.jpg" "public/images/blueprint-plan-de.jpeg"
cp "$HOME/Downloads/blueprint anglais.jpg" "public/images/blueprint-plan-en.jpeg"
```

- [ ] **Step 2: Update blueprint component to use locale**

In `blueprint-interactive.tsx`, use `useDictionary()` to get locale and load the right image:

```typescript
const { locale } = useDictionary();
// In the SVG:
<image href={`/images/blueprint-plan-${locale}.jpeg`} x="0" y="0" width="2814" height="1536" />
```

Also update the viewBox to `0 0 2814 1536` (DE/EN images are 2814px wide).

- [ ] **Step 3: Commit**

```bash
git add public/images/ components/devis/blueprint/
git commit -m "feat(i18n): locale-specific blueprint images FR/DE/EN"
```

---

### Task 5: Language Selector — Navbar with Split Flags

**Files:**
- Create: `components/ui/language-selector.tsx`
- Create: `components/ui/flags.tsx`
- Modify: `components/layout/navbar.tsx`

- [ ] **Step 1: Create SVG flag components**

`components/ui/flags.tsx` — FR tricolore, DE/CH split diagonal, Union Jack. All as inline SVG, ~20x14px.

- [ ] **Step 2: Create language selector dropdown**

`components/ui/language-selector.tsx` — Shows current flag, dropdown with 3 options. On click, sets cookie and redirects to same page with new locale prefix.

- [ ] **Step 3: Add selector to navbar**

Insert `<LanguageSelector />` in the navbar before the CTA button.

- [ ] **Step 4: Commit**

```bash
git add components/ui/flags.tsx components/ui/language-selector.tsx components/layout/navbar.tsx
git commit -m "feat(i18n): language selector with DE/CH split flag and Union Jack"
```

---

### Task 6: Translate Layout Components — Navbar & Footer

**Files:**
- Modify: `components/layout/navbar.tsx`
- Modify: `components/layout/footer.tsx`
- Modify: `lib/constants.ts`

- [ ] **Step 1: Replace hardcoded nav labels with dictionary keys**

Use `useDictionary()` in navbar and footer. Replace all hardcoded French strings with `dict.nav.*`, `dict.footer.*`, `dict.common.*`.

- [ ] **Step 2: Update constants.ts**

Make `NAV_LINKS` use translation keys instead of hardcoded labels.

- [ ] **Step 3: Commit**

```bash
git add components/layout/ lib/constants.ts
git commit -m "feat(i18n): translate navbar and footer"
```

---

### Task 7: Translate Homepage

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: all `components/sections/*.tsx` used on homepage

- [ ] **Step 1: Pass dictionary to homepage sections**

Each section component receives `dict` or uses `useDictionary()` and reads from `dict.home.*`.

- [ ] **Step 2: Replace all hardcoded French strings in section components**

Hero, why-choose-us, cta-banner, counter, services-preview, realisations-grid, testimonials, scroll-video, savoir-faire, before-after-slider, trust-bar, scroll-reveal.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/page.tsx components/sections/
git commit -m "feat(i18n): translate homepage and all sections"
```

---

### Task 8: Translate Devis — Full Quote Flow

**Files:**
- Modify: `components/devis/blueprint/blueprint-interactive.tsx`
- Modify: `components/devis/devis-blueprint.tsx`
- Modify: `components/devis/panels/panel-travaux.tsx`
- Modify: `components/devis/panels/panel-recap.tsx` (including MagicPlan wizard)
- Modify: `components/devis/panels/address-autocomplete.tsx`
- Modify: `components/devis/steps/step-success.tsx`
- Modify: `components/devis/devis-zones-config.ts`
- Modify: `lib/email-templates/devis-confirmation.ts`
- Modify: `app/api/devis/route.ts`

- [ ] **Step 1: Translate blueprint-interactive.tsx**

Replace all inline French: zone labels on hover, instructions ("Cliquez sur une pièce"), "Retour au plan", "Touchez une pièce", button text.

- [ ] **Step 2: Translate panel-travaux.tsx**

Replace: header text, "travaux sélectionnés", "Cochez les travaux", photo encouragement, upload button, validate button. Zone labels and work item labels come from `dict.devis_zones` and `dict.devis_works`.

- [ ] **Step 3: Translate panel-recap.tsx + MagicPlan wizard**

Replace: summary title, budget, message label, contact labels, address placeholder, MagicPlan CTA + all 5 wizard steps, submit button, error text.

- [ ] **Step 4: Translate step-success.tsx**

Replace: success title, message, buttons.

- [ ] **Step 5: Translate email template**

`lib/email-templates/devis-confirmation.ts` — receive locale, use appropriate language for subject line, headers, footer. The email to Aiman stays in French; the client copy uses their locale.

- [ ] **Step 6: Update API route to accept locale**

`app/api/devis/route.ts` — read locale from formData, pass to email template.

- [ ] **Step 7: Commit**

```bash
git add components/devis/ lib/email-templates/ app/api/devis/
git commit -m "feat(i18n): translate full devis flow including MagicPlan wizard and emails"
```

---

### Task 9: Translate Remaining Pages

**Files:**
- Modify: `app/[locale]/services/page.tsx`
- Modify: `app/[locale]/services/[slug]/page.tsx`
- Modify: `app/[locale]/contact/page.tsx`
- Modify: `app/[locale]/a-propos/page.tsx`
- Modify: `app/[locale]/realisations/page.tsx`
- Modify: `app/[locale]/faq/page.tsx`
- Modify: `app/[locale]/cgv/page.tsx`
- Modify: `app/[locale]/mentions-legales/page.tsx`
- Modify: `app/[locale]/politique-confidentialite/page.tsx`
- Modify: `lib/services.ts`
- Modify: `lib/faq.ts`

- [ ] **Step 1: Translate services pages**

Service titles, descriptions, features, process steps — all from dictionary. `lib/services.ts` uses translation keys.

- [ ] **Step 2: Translate contact page**

Form labels, business hours, CTA text.

- [ ] **Step 3: Translate about page**

Story, steps, engagements, certifications.

- [ ] **Step 4: Translate remaining pages**

Realisations, FAQ, CGV, mentions légales, politique de confidentialité.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/ lib/services.ts lib/faq.ts
git commit -m "feat(i18n): translate all remaining pages (services, contact, about, legal)"
```

---

### Task 10: Translate 404 Page

**Files:**
- Modify: `app/[locale]/not-found.tsx`

- [ ] **Step 1: Translate all 8 variants**

Each variant's title and subtitle comes from `dict.not_found.variant{N}_title` / `dict.not_found.variant{N}_subtitle`. Buttons and help text also from dictionary.

- [ ] **Step 2: Commit**

```bash
git add app/[locale]/not-found.tsx
git commit -m "feat(i18n): translate 404 page (8 variants × 3 languages)"
```

---

### Task 11: SEO — Metadata, hreflang, JSON-LD, Sitemap

**Files:**
- Modify: `app/[locale]/layout.tsx` — hreflang tags + JSON-LD per locale
- Modify: each `app/[locale]/*/page.tsx` — metadata from dictionary
- Modify: `app/sitemap.xml/route.ts` or `app/sitemap.ts`

- [ ] **Step 1: Add hreflang alternate links**

In the locale layout, add `<link rel="alternate" hreflang="fr" href="...">` etc for each locale.

- [ ] **Step 2: Translate metadata per page**

Each page's `generateMetadata()` reads from `dict.seo.*`.

- [ ] **Step 3: Update JSON-LD schema with locale**

Service names, slogan, description in the current locale.

- [ ] **Step 4: Generate multilingual sitemap**

Each page × 3 locales in the sitemap with `hreflang` annotations.

- [ ] **Step 5: Commit**

```bash
git add app/
git commit -m "feat(i18n): SEO — hreflang, translated metadata, multilingual sitemap"
```

---

### Task 12: Final Integration — Build, Test, Deploy

**Files:**
- All

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 2: Run build**

```bash
npx next build
```

- [ ] **Step 3: Test locale routing manually**

- Visit `/` → FR content
- Visit `/de/` → DE content
- Visit `/en/` → EN content
- Visit `/de/devis` → German blueprint + translated form
- Change language via selector → cookie set, redirect works
- Submit devis in DE → email in German

- [ ] **Step 4: Deploy**

```bash
git push && npx vercel deploy --prod
```

- [ ] **Step 5: Verify in production**

Test all 3 locales on aiman-renovation.fr.
