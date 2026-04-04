import fs from "fs";
import path from "path";

const API_KEY = process.env.GEMINI_API_KEY;
const OUT_DIR = path.resolve("public/images/realisations");

const PAIRS = [
  {
    name: "cuisine",
    before: "Photo réaliste d'une vieille cuisine à rénover dans une maison alsacienne. Meubles anciens défraîchis, carrelage au sol usé, plan de travail abîmé, éclairage jaunâtre au plafond, murs peints écaillés. Vue d'ensemble de la pièce, lumière naturelle depuis une fenêtre. Style photo de chantier, très réaliste.",
    after: "Photo réaliste d'une cuisine moderne rénovée dans la MÊME pièce, même angle de vue, même fenêtre. Cuisine ouverte contemporaine avec îlot central, plan de travail en quartz blanc, meubles laqués gris anthracite, éclairage LED encastré, crédence en carrelage métro blanc. Sol en carrelage grand format gris clair. Très réaliste, photo d'intérieur professionnelle."
  },
  {
    name: "salle-de-bain",
    before: "Photo réaliste d'une vieille salle de bain à rénover. Baignoire jaunie avec rideau de douche, carrelage mural blanc cassé des années 80, joints noircis, lavabo sur colonne, miroir simple, éclairage néon au plafond. Petite pièce de 8m². Photo de chantier réaliste.",
    after: "Photo réaliste d'une salle de bain moderne rénovée dans la MÊME pièce, même angle. Douche à l'italienne avec paroi vitrée, double vasque suspendue, grand miroir rétroéclairé, carrelage grand format imitation marbre blanc veiné, niche éclairée dans la douche, sol en grès cérame gris. Photo d'intérieur professionnelle."
  },
  {
    name: "facade-ite",
    before: "Photo réaliste de la façade extérieure d'une maison des années 70 en Alsace, avant rénovation. Crépi fissuré et grisâtre, volets en bois abîmés, pas d'isolation visible, fenêtres simple vitrage. Jardin devant, ciel gris. Photo réaliste prise depuis la rue.",
    after: "Photo réaliste de la MÊME maison après ravalement et isolation thermique par l'extérieur. Enduit neuf ton pierre clair, volets neufs anthracite, fenêtres PVC double vitrage, gouttières neuves. Même angle de vue, même jardin, mais la maison est transformée. Ciel bleu. Photo réaliste."
  },
  {
    name: "jardin",
    before: "Photo réaliste d'un jardin non aménagé derrière une maison alsacienne. Pelouse irrégulière avec zones de terre, pas de terrasse, quelques arbustes mal entretenus, clôture en grillage. Vue d'ensemble depuis la maison. Réaliste.",
    after: "Photo réaliste du MÊME jardin après aménagement paysager. Belle terrasse en bois composite, allées en pavés autobloquants, haie de buis taillée, éclairage extérieur LED au sol, gazon impeccable, salon de jardin moderne. Même angle de vue. Photo professionnelle."
  },
  {
    name: "borne-irve",
    before: "Photo réaliste d'un garage résidentiel simple avec un mur nu en parpaing peint, un tableau électrique basique, des câbles apparents. Place de parking vide. Éclairage néon. Photo de chantier réaliste.",
    after: "Photo réaliste du MÊME garage après installation d'une borne de recharge pour véhicule électrique. Wallbox blanche moderne fixée au mur, câblage propre avec goulotte, signalétique au sol verte pour la place, éclairage LED. Voiture électrique branchée. Photo professionnelle."
  },
  {
    name: "panneaux-solaires",
    before: "Photo réaliste d'une toiture de maison individuelle en Alsace vue depuis le jardin. Tuiles en terre cuite, pas de panneaux, gouttière, velux. Maison de plain-pied ou R+1, ciel bleu. Photo réaliste depuis le sol.",
    after: "Photo réaliste de la MÊME maison, même angle, avec 16 panneaux solaires photovoltaïques noirs installés sur le pan sud de la toiture. Panneaux alignés proprement, câbles invisibles, même tuiles autour. Ciel bleu, soleil. Photo professionnelle."
  },
  {
    name: "peinture",
    before: "Photo réaliste d'un salon d'appartement avant rénovation peinture. Murs avec peinture écaillée, traces d'humidité, plafond jauni, parquet ancien rayé, plinthes abîmées. Pièce vide avec lumière depuis une fenêtre. Photo de chantier réaliste.",
    after: "Photo réaliste du MÊME salon après peinture et finitions. Murs blanc mat impeccable, plafond peint en blanc, parquet stratifié neuf chêne clair, plinthes neuves blanches, éclairage moderne. Même fenêtre, même angle. Pièce lumineuse et propre. Photo d'intérieur professionnelle."
  },
  {
    name: "electricite",
    before: "Photo réaliste d'un vieux tableau électrique dans une maison. Fusibles anciens, câbles emmêlés, boîtier en bakélite, fils non gainés. Mur avec traces. Photo technique de chantier, réaliste.",
    after: "Photo réaliste d'un tableau électrique neuf aux normes NF C 15-100. Coffret Legrand ou Schneider blanc, disjoncteurs différentiels organisés avec étiquettes, câblage propre, peignes de raccordement. Même mur repeint en blanc. Photo technique professionnelle."
  },
  {
    name: "plomberie",
    before: "Photo réaliste de tuyauterie ancienne dans une cave ou salle de bain. Tuyaux en cuivre verdi et plomb, raccords vétustes, traces de calcaire, fuite visible avec trace d'eau. Photo technique de chantier, réaliste.",
    after: "Photo réaliste de la MÊME installation après rénovation plomberie. Tuyaux PER multicouche neufs, raccords à sertir, collecteur d'arrivée d'eau propre, chauffe-eau thermodynamique installé au mur. Tout est propre et organisé. Photo technique professionnelle."
  },
  {
    name: "carrelage",
    before: "Photo réaliste d'un sol de salon avant pose de carrelage. Ancien carrelage fissuré et démodé marron, joints noircis, ragréage visible sur certaines zones. Pièce vide, murs peints. Photo de chantier réaliste.",
    after: "Photo réaliste du MÊME salon après pose de carrelage neuf. Carrelage grès cérame 60x120 imitation béton ciré gris clair, joints fins assortis, plinthes à gorge. Sol impeccable et moderne. Même pièce, même angle. Photo d'intérieur professionnelle."
  }
];

async function generateImage(prompt, outputPath) {
  console.log(`  Generating: ${path.basename(outputPath)}...`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "16:9",
          personGeneration: "dont_allow",
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error(`  ERROR: ${response.status} - ${err.slice(0, 300)}`);
    return false;
  }

  const data = await response.json();
  const b64 = data.predictions?.[0]?.bytesBase64Encoded;

  if (!b64) {
    console.error(`  ERROR: No image in response`);
    return false;
  }

  const buffer = Buffer.from(b64, "base64");
  fs.writeFileSync(outputPath, buffer);
  console.log(`  OK: ${path.basename(outputPath)} (${(buffer.length / 1024).toFixed(0)} KB)`);
  return true;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const pair of PAIRS) {
    console.log(`\n=== ${pair.name} ===`);

    const beforePath = path.join(OUT_DIR, `${pair.name}-avant.png`);
    const afterPath = path.join(OUT_DIR, `${pair.name}-apres.png`);

    await generateImage(pair.before, beforePath);
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 2000));
    await generateImage(pair.after, afterPath);
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log("\n✅ Done! All before/after pairs generated.");
}

main().catch(console.error);
