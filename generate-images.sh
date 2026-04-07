#!/bin/bash
# Script de generation d'images via Google Gemini Imagen 4.0
# Usage: GEMINI_API_KEY=xxx bash generate-images.sh
# Ou: source .env.local puis bash generate-images.sh

# Charger .env.local si present (securise, jamais committe)
if [ -f ".env.local" ]; then
  set -a
  source .env.local
  set +a
fi

# Verifier que la cle est presente
if [ -z "${GEMINI_API_KEY}" ]; then
  echo "ERREUR: GEMINI_API_KEY non definie."
  echo "  Option 1: Exporter la variable: export GEMINI_API_KEY=AIza..."
  echo "  Option 2: Creer .env.local avec: GEMINI_API_KEY=AIza..."
  echo ""
  echo "Obtenir une cle: https://aistudio.google.com/apikey"
  exit 1
fi

API_KEY="${GEMINI_API_KEY}"
MODEL="imagen-4.0-generate-001"
OUTPUT_DIR="/Users/Aiman/aiman-renovation/public/images"
API_URL="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateImages?key=${API_KEY}"

mkdir -p "$OUTPUT_DIR"

generate_image() {
  local filename="$1"
  local prompt="$2"
  local output_path="${OUTPUT_DIR}/${filename}"

  echo "--- Generating ${filename}..."

  local response
  response=$(curl -s "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{
      \"prompt\": $(python3 -c "import json; print(json.dumps('$prompt'))"),
      \"config\": {
        \"numberOfImages\": 1,
        \"outputMimeType\": \"image/png\"
      }
    }")

  echo "$response" | python3 -c "
import json, sys, base64
try:
    data = json.load(sys.stdin)
    img = data['generatedImages'][0]['image']['imageBytes']
    with open('${output_path}', 'wb') as f:
        f.write(base64.b64decode(img))
    print('OK: ${filename} saved')
except Exception as e:
    print(f'FAIL: ${filename} - {e}')
    print(f'Response: {data if \"data\" in dir() else \"no data\"}', file=sys.stderr)
"
  sleep 2
}

# Use a heredoc approach for prompts with special chars
generate_image_safe() {
  local filename="$1"
  local prompt="$2"
  local output_path="${OUTPUT_DIR}/${filename}"

  echo "--- Generating ${filename}..."

  python3 << PYEOF
import json, base64, urllib.request

api_url = "${API_URL}"
prompt = """${prompt}"""

payload = json.dumps({
    "prompt": prompt,
    "config": {
        "numberOfImages": 1,
        "outputMimeType": "image/png"
    }
}).encode("utf-8")

req = urllib.request.Request(api_url, data=payload, headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode())
    img = data["generatedImages"][0]["image"]["imageBytes"]
    with open("${output_path}", "wb") as f:
        f.write(base64.b64decode(img))
    print("OK: ${filename} saved")
except Exception as e:
    print(f"FAIL: ${filename} - {e}")
PYEOF
  sleep 2
}

echo "=== SERIE HERO (4 images) ==="

generate_image_safe "hero-1.png" \
  "Minimalist dark illustration, construction renovation icon style, red and white on pure black background. A deteriorated old Alsatian half-timbered house with cracks and broken roof. Clean vector style. No text. No letters."

generate_image_safe "hero-2.png" \
  "Minimalist dark illustration, construction renovation icon style, red and white on pure black background. Workers in red uniforms with hard hats demolishing old walls of a house, scaffolding around the building. Clean vector style. No text. No letters."

generate_image_safe "hero-3.png" \
  "Minimalist dark illustration, construction renovation icon style, red and white on pure black background. Workers in red uniforms building and painting walls, installing new windows on a house. Clean vector style. No text. No letters."

generate_image_safe "hero-4.png" \
  "Minimalist dark illustration, construction renovation icon style, red and white on pure black background. A beautiful fully renovated Alsatian house glowing with warm light, garden, modern look. Clean vector style. No text. No letters."

echo ""
echo "=== PICTOGRAMMES SERVICES (10 images) ==="

generate_image_safe "icon-cuisine.png" \
  "Minimalist icon on pure black background, red and white colors only. Modern kitchen with countertop, oven and cabinets, architectural line art style. No text."

generate_image_safe "icon-salle-de-bain.png" \
  "Minimalist icon on pure black background, red and white colors only. Modern bathroom with walk-in shower and floating vanity, architectural line art style. No text."

generate_image_safe "icon-electricite.png" \
  "Minimalist icon on pure black background, red and white colors only. Electrical panel with wires and light bulb, architectural line art style. No text."

generate_image_safe "icon-plomberie.png" \
  "Minimalist icon on pure black background, red and white colors only. Pipes, wrench and water drop, architectural line art style. No text."

generate_image_safe "icon-carrelage.png" \
  "Minimalist icon on pure black background, red and white colors only. Floor tiles being laid in geometric pattern, architectural line art style. No text."

generate_image_safe "icon-facade.png" \
  "Minimalist icon on pure black background, red and white colors only. Building facade with insulation layers visible, architectural line art style. No text."

generate_image_safe "icon-paysager.png" \
  "Minimalist icon on pure black background, red and white colors only. Garden with terrace, tree and pathway, architectural line art style. No text."

generate_image_safe "icon-peinture.png" \
  "Minimalist icon on pure black background, red and white colors only. Paint roller and brush with color swatch, architectural line art style. No text."

generate_image_safe "icon-borne-recharge.png" \
  "Minimalist icon on pure black background, red and white colors only. Electric vehicle charging station wallbox with cable, architectural line art style. No text."

generate_image_safe "icon-photovoltaique.png" \
  "Minimalist icon on pure black background, red and white colors only. House roof with solar panels and sun rays, architectural line art style. No text."

echo ""
echo "=== VISUELS DE SECTION (3 images) ==="

generate_image_safe "section-tools.png" \
  "Minimalist dark illustration on black background, red accent color. Abstract construction tools arrangement: level, trowel, paintbrush, hammer. Geometric elegant style. No text. No letters."

generate_image_safe "section-blueprint.png" \
  "Minimalist dark illustration on black background, red accent color. Abstract house cross-section showing renovation layers: insulation, pipes, wires, tiles. Architectural blueprint style. No text. No letters."

generate_image_safe "section-skyline.png" \
  "Minimalist dark illustration on black background, red accent color. Alsatian village skyline with renovated half-timbered houses, subtle French tricolore blue white red accent. Elegant line art. No text. No letters."

echo ""
echo "=== GENERATION TERMINEE ==="
echo "Images dans: ${OUTPUT_DIR}"
ls -la "${OUTPUT_DIR}"/*.png 2>/dev/null | wc -l | xargs -I{} echo "{} images generees"
