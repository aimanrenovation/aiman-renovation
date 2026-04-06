# Popup Saisonnier Jardin

## Résumé

Popup élégant (style Apple/dark) sur la page d'accueil pour promouvoir un diagnostic jardin gratuit pendant la saison printemps (avril-mai).

## Déclencheur

- Apparaît quand le visiteur scrolle à 35% de la page d'accueil
- Une seule fois : stocké en `localStorage` (`popup-jardin-dismissed` + timestamp)
- Ne réapparaît pas pendant 7 jours après fermeture
- Ne s'affiche qu'entre le 1er avril et le 31 mai (`getMonth()` === 3 ou 4)

## Design visuel

- Modal centré, fond `#111`, `backdrop-blur-sm`, `border border-white/10`, `rounded-2xl`
- Overlay fond `bg-black/60`
- Icône : `Leaf` de lucide-react dans un cercle vert doux (`bg-green-500/20`)
- Titre : gras, blanc, `text-2xl`
- Sous-titre : `text-gray-300`, `text-sm`
- CTA principal : bouton rouge `#E50000`, texte blanc, full width
- CTA secondaire : texte `text-gray-500`, discret, "Plus tard"
- Mention en bas : `text-gray-600 text-xs`, "Offre valable jusqu'à fin mai 2026"

## Contenu (FR)

- Titre : "C'est la saison du jardin"
- Sous-titre : "Profitez d'un diagnostic jardin gratuit — on vient chez vous évaluer vos extérieurs, sans engagement."
- CTA : "Réserver mon diagnostic gratuit" → lien vers `/devis`
- Dismiss : "Plus tard"
- Mention : "Offre valable jusqu'à fin mai 2026"

## Fichiers

| Fichier | Action | Rôle |
|---------|--------|------|
| `components/seasonal-popup.tsx` | Create | Composant client popup saisonnier |
| `app/[locale]/page.tsx` | Modify | Ajouter `<SeasonalPopup />` |
| `messages/fr.json` | Modify | Clés `popup_jardin` |
| `messages/de.json` | Modify | Clés `popup_jardin` |
| `messages/en.json` | Modify | Clés `popup_jardin` |

## i18n

### FR
```json
"popup_jardin": {
  "title": "C'est la saison du jardin",
  "subtitle": "Profitez d'un diagnostic jardin gratuit — on vient chez vous évaluer vos extérieurs, sans engagement.",
  "cta": "Réserver mon diagnostic gratuit",
  "dismiss": "Plus tard",
  "mention": "Offre valable jusqu'à fin mai 2026"
}
```

### DE
```json
"popup_jardin": {
  "title": "Es ist Gartensaison",
  "subtitle": "Nutzen Sie eine kostenlose Gartendiagnose — wir kommen zu Ihnen und bewerten Ihre Außenanlagen, unverbindlich.",
  "cta": "Kostenlose Diagnose buchen",
  "dismiss": "Später",
  "mention": "Angebot gültig bis Ende Mai 2026"
}
```

### EN
```json
"popup_jardin": {
  "title": "It's garden season",
  "subtitle": "Get a free garden assessment — we'll come to your home to evaluate your outdoor spaces, no commitment.",
  "cta": "Book my free assessment",
  "dismiss": "Maybe later",
  "mention": "Offer valid until end of May 2026"
}
```
