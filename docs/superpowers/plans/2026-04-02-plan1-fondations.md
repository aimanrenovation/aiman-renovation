# Plan 1 — Fondations + Pages Statiques

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer le site Next.js complet avec toutes les pages en contenu statique, navigation, footer, SEO — prêt à recevoir la 3D et le formulaire.

**Architecture:** Next.js 16 App Router, Tailwind CSS 4, shadcn/ui. Chaque page est un Server Component. Layout global avec navbar fixe + footer. Metadata dynamique par page pour le SEO.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, next/font (Inter + Archivo Black)

**Spec:** `docs/superpowers/specs/2026-04-02-site-aiman-renovation-design.md`

**IMPORTANT:** Ce plan travaille dans `/Users/Aiman/aiman-renovation/`. Les Plans 2 et 3 travaillent en parallèle dans le même repo — ce plan ne touche PAS aux dossiers `components/3d/` ni `components/devis/`.

---

## File Structure

```
aiman-renovation/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── fonts/ArchivoBlack-Regular.ttf
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── services/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── realisations/page.tsx
│   ├── a-propos/page.tsx
│   ├── devis/page.tsx
│   ├── contact/page.tsx
│   └── faq/page.tsx
├── components/
│   ├── ui/                     (shadcn)
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   └── sections/
│       ├── hero.tsx
│       ├── trust-bar.tsx
│       ├── services-preview.tsx
│       └── cta-banner.tsx
├── lib/
│   ├── utils.ts                (shadcn)
│   ├── constants.ts
│   ├── services.ts
│   └── faq.ts
└── public/
    └── logo/
        ├── logo-white.png
        └── logo-dark.png
```

---

### Task 1: Scaffold Next.js 16

**Files:**
- Create: tout le scaffold via `npx create-next-app`

- [ ] **Step 1: Sauvegarder docs existants**

```bash
cp -r /Users/Aiman/aiman-renovation/docs /tmp/aiman-docs-backup
```

- [ ] **Step 2: Recréer le projet**

```bash
cd /Users/Aiman
rm -rf aiman-renovation
npx create-next-app@latest aiman-renovation --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

- [ ] **Step 3: Restaurer docs + init git**

```bash
cd /Users/Aiman/aiman-renovation
cp -r /tmp/aiman-docs-backup docs/
echo ".superpowers/" >> .gitignore
echo ".env*.local" >> .gitignore
git init && git add . && git commit -m "feat: scaffold Next.js 16 + Tailwind"
```

- [ ] **Step 4: Vérifier**

```bash
npm run dev
```

Ouvrir http://localhost:3000 — page Next.js par défaut.

---

### Task 2: shadcn/ui + fonts + charte couleurs

**Files:**
- Modify: `package.json`, `app/layout.tsx`, `app/globals.css`
- Create: `components/ui/`, `lib/utils.ts`, `app/fonts/`

- [ ] **Step 1: Installer shadcn/ui**

```bash
cd /Users/Aiman/aiman-renovation
npx shadcn@latest init
# Style: New York, Base color: Neutral, CSS variables: Yes
```

- [ ] **Step 2: Installer composants**

```bash
npx shadcn@latest add button card separator accordion badge input textarea label select
```

- [ ] **Step 3: Télécharger Archivo Black**

```bash
mkdir -p app/fonts
curl -sL -o app/fonts/ArchivoBlack-Regular.ttf "https://github.com/google/fonts/raw/main/ofl/archivoblack/ArchivoBlack-Regular.ttf"
```

- [ ] **Step 4: Configurer layout.tsx avec fonts**

Remplacer `app/layout.tsx` :

```tsx
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
  title: {
    default: "Aiman Renovation | Rénovation à Saint-Louis (68)",
    template: "%s | Aiman Renovation",
  },
  description:
    "Spécialiste rénovation second œuvre, façades, isolation et aménagement paysager à Saint-Louis et environs. 19 ans d'expérience. Devis gratuit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${archivoBlack.variable}`}>
      <body className="font-sans antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Configurer globals.css avec couleurs Aiman**

Remplacer `app/globals.css` :

```css
@import "tailwindcss";

@theme inline {
  --color-red: #E50000;
  --color-red-dark: #B80000;
  --color-black: #0A0A0A;
  --color-gray-900: #111111;
  --color-gray-800: #1F2937;
  --color-gray-400: #9CA3AF;
  --color-gray-200: #E5E7EB;
  --color-blue-france: #002B7F;
  --color-red-france: #CE1126;
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-heading: var(--font-archivo), ui-sans-serif, system-ui, sans-serif;
}
```

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat: shadcn/ui + fonts + charte couleurs Aiman"
```

---

### Task 3: Constantes et données

**Files:**
- Create: `lib/constants.ts`
- Create: `lib/services.ts`
- Create: `lib/faq.ts`

- [ ] **Step 1: Créer lib/constants.ts**

```ts
export const COMPANY = {
  name: "Aiman Renovation",
  legalForm: "SASU",
  slogan: "Nous rénovons jusqu'au bout de vos rêves !",
  phone: "03 56 89 44 03",
  mobile: "09 39 24 55 15",
  email: "contact@aiman-renovation.fr",
  address: "14 rue de la Paix",
  city: "Saint-Louis",
  zip: "68300",
  region: "Haut-Rhin, Alsace",
  experience: 19,
  projects: 50,
  founded: 2024,
  website: "https://aiman-renovation.fr",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

export const CTA_LINK = { href: "/devis", label: "Devis gratuit" } as const;
```

- [ ] **Step 2: Créer lib/services.ts**

```ts
export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  features: string[];
}

export const SERVICES: Service[] = [
  {
    slug: "cuisine",
    title: "Rénovation de cuisine",
    shortTitle: "Cuisine",
    description: "Transformez votre cuisine en un espace moderne et fonctionnel. Du plan de travail aux finitions, nous prenons en charge l'intégralité de votre projet.",
    icon: "🍳",
    features: ["Démolition et dépose", "Plomberie et électricité", "Pose de meubles et plan de travail", "Carrelage et crédence", "Peinture et finitions"],
  },
  {
    slug: "salle-de-bain",
    title: "Rénovation salle de bain",
    shortTitle: "Salle de bain",
    description: "Créez la salle de bain de vos rêves. Douche à l'italienne, baignoire, vasque design — nous réalisons tous les styles.",
    icon: "🚿",
    features: ["Plomberie complète", "Étanchéité et isolation", "Carrelage mural et sol", "Installation sanitaires", "Ventilation"],
  },
  {
    slug: "electricite",
    title: "Électricité",
    shortTitle: "Électricité",
    description: "Mise aux normes, rénovation complète ou extension de votre installation électrique. Sécurité et conformité garanties.",
    icon: "⚡",
    features: ["Mise aux normes NF C 15-100", "Tableau électrique", "Prises et interrupteurs", "Éclairage LED", "Domotique"],
  },
  {
    slug: "plomberie",
    title: "Plomberie",
    shortTitle: "Plomberie",
    description: "Installation et rénovation de vos réseaux d'eau. Du remplacement de tuyauterie à la création de nouveaux points d'eau.",
    icon: "🔧",
    features: ["Remplacement tuyauterie", "Installation chauffe-eau", "Création points d'eau", "Réparation fuites", "Raccordements"],
  },
  {
    slug: "carrelage",
    title: "Carrelage et revêtement de sol",
    shortTitle: "Carrelage",
    description: "Pose de carrelage, parquet, vinyle ou béton ciré. Un sol neuf transforme une pièce entière.",
    icon: "🏗️",
    features: ["Carrelage intérieur/extérieur", "Parquet massif et stratifié", "Vinyle et PVC", "Béton ciré", "Ragréage et préparation"],
  },
  {
    slug: "facade-isolation",
    title: "Façades et isolation",
    shortTitle: "Façades",
    description: "Ravalement de façade, isolation thermique par l'extérieur (ITE) ou l'intérieur (ITI). Améliorez le confort et réduisez vos factures.",
    icon: "🏛️",
    features: ["Ravalement de façade", "ITE", "ITI", "Enduit et crépi", "Peinture extérieure"],
  },
  {
    slug: "paysager",
    title: "Aménagement paysager",
    shortTitle: "Paysager",
    description: "Conception et réalisation de vos espaces extérieurs. Terrasses, allées, plantations, clôtures.",
    icon: "🌿",
    features: ["Création de terrasses", "Allées et bordures", "Plantations et engazonnement", "Clôtures et portails", "Éclairage extérieur"],
  },
  {
    slug: "peinture-finitions",
    title: "Peinture et finitions",
    shortTitle: "Peinture",
    description: "Peinture intérieure et extérieure, enduits décoratifs, papier peint. La touche finale qui fait toute la différence.",
    icon: "🎨",
    features: ["Peinture intérieure", "Peinture extérieure", "Enduits décoratifs", "Papier peint", "Préparation des supports"],
  },
  {
    slug: "borne-recharge",
    title: "Borne de recharge véhicule électrique",
    shortTitle: "Borne IRVE",
    description: "Installation de bornes de recharge pour véhicules électriques. À domicile ou en copropriété.",
    icon: "🔌",
    features: ["Borne murale (wallbox)", "Installation en copropriété", "Mise aux normes", "Certification IRVE", "Aide et subventions"],
  },
  {
    slug: "panneaux-photovoltaiques",
    title: "Panneaux photovoltaïques",
    shortTitle: "Photovoltaïque",
    description: "Produisez votre propre électricité. Installation de panneaux solaires sur toiture.",
    icon: "☀️",
    features: ["Étude de faisabilité", "Installation sur toiture", "Raccordement réseau", "Autoconsommation", "Aide et subventions"],
  },
];
```

- [ ] **Step 3: Créer lib/faq.ts**

```ts
export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  { category: "Devis", question: "Comment obtenir un devis ?", answer: "Remplissez notre formulaire en ligne ou appelez-nous au 03 56 89 44 03. Nous vous envoyons un devis détaillé sous 48h après visite technique." },
  { category: "Devis", question: "Le devis est-il gratuit ?", answer: "Oui, tous nos devis sont gratuits et sans engagement. La visite technique est incluse." },
  { category: "Travaux", question: "Quelle est votre zone d'intervention ?", answer: "Nous intervenons à Saint-Louis et dans tout le Haut-Rhin : Huningue, Hésingue, Village-Neuf, Blotzheim, Bartenheim, Kembs, et au-delà sur demande." },
  { category: "Travaux", question: "Combien de temps durent les travaux ?", answer: "Cela dépend du projet. Salle de bain : 2-3 semaines, cuisine : 3-4 semaines, façade : 2-6 semaines. Planning précis dans le devis." },
  { category: "Travaux", question: "Intervenez-vous en copropriété ?", answer: "Oui : ravalement, isolation, parties communes. Nous travaillons en coordination avec le syndic." },
  { category: "Garanties", question: "Quelles garanties proposez-vous ?", answer: "RC professionnelle et garantie décennale. Garantie de parfait achèvement (1 an) et décennale (10 ans) sur tous nos travaux." },
  { category: "Garanties", question: "Êtes-vous certifié IRVE ?", answer: "Oui, nous disposons de la certification IRVE pour l'installation de bornes de recharge." },
  { category: "Paiement", question: "Quelles sont les modalités de paiement ?", answer: "Acompte de 30% à la signature, paiements échelonnés selon l'avancement, solde à la réception des travaux." },
  { category: "Paiement", question: "Existe-t-il des aides financières ?", answer: "Oui : MaPrimeRénov', CEE, éco-PTZ, crédit d'impôt selon les travaux. Nous vous accompagnons dans les démarches." },
];
```

- [ ] **Step 4: Commit**

```bash
git add lib/ && git commit -m "feat: constantes, 10 services, FAQ"
```

---

### Task 4: Navbar responsive

**Files:**
- Create: `components/layout/navbar.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Créer components/layout/navbar.tsx**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NAV_LINKS, CTA_LINK } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo/logo-white.png" alt="Aiman Renovation" width={140} height={40} priority />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-white/80 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
          <Button asChild className="bg-red hover:bg-red-dark text-white rounded-md px-6">
            <Link href={CTA_LINK.href}>{CTA_LINK.label}</Link>
          </Button>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden flex flex-col gap-1.5 p-2" aria-label="Menu">
          <span className={`block w-6 h-0.5 bg-white transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 mt-3">
          <div className="flex flex-col px-6 py-4 gap-4">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-white/80 hover:text-white text-lg">
                {link.label}
              </Link>
            ))}
            <Button asChild className="bg-red hover:bg-red-dark text-white w-full mt-2">
              <Link href={CTA_LINK.href}>{CTA_LINK.label}</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Copier les logos**

```bash
mkdir -p public/logo
# Exporter depuis Canva ou copier les fichiers existants
cp /Users/Aiman/aiman-renovation-backup/logo-white.png public/logo/ 2>/dev/null || echo "TODO: exporter logo blanc depuis Canva"
cp /Users/Aiman/aiman-renovation-backup/logo-dark.png public/logo/ 2>/dev/null || echo "TODO: exporter logo sombre depuis Canva"
```

Si les logos ne sont pas trouvés, les exporter depuis Canva (design `DAEtEjkEGvA`, page 2 pour horizontal blanc sur fond sombre).

- [ ] **Step 3: Ajouter Navbar dans layout.tsx**

Modifier `app/layout.tsx` — ajouter import et composant :

```tsx
import { Navbar } from "@/components/layout/navbar";

// Dans le body :
<body className="font-sans antialiased bg-black text-white">
  <Navbar />
  <main>{children}</main>
</body>
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/navbar.tsx app/layout.tsx public/logo/ && git commit -m "feat: navbar responsive logo + liens + CTA rouge"
```

---

### Task 5: Footer

**Files:**
- Create: `components/layout/footer.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Créer components/layout/footer.tsx**

```tsx
import Link from "next/link";
import Image from "next/image";
import { COMPANY, NAV_LINKS } from "@/lib/constants";
import { SERVICES } from "@/lib/services";

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Image src="/logo/logo-white.png" alt="Aiman Renovation" width={120} height={35} />
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">{COMPANY.slogan}</p>
            <div className="flex gap-1 mt-4">
              <div className="w-8 h-1 rounded-full bg-blue-france" />
              <div className="w-8 h-1 rounded-full bg-white" />
              <div className="w-8 h-1 rounded-full bg-red-france" />
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {SERVICES.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">{s.shortTitle}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
              <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{COMPANY.phone}</a></li>
              <li><a href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{COMPANY.mobile}</a></li>
              <li><a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">{COMPANY.email}</a></li>
              <li>{COMPANY.address}<br />{COMPANY.zip} {COMPANY.city}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Ajouter dans layout.tsx après main**

```tsx
import { Footer } from "@/components/layout/footer";

// body :
<Navbar />
<main>{children}</main>
<Footer />
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/footer.tsx app/layout.tsx && git commit -m "feat: footer 4 colonnes avec tricolore"
```

---

### Task 6: Page accueil (sections statiques)

**Files:**
- Create: `components/sections/hero.tsx`
- Create: `components/sections/trust-bar.tsx`
- Create: `components/sections/services-preview.tsx`
- Create: `components/sections/cta-banner.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: hero.tsx** — Hero plein écran, fond noir, placeholder container pour 3D future

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div id="hero-3d-container" className="absolute inset-0" data-placeholder="3d-hero" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-1 rounded-full bg-blue-france" />
          <div className="w-8 h-1 rounded-full bg-white" />
          <div className="w-8 h-1 rounded-full bg-red-france" />
        </div>
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight">
          RÉNOVATION<br /><span className="text-red">SUR MESURE</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          {COMPANY.slogan} Spécialiste de la rénovation à {COMPANY.city} et environs depuis {COMPANY.experience} ans.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-red hover:bg-red-dark text-white text-lg px-8 py-6 rounded-md">
            <Link href="/devis">Devis gratuit</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-md">
            <Link href="/realisations">Nos réalisations</Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: trust-bar.tsx**

```tsx
import { COMPANY } from "@/lib/constants";

const stats = [
  { value: `+${COMPANY.projects}`, label: "projets réalisés" },
  { value: `${COMPANY.experience} ans`, label: "d'expérience" },
  { value: COMPANY.city, label: "et environs (68)" },
];

export function TrustBar() {
  return (
    <section className="bg-gray-900 border-y border-white/10 py-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="font-heading text-3xl md:text-4xl text-red">{stat.value}</div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: services-preview.tsx**

```tsx
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { Card, CardContent } from "@/components/ui/card";

export function ServicesPreview() {
  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl">NOS <span className="text-red">SERVICES</span></h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            De la cuisine à la toiture, nous couvrons tous les métiers de la rénovation.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SERVICES.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`}>
              <Card className="bg-gray-900 border-white/10 hover:border-red/50 transition-all duration-300 h-full group">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="font-semibold text-white group-hover:text-red transition-colors text-sm">{service.shortTitle}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: cta-banner.tsx**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";

export function CtaBanner() {
  return (
    <section className="bg-red py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-heading text-3xl md:text-5xl text-white">UN PROJET EN TÊTE ?</h2>
        <p className="mt-4 text-white/80 text-lg">Décrivez-nous votre projet et recevez un devis gratuit sous 48h.</p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-black hover:bg-gray-900 text-white text-lg px-8 py-6">
            <Link href="/devis">Demander un devis gratuit</Link>
          </Button>
          <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="text-white/90 hover:text-white text-lg font-semibold">
            ou appelez le {COMPANY.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Assembler app/page.tsx**

```tsx
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { ServicesPreview } from "@/components/sections/services-preview";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesPreview />
      <CtaBanner />
    </>
  );
}
```

- [ ] **Step 6: Vérifier** http://localhost:3000

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx components/sections/ && git commit -m "feat: page accueil — hero, trust, services, CTA"
```

---

### Task 7: Pages Services + [slug]

**Files:**
- Create: `app/services/page.tsx`
- Create: `app/services/[slug]/page.tsx`

- [ ] **Step 1: app/services/page.tsx** — Vue d'ensemble

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Nos services",
  description: "Rénovation cuisine, salle de bain, façades, isolation, paysager, électricité, plomberie, carrelage, borne IRVE, photovoltaïque.",
};

export default function ServicesPage() {
  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-6xl">NOS <span className="text-red">SERVICES</span></h1>
          <p className="mt-4 text-gray-400 text-lg max-w-3xl mx-auto">
            Du sol au plafond, de l'intérieur à l'extérieur — nous maîtrisons tous les corps de métier.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`}>
              <Card className="bg-gray-900 border-white/10 hover:border-red/50 transition-all duration-300 h-full group">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{service.icon}</div>
                    <div className="flex-1">
                      <h2 className="font-heading text-xl text-white group-hover:text-red transition-colors">{service.title}</h2>
                      <p className="mt-2 text-gray-400 text-sm leading-relaxed">{service.description}</p>
                      <ul className="mt-4 grid grid-cols-2 gap-1">
                        {service.features.map((f) => (
                          <li key={f} className="text-xs text-gray-500 before:content-['→'] before:text-red before:mr-1">{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: app/services/[slug]/page.tsx** — Pages dynamiques avec placeholder 3D

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { COMPANY } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return { title: service.title, description: service.description };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <section className="pt-32 pb-20 bg-black min-h-[60vh] relative">
        <div id={`scene-3d-${service.slug}`} className="absolute inset-0 top-16" data-placeholder="3d-service" data-service={service.slug} />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-1 rounded-full bg-blue-france" />
            <div className="w-6 h-1 rounded-full bg-white" />
            <div className="w-6 h-1 rounded-full bg-red-france" />
          </div>
          <div className="text-6xl mb-4">{service.icon}</div>
          <h1 className="font-heading text-4xl md:text-6xl">{service.title.toUpperCase()}</h1>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl">{service.description}</p>
        </div>
      </section>
      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-heading text-2xl mb-8">CE QUE NOUS <span className="text-red">RÉALISONS</span></h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 bg-black/50 rounded-lg p-4 border border-white/5">
                <span className="text-red text-lg">→</span>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl mb-4">INTÉRESSÉ PAR CE SERVICE ?</h2>
          <p className="text-gray-400 mb-8">Décrivez votre projet et recevez un devis gratuit sous 48h.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-red hover:bg-red-dark text-white px-8 py-6">
              <Link href="/devis">Demander un devis</Link>
            </Button>
            <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="text-gray-400 hover:text-white">{COMPANY.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/services/ && git commit -m "feat: page services + 10 pages [slug] dynamiques"
```

---

### Task 8: Page Réalisations

**Files:**
- Create: `app/realisations/page.tsx`

- [ ] **Step 1: Créer app/realisations/page.tsx** avec grille placeholder + filtres

```tsx
import type { Metadata } from "next";
import { SERVICES } from "@/lib/services";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "Nos réalisations",
  description: "Découvrez nos projets de rénovation à Saint-Louis et environs. Avant/après.",
};

const PROJECTS = [
  { title: "Rénovation cuisine complète", service: "cuisine", location: "Saint-Louis" },
  { title: "Salle de bain moderne", service: "salle-de-bain", location: "Huningue" },
  { title: "Ravalement façade ITE", service: "facade-isolation", location: "Hésingue" },
  { title: "Aménagement jardin", service: "paysager", location: "Blotzheim" },
  { title: "Installation borne IRVE", service: "borne-recharge", location: "Saint-Louis" },
  { title: "Panneaux solaires toiture", service: "panneaux-photovoltaiques", location: "Bartenheim" },
];

export default function RealisationsPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-heading text-5xl md:text-6xl">NOS <span className="text-red">RÉALISATIONS</span></h1>
            <p className="mt-4 text-gray-400 text-lg">Chaque projet est unique. Voici un aperçu de nos transformations.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button className="px-4 py-2 rounded-full bg-red text-white text-sm">Tous</button>
            {SERVICES.slice(0, 6).map((s) => (
              <button key={s.slug} className="px-4 py-2 rounded-full border border-white/20 text-gray-400 hover:border-red hover:text-white text-sm transition-colors">{s.shortTitle}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project, i) => (
              <div key={i} className="group relative aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden border border-white/5 hover:border-red/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-6xl opacity-20">{SERVICES.find((s) => s.slug === project.service)?.icon}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-semibold text-white">{project.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{project.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/realisations/ && git commit -m "feat: page réalisations — grille projets + filtres"
```

---

### Task 9: Page À propos

**Files:**
- Create: `app/a-propos/page.tsx`

- [ ] **Step 1: Créer la page** avec histoire, valeurs, zone

```tsx
import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "À propos",
  description: `${COMPANY.name} — ${COMPANY.experience} ans d'expérience en rénovation à ${COMPANY.city}.`,
};

export default function AProposPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-heading text-5xl md:text-6xl">À <span className="text-red">PROPOS</span></h1>
          <div className="mt-12 space-y-12">
            <div>
              <h2 className="font-heading text-2xl text-red mb-4">NOTRE HISTOIRE</h2>
              <p className="text-gray-400 leading-relaxed">
                Fort de {COMPANY.experience} ans d'expérience dans le bâtiment, Aiman a fondé {COMPANY.name} avec une conviction : chaque habitat mérite d'être transformé avec le même soin, la même exigence et la même passion. Basés à {COMPANY.city}, nous intervenons dans tout le Haut-Rhin.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl text-red mb-4">NOS VALEURS</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Qualité", desc: "Des matériaux sélectionnés, une exécution soignée. Aucun compromis." },
                  { title: "Transparence", desc: "Devis détaillé, suivi régulier, aucune surprise." },
                  { title: "Engagement", desc: "Nous rénovons jusqu'au bout de vos rêves. Chaque projet mené à terme." },
                ].map((v) => (
                  <div key={v.title} className="bg-gray-900 border border-white/5 rounded-lg p-6">
                    <h3 className="font-heading text-lg text-white mb-2">{v.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-heading text-2xl text-red mb-4">ZONE D'INTERVENTION</h2>
              <p className="text-gray-400 leading-relaxed">
                Nous intervenons à {COMPANY.city} et dans toutes les communes environnantes : Huningue, Hésingue, Village-Neuf, Blotzheim, Bartenheim, Kembs, Sierentz, Leymen, Hagenthal et au-delà.
              </p>
            </div>
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/a-propos/ && git commit -m "feat: page à propos — histoire, valeurs, zone"
```

---

### Task 10: Page Contact

**Files:**
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Créer la page** avec coordonnées, horaires, carte

```tsx
import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contactez ${COMPANY.name} à ${COMPANY.city}. Devis gratuit sous 48h.`,
};

export default function ContactPage() {
  return (
    <section className="pt-32 pb-20 bg-black min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-heading text-5xl md:text-6xl mb-12"><span className="text-red">CONTACTEZ</span>-NOUS</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-xl text-white mb-4">COORDONNÉES</h2>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-red text-xl">📞</span>
                  <div>
                    <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="text-white hover:text-red transition-colors text-lg font-semibold">{COMPANY.phone}</a>
                    <p className="text-sm">Fixe</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red text-xl">📱</span>
                  <div>
                    <a href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`} className="text-white hover:text-red transition-colors text-lg font-semibold">{COMPANY.mobile}</a>
                    <p className="text-sm">Mobile</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red text-xl">✉️</span>
                  <a href={`mailto:${COMPANY.email}`} className="text-white hover:text-red transition-colors">{COMPANY.email}</a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red text-xl">📍</span>
                  <div><p className="text-white">{COMPANY.address}</p><p>{COMPANY.zip} {COMPANY.city}</p></div>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-xl text-white mb-4">HORAIRES</h2>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex justify-between"><span>Lundi – Vendredi</span><span className="text-white">8h – 18h</span></li>
                <li className="flex justify-between"><span>Samedi</span><span className="text-white">Sur rendez-vous</span></li>
                <li className="flex justify-between"><span>Dimanche</span><span className="text-gray-600">Fermé</span></li>
              </ul>
            </div>
            <Button asChild size="lg" className="bg-red hover:bg-red-dark text-white w-full py-6">
              <a href="/devis">Demander un devis gratuit</a>
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden border border-white/10 h-[400px] md:h-full min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10706!2d7.5596!3d47.5845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4791b7b2a0e7ddd7%3A0x40a5fb99a3f0dd0!2sSaint-Louis!5e0!3m2!1sfr!2sfr"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Aiman Renovation"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/contact/ && git commit -m "feat: page contact — coordonnées, horaires, carte"
```

---

### Task 11: Page FAQ + Page Devis placeholder

**Files:**
- Create: `app/faq/page.tsx`
- Create: `app/devis/page.tsx`

- [ ] **Step 1: app/faq/page.tsx** avec accordion + schema JSON-LD

```tsx
import type { Metadata } from "next";
import { FAQ_ITEMS } from "@/lib/faq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes sur la rénovation, devis, garanties et aides financières.",
};

export default function FaqPage() {
  const categories = [...new Set(FAQ_ITEMS.map((f) => f.category))];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="pt-32 pb-20 bg-black min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-heading text-5xl md:text-6xl mb-4"><span className="text-red">FAQ</span></h1>
          <p className="text-gray-400 text-lg mb-12">Les réponses à vos questions les plus fréquentes.</p>
          {categories.map((category) => (
            <div key={category} className="mb-10">
              <h2 className="font-heading text-lg text-red mb-4 uppercase tracking-wider">{category}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQ_ITEMS.filter((f) => f.category === category).map((item, i) => (
                  <AccordionItem key={i} value={`${category}-${i}`} className="border border-white/10 rounded-lg px-6 bg-gray-900">
                    <AccordionTrigger className="text-white text-left hover:text-red">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-400">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
```

- [ ] **Step 2: app/devis/page.tsx** — placeholder pour Plan 3

```tsx
import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Devis gratuit",
  description: `Demandez votre devis gratuit en ligne. ${COMPANY.name} vous répond sous 48h.`,
};

export default function DevisPage() {
  return (
    <section className="pt-32 pb-20 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="font-heading text-5xl md:text-6xl mb-4">DEVIS <span className="text-red">GRATUIT</span></h1>
        <p className="text-gray-400 text-lg mb-12">Configurez votre projet en 3D et recevez un devis personnalisé sous 48h.</p>
        <div id="devis-3d-container" className="w-full aspect-video bg-gray-900 rounded-lg border border-white/10 flex items-center justify-center" data-placeholder="3d-devis">
          <div className="text-center">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-gray-500">Formulaire 3D interactif en cours de chargement...</p>
            <p className="text-sm text-gray-600 mt-2">
              En attendant, appelez-nous au <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="text-red hover:underline">{COMPANY.phone}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/faq/ app/devis/ && git commit -m "feat: page FAQ + page devis placeholder"
```

---

### Task 12: SEO — sitemap, robots, schema LocalBusiness

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: app/sitemap.ts**

```ts
import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://aiman-renovation.fr";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    ...SERVICES.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${base}/realisations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/devis`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
```

- [ ] **Step 2: app/robots.ts**

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://aiman-renovation.fr/sitemap.xml" };
}
```

- [ ] **Step 3: Ajouter schema LocalBusiness dans layout.tsx**

Ajouter dans le `<body>`, avant `<Navbar />` :

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      name: "Aiman Renovation",
      url: "https://aiman-renovation.fr",
      telephone: "+33356894403",
      email: "contact@aiman-renovation.fr",
      address: { "@type": "PostalAddress", streetAddress: "14 rue de la Paix", addressLocality: "Saint-Louis", postalCode: "68300", addressCountry: "FR" },
      geo: { "@type": "GeoCoordinates", latitude: 47.5845, longitude: 7.5596 },
      areaServed: { "@type": "GeoCircle", geoMidpoint: { "@type": "GeoCoordinates", latitude: 47.5845, longitude: 7.5596 }, geoRadius: "30000" },
      slogan: "Nous rénovons jusqu'au bout de vos rêves !",
      foundingDate: "2024",
    }),
  }}
/>
```

Note : le `dangerouslySetInnerHTML` est sûr ici car le contenu est un objet JSON statique défini par nous, pas un input utilisateur.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts app/layout.tsx && git commit -m "feat: SEO — sitemap, robots, schema LocalBusiness"
```

---

### Task 13: Build + vérification finale

- [ ] **Step 1: Build production**

```bash
cd /Users/Aiman/aiman-renovation && npm run build
```

Attendu : aucune erreur. 18+ pages générées statiquement.

- [ ] **Step 2: Tester toutes les routes**

```bash
npm run start
```

Vérifier dans le navigateur :
- `/` — Accueil (hero + trust + services + CTA)
- `/services` — Vue d'ensemble 10 services
- `/services/cuisine` — Page service dynamique
- `/services/panneaux-photovoltaiques` — Autre page service
- `/realisations` — Grille projets
- `/a-propos` — Histoire + valeurs
- `/devis` — Placeholder 3D
- `/contact` — Coordonnées + carte
- `/faq` — Accordion + JSON-LD
- `/sitemap.xml` — Sitemap généré
- `/robots.txt` — Robots généré

- [ ] **Step 3: Commit final**

```bash
git add . && git commit -m "feat: build vérifié — site complet 18 pages"
```
