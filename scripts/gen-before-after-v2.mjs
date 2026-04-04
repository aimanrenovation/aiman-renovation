import fs from "fs";
import path from "path";

const API_KEY = process.env.GEMINI_API_KEY;
const OUT_DIR = path.resolve("public/images/realisations");

const PAIRS = [
  {
    name: "cuisine",
    before: "Photo réaliste d'une vieille cuisine à rénover dans une maison alsacienne. Meubles en bois foncé défraîchis années 80, carrelage au sol beige usé, plan de travail en formica abîmé, éclairage jaunâtre au néon, murs peints jaune pâle écaillés, hotte aspirante rouillée. Fenêtre sur la droite avec vue sur un jardin. Photo prise depuis l'entrée de la pièce, angle large, lumière naturelle. Ultra réaliste, qualité photo de chantier.",
    after: "Rénove cette cuisine en gardant EXACTEMENT le même angle de vue, la même fenêtre, la même pièce. Remplace par : cuisine moderne ouverte avec îlot central, meubles laqués gris anthracite, plan de travail en quartz blanc, crédence carrelage métro blanc, éclairage LED encastré au plafond, sol carrelage grand format gris clair. Même fenêtre, même lumière. Photo d'intérieur professionnelle, ultra réaliste.",
  },
  {
    name: "salle-de-bain",
    before: "Photo réaliste d'une vieille salle de bain à rénover. Baignoire jaunie avec rideau de douche plastique, carrelage mural blanc cassé années 80 avec joints noircis, lavabo sur colonne ébréché, miroir simple au-dessus, éclairage néon au plafond, sol en lino usé. Petite pièce de 8m², porte à gauche. Photo prise depuis la porte d'entrée, angle large. Ultra réaliste, photo de chantier.",
    after: "Rénove cette salle de bain en gardant EXACTEMENT le même angle, même pièce, même porte. Remplace par : douche à l'italienne avec paroi vitrée, double vasque suspendue en bois et blanc, grand miroir rétroéclairé LED, carrelage grand format imitation marbre blanc veiné aux murs, sol grès cérame gris anthracite, niche éclairée dans la douche. Ultra réaliste, photo d'intérieur professionnelle.",
  },
  {
    name: "facade-ite",
    before: "Photo réaliste de la façade extérieure d'une maison individuelle des années 70 en Alsace avant rénovation. Crépi gris fissuré et taché, volets en bois marron abîmés avec peinture écaillée, fenêtres simple vitrage, gouttière rouillée, pas d'isolation. Petit jardin devant avec haie mal entretenue, allée en béton. Ciel gris. Photo prise depuis le trottoir en face, vue frontale. Ultra réaliste.",
    after: "Rénove cette façade en gardant EXACTEMENT le même angle de vue, même maison, même jardin. Remplace par : enduit neuf ton pierre clair lisse, volets neufs en aluminium gris anthracite, fenêtres PVC double vitrage blanches, gouttières alu neuves, isolation thermique extérieure visible par l'épaisseur des murs. Même haie taillée proprement, même allée nettoyée. Ciel bleu. Ultra réaliste, photo professionnelle.",
  },
  {
    name: "jardin",
    before: "Photo réaliste d'un jardin arrière non aménagé derrière une maison alsacienne. Pelouse irrégulière avec zones de terre nue et mauvaises herbes, pas de terrasse, quelques arbustes mal entretenus, vieille clôture en grillage rouillé, abri de jardin en tôle. Vue depuis la baie vitrée de la maison. Ultra réaliste, lumière naturelle.",
    after: "Aménage ce jardin en gardant EXACTEMENT le même angle de vue depuis la baie vitrée. Remplace par : belle terrasse en bois composite avec salon de jardin moderne, allées en pavés autobloquants gris, gazon impeccable, haie de buis taillée en bordure, massifs de fleurs colorées, éclairage extérieur LED au sol le long des allées, clôture en bois composite anthracite. Ultra réaliste, photo professionnelle.",
  },
  {
    name: "borne-irve",
    before: "Photo réaliste d'un mur de garage résidentiel simple. Mur en parpaing peint blanc jauni, sol en béton brut, un vieux tableau électrique basique avec câbles apparents désordonnés, prise domestique standard sur le mur, tache d'huile au sol. Place de parking vide. Éclairage néon au plafond. Photo prise de face. Ultra réaliste.",
    after: "Installe une borne de recharge sur ce même mur de garage, EXACTEMENT le même angle. Ajoute : wallbox blanche moderne fixée au mur proprement, câblage propre dans une goulotte blanche, nouveau tableau électrique organisé, signalétique au sol verte pour la place de parking, sol nettoyé et peint en gris. Voiture électrique branchée au câble. Ultra réaliste, photo professionnelle.",
  },
  {
    name: "panneaux-solaires",
    before: "Photo réaliste d'une toiture de maison individuelle en Alsace vue depuis le jardin arrière. Tuiles en terre cuite rouge, deux fenêtres de toit (velux), gouttière en zinc, cheminée en briques. Maison R+1 avec façade crépi beige. Ciel bleu avec quelques nuages. Photo prise depuis le jardin, angle en contre-plongée montrant bien la toiture. Ultra réaliste.",
    after: "Ajoute des panneaux solaires sur cette même toiture, EXACTEMENT le même angle de vue. Installe 16 panneaux solaires photovoltaïques noirs monocristallins alignés proprement sur le pan sud (face visible), câbles invisibles, mêmes tuiles autour. Tout le reste identique : même maison, mêmes velux, même cheminée, même jardin. Ciel bleu, soleil. Ultra réaliste, photo professionnelle.",
  },
  {
    name: "peinture",
    before: "Photo réaliste d'un salon d'appartement vide avant rénovation peinture. Murs avec peinture beige écaillée et traces d'humidité au plafond, plafond jauni, ancien parquet en chêne rayé et terne, plinthes en bois abîmées, une fenêtre à droite avec voilage sale. Pièce de 25m², vide sans meubles. Photo prise depuis le coin opposé à la fenêtre. Ultra réaliste, photo de chantier.",
    after: "Rénove ce salon en gardant EXACTEMENT le même angle de vue, même fenêtre, même pièce. Remplace par : murs blanc mat impeccable, plafond blanc lisse, parquet stratifié neuf chêne clair, plinthes blanches neuves, fenêtre nettoyée avec rideau moderne. Pièce lumineuse, propre et moderne. Ultra réaliste, photo d'intérieur professionnelle.",
  },
  {
    name: "electricite",
    before: "Photo réaliste d'un vieux tableau électrique dans le couloir d'une maison. Coffret en bakélite beige ouvert, fusibles à broches anciens, câbles emmêlés de différentes couleurs sortant du mur, étiquettes manuscrites illisibles, mur autour avec peinture écaillée. Photo de face, éclairage au flash. Ultra réaliste, photo technique de chantier.",
    after: "Remplace ce tableau électrique en gardant EXACTEMENT le même angle de vue, même mur. Installe : coffret Schneider ou Legrand blanc neuf avec porte transparente, disjoncteurs différentiels organisés en rangées avec étiquettes imprimées, peignes de raccordement, câblage propre rangé, mur repeint en blanc autour. Ultra réaliste, photo technique professionnelle.",
  },
  {
    name: "plomberie",
    before: "Photo réaliste de vieille tuyauterie dans une cave ou buanderie. Tuyaux en cuivre verdi et anciens tuyaux en plomb, raccords vétustes avec traces de calcaire blanc, petite fuite visible avec trace d'eau sur le mur, compteur d'eau ancien. Mur en parpaing brut, sol en béton. Éclairage faible. Photo technique de face. Ultra réaliste, photo de chantier.",
    after: "Rénove cette installation en gardant EXACTEMENT le même angle de vue, même mur, même pièce. Remplace par : tuyaux PER multicouche neufs en rouge et bleu, collecteur d'arrivée d'eau en laiton chromé, raccords à sertir, chauffe-eau thermodynamique blanc installé au mur, compteur neuf. Mur propre, sol nettoyé. Ultra réaliste, photo technique professionnelle.",
  },
  {
    name: "carrelage",
    before: "Photo réaliste d'un sol de salon-séjour avant rénovation carrelage. Ancien carrelage marron/beige années 80 fissuré et démodé, joints noircis, quelques carreaux cassés, ragréage visible sur une zone. Murs blancs, pièce vide de 40m², baie vitrée au fond. Photo prise depuis l'entrée de la pièce, angle large au sol. Ultra réaliste, photo de chantier.",
    after: "Remplace le carrelage en gardant EXACTEMENT le même angle de vue, même pièce, même baie vitrée. Pose : carrelage grès cérame 60x120 imitation béton ciré gris clair, joints fins assortis gris, plinthes à gorge assorties. Sol impeccable et moderne, reflets de lumière sur le carrelage. Même pièce transformée. Ultra réaliste, photo d'intérieur professionnelle.",
  },
];

// Étape 1 : Générer l'image "avant" avec Imagen 4
async function generateBefore(prompt, outputPath) {
  console.log(`  [AVANT] Generating...`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: "16:9", personGeneration: "dont_allow" },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error(`  ERROR: ${response.status} - ${err.slice(0, 200)}`);
    return null;
  }

  const data = await response.json();
  const b64 = data.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) { console.error(`  ERROR: No image`); return null; }

  const buffer = Buffer.from(b64, "base64");
  fs.writeFileSync(outputPath, buffer);
  console.log(`  [AVANT] OK (${(buffer.length / 1024).toFixed(0)} KB)`);
  return b64;
}

// Étape 2 : Envoyer le "avant" à Gemini pour générer le "après" cohérent
async function generateAfter(prompt, beforeB64, outputPath) {
  console.log(`  [APRÈS] Generating from before image...`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { mimeType: "image/png", data: beforeB64 } },
            { text: prompt }
          ]
        }],
        generationConfig: {
          responseModalities: ["IMAGE"],
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
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find((p) => p.inlineData);

  if (!imgPart) {
    // Fallback: générer avec Imagen 4 directement
    console.log(`  [APRÈS] Gemini didn't return image, falling back to Imagen 4...`);
    const resp2 = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1, aspectRatio: "16:9", personGeneration: "dont_allow" },
        }),
      }
    );
    if (!resp2.ok) { console.error(`  ERROR fallback`); return false; }
    const data2 = await resp2.json();
    const b64_2 = data2.predictions?.[0]?.bytesBase64Encoded;
    if (!b64_2) { console.error(`  ERROR: No image in fallback`); return false; }
    const buffer = Buffer.from(b64_2, "base64");
    fs.writeFileSync(outputPath, buffer);
    console.log(`  [APRÈS] OK via fallback (${(buffer.length / 1024).toFixed(0)} KB)`);
    return true;
  }

  const buffer = Buffer.from(imgPart.inlineData.data, "base64");
  fs.writeFileSync(outputPath, buffer);
  console.log(`  [APRÈS] OK (${(buffer.length / 1024).toFixed(0)} KB)`);
  return true;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const pair of PAIRS) {
    console.log(`\n=== ${pair.name} ===`);

    const beforePath = path.join(OUT_DIR, `${pair.name}-avant.png`);
    const afterPath = path.join(OUT_DIR, `${pair.name}-apres.png`);

    // Étape 1 : Générer le "avant"
    const beforeB64 = await generateBefore(pair.before, beforePath);
    await new Promise(r => setTimeout(r, 3000));

    if (beforeB64) {
      // Étape 2 : Générer le "après" à partir du "avant"
      await generateAfter(pair.after, beforeB64, afterPath);
    } else {
      console.log(`  Skipping after — before failed`);
    }

    await new Promise(r => setTimeout(r, 3000));
  }

  console.log("\n✅ Done! All before/after pairs generated.");
}

main().catch(console.error);
