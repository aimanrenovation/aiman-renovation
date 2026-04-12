# MagicPlan API Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Intégrer l'API MagicPlan pour créer automatiquement un projet après soumission du devis, recevoir les plans scannés via webhook, stocker sur S3 Scaleway, et notifier Jarvis.

**Architecture:** Deep link automatique après soumission → webhook reçoit les exports → télécharge et stocke sur S3 → notifie Jarvis WhatsApp + email enrichi à Aiman.

**Tech Stack:** Next.js 16, MagicPlan REST API v2, S3 (Scaleway), Resend, QR code (canvas natif)

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `lib/magicplan.ts` | Create | Client API MagicPlan (auth headers, create project) |
| `lib/s3.ts` | Create | Client S3 Scaleway (upload buffer, generate public URL) |
| `app/api/magicplan/webhook/route.ts` | Create | Webhook endpoint (receive, download, store, notify) |
| `components/devis/magicplan-confirmation.tsx` | Create | UI post-soumission (deep link + QR code) |
| `app/api/devis/route.ts` | Modify | Ajouter création projet MagicPlan après emails |
| `components/devis/devis-types.ts` | Modify | Ajouter `magicplanProjectId` au state |
| `components/devis/devis-reducer.ts` | Modify | Ajouter action `SET_MAGICPLAN_PROJECT` |
| `components/devis/devis-blueprint.tsx` | Modify | Afficher MagicPlanConfirmation dans la vue success |
| `components/devis/steps/step-success.tsx` | Modify | Ajouter section MagicPlan deep link |
| `components/devis/panels/panel-recap.tsx` | Modify | Retirer wizard 5 étapes, garder juste le texte info |
| `messages/fr.json` | Modify | Nouvelles clés magicplan_confirmation |
| `messages/de.json` | Modify | Nouvelles clés magicplan_confirmation |
| `messages/en.json` | Modify | Nouvelles clés magicplan_confirmation |

---

### Task 1: Client API MagicPlan

**Files:**
- Create: `lib/magicplan.ts`

- [ ] **Step 1: Create the MagicPlan API client**

```typescript
// lib/magicplan.ts

const MAGICPLAN_BASE_URL = "https://cloud.magicplan.app/api/v2";

function getHeaders() {
  return {
    customer: process.env.MAGICPLAN_CUSTOMER_ID!,
    key: process.env.MAGICPLAN_API_KEY!,
    "Content-Type": "application/json",
  };
}

export interface MagicPlanProject {
  id: string;
  name: string;
  external_reference_id: string;
}

export async function createMagicPlanProject(params: {
  name: string;
  externalReferenceId: string;
  address?: string;
  city?: string;
  zip?: string;
}): Promise<MagicPlanProject> {
  const res = await fetch(`${MAGICPLAN_BASE_URL}/projects`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      name: params.name,
      external_reference_id: params.externalReferenceId,
      address_1: params.address,
      city: params.city,
      zip: params.zip,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MagicPlan API error ${res.status}: ${text}`);
  }

  return res.json();
}

export function getMagicPlanDeepLink(projectId: string): string {
  return `magicplanstd://project/${projectId}`;
}

export function verifyWebhookKey(key: string): boolean {
  return key === process.env.MAGICPLAN_API_KEY;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/magicplan.ts
git commit -m "feat: add MagicPlan API client (create project, deep link, webhook verify)"
```

---

### Task 2: Client S3 Scaleway

**Files:**
- Create: `lib/s3.ts`

- [ ] **Step 1: Install AWS S3 SDK**

```bash
cd /Users/Aiman/aiman-renovation && npm install @aws-sdk/client-s3
```

- [ ] **Step 2: Create the S3 client**

```typescript
// lib/s3.ts

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "fr-par",
  endpoint: "https://s3.fr-par.scw.cloud",
  credentials: {
    accessKeyId: process.env.SCW_ACCESS_KEY!,
    secretAccessKey: process.env.SCW_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.SCW_BUCKET!;

export async function uploadToS3(params: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    })
  );

  return `https://${BUCKET}.s3.fr-par.scw.cloud/${params.key}`;
}
```

- [ ] **Step 3: Add S3 env vars to .env.local**

Add these lines to `.env.local` (user must fill in real values):

```
SCW_ACCESS_KEY=your_scaleway_access_key
SCW_SECRET_KEY=your_scaleway_secret_key
SCW_BUCKET=your_bucket_name
```

- [ ] **Step 4: Commit**

```bash
git add lib/s3.ts
git commit -m "feat: add S3 Scaleway client for file uploads"
```

---

### Task 3: Webhook MagicPlan endpoint

**Files:**
- Create: `app/api/magicplan/webhook/route.ts`

- [ ] **Step 1: Create the webhook route**

```typescript
// app/api/magicplan/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookKey } from "@/lib/magicplan";
import { uploadToS3 } from "@/lib/s3";
import { resend, DEVIS_FROM_EMAIL, DEVIS_RECIPIENT_EMAIL } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Verify webhook authenticity
    const key = formData.get("key") as string;
    if (!key || !verifyWebhookKey(key)) {
      return new NextResponse(
        '<?xml version="1.0" encoding="UTF-8"?><response><status>1</status><message>Invalid key</message></response>',
        { status: 401, headers: { "Content-Type": "application/xml" } }
      );
    }

    const projectId = formData.get("project_id") as string;
    const planId = formData.get("planid") as string;
    const title = formData.get("title") as string;
    const email = formData.get("email") as string;
    const externalRefId = formData.get("listing") as string; // external_reference_id

    // Collect file URLs from the payload
    const fileUrls: { type: string; url: string }[] = [];

    // PDF
    const pdf = formData.get("pdf") as string;
    if (pdf) fileUrls.push({ type: "pdf", url: pdf });

    // JPGs (jpg0, jpg1, ...)
    for (let i = 0; ; i++) {
      const jpg = formData.get(`jpg${i}`) as string;
      if (!jpg) break;
      fileUrls.push({ type: `floor-${i}.jpg`, url: jpg });
    }

    // SVGs (svg0, svg1, ...)
    for (let i = 0; ; i++) {
      const svg = formData.get(`svg${i}`) as string;
      if (!svg) break;
      fileUrls.push({ type: `floor-${i}.svg`, url: svg });
    }

    // XML
    const xml = formData.get("xml") as string;
    if (xml) fileUrls.push({ type: "plan.xml", url: xml });

    // Download files and upload to S3
    const s3Prefix = `magicplan/${externalRefId || projectId}`;
    const uploadedFiles: { name: string; url: string }[] = [];

    for (const file of fileUrls) {
      try {
        const res = await fetch(file.url);
        if (!res.ok) continue;
        const buffer = Buffer.from(await res.arrayBuffer());
        const fileName = file.type.includes(".")
          ? file.type
          : `plan.${file.type}`;
        const contentType = fileName.endsWith(".pdf")
          ? "application/pdf"
          : fileName.endsWith(".svg")
            ? "image/svg+xml"
            : fileName.endsWith(".jpg")
              ? "image/jpeg"
              : fileName.endsWith(".xml")
                ? "application/xml"
                : "application/octet-stream";

        const s3Url = await uploadToS3({
          key: `${s3Prefix}/${fileName}`,
          body: buffer,
          contentType,
        });
        uploadedFiles.push({ name: fileName, url: s3Url });
      } catch (err) {
        console.error(`Failed to download/upload ${file.type}:`, err);
      }
    }

    // Save metadata
    const metadata = {
      projectId,
      planId,
      title,
      email,
      externalRefId,
      files: uploadedFiles,
      receivedAt: new Date().toISOString(),
    };

    await uploadToS3({
      key: `${s3Prefix}/metadata.json`,
      body: Buffer.from(JSON.stringify(metadata, null, 2)),
      contentType: "application/json",
    });

    // Notify via email
    const pdfFile = uploadedFiles.find((f) => f.name === "plan.pdf");
    const filesListHtml = uploadedFiles
      .map((f) => `<li><a href="${f.url}">${f.name}</a></li>`)
      .join("");

    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: DEVIS_RECIPIENT_EMAIL,
      subject: `MagicPlan reçu — ${title || "Sans titre"} (ref: ${externalRefId || projectId})`,
      html: `
        <h2>Nouveau plan MagicPlan reçu</h2>
        <p><strong>Projet :</strong> ${title}</p>
        <p><strong>Référence devis :</strong> ${externalRefId || "N/A"}</p>
        <p><strong>Email client :</strong> ${email}</p>
        <h3>Fichiers uploadés sur S3 :</h3>
        <ul>${filesListHtml}</ul>
        ${pdfFile ? `<p><a href="${pdfFile.url}" style="color:#E50000;font-weight:bold;">Voir le PDF du plan</a></p>` : ""}
      `,
    });

    // Notify Jarvis (if webhook URL configured)
    const jarvisUrl = process.env.JARVIS_WEBHOOK_URL;
    if (jarvisUrl) {
      try {
        await fetch(jarvisUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "magicplan_received",
            client: title,
            reference: externalRefId,
            pdfUrl: pdfFile?.url,
            filesCount: uploadedFiles.length,
          }),
        });
      } catch (err) {
        console.error("Failed to notify Jarvis:", err);
      }
    }

    // MagicPlan expects XML response
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><response><status>0</status><message>OK</message></response>',
      { status: 200, headers: { "Content-Type": "application/xml" } }
    );
  } catch (error) {
    console.error("MagicPlan webhook error:", error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><response><status>1</status><message>Internal error</message></response>',
      { status: 500, headers: { "Content-Type": "application/xml" } }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/magicplan/webhook/route.ts
git commit -m "feat: add MagicPlan webhook endpoint (download, S3 upload, email, Jarvis notify)"
```

---

### Task 4: Update devis types and reducer

**Files:**
- Modify: `components/devis/devis-types.ts`
- Modify: `components/devis/devis-reducer.ts`

- [ ] **Step 1: Add `magicplanProjectId` to DevisState**

In `components/devis/devis-types.ts`, add to `DevisState` interface after `magicplanLink`:

```typescript
  magicplanProjectId: string | null;
```

Add to `DevisAction` union:

```typescript
  | { type: "SET_MAGICPLAN_PROJECT"; projectId: string }
```

- [ ] **Step 2: Update the reducer**

In `components/devis/devis-reducer.ts`, add `magicplanProjectId: null` to `initialDevisState`.

Add case in `devisReducer`:

```typescript
    case "SET_MAGICPLAN_PROJECT":
      return { ...state, magicplanProjectId: action.projectId };
```

- [ ] **Step 3: Commit**

```bash
git add components/devis/devis-types.ts components/devis/devis-reducer.ts
git commit -m "feat: add magicplanProjectId to devis state and reducer"
```

---

### Task 5: Update POST /api/devis to create MagicPlan project

**Files:**
- Modify: `app/api/devis/route.ts`

- [ ] **Step 1: Add MagicPlan project creation after email sending**

At the top of `app/api/devis/route.ts`, add import:

```typescript
import { createMagicPlanProject, getMagicPlanDeepLink } from "@/lib/magicplan";
```

After the two `resend.emails.send()` calls (after line 76 in the current file), add:

```typescript
    // Create MagicPlan project
    let magicplanProjectId: string | null = null;
    let magicplanDeepLink: string | null = null;

    try {
      const refId = `devis-${Date.now()}`;
      const project = await createMagicPlanProject({
        name: `${data.contact.firstName} ${data.contact.lastName}`,
        externalReferenceId: refId,
        address: data.contact.address,
      });
      magicplanProjectId = project.id;
      magicplanDeepLink = getMagicPlanDeepLink(project.id);
    } catch (err) {
      console.error("MagicPlan project creation failed (non-blocking):", err);
    }
```

Change the success response from `return NextResponse.json({ success: true });` to:

```typescript
    return NextResponse.json({
      success: true,
      magicplanProjectId,
      magicplanDeepLink,
    });
```

- [ ] **Step 2: Commit**

```bash
git add app/api/devis/route.ts
git commit -m "feat: create MagicPlan project on devis submission"
```

---

### Task 6: Update devis-blueprint.tsx to handle MagicPlan response

**Files:**
- Modify: `components/devis/devis-blueprint.tsx`

- [ ] **Step 1: Update handleSubmit to store MagicPlan project ID**

In `components/devis/devis-blueprint.tsx`, update the `handleSubmit` function. Replace lines 95-100:

```typescript
      const res = await fetch("/api/devis", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(t("error_server"));
      dispatch({ type: "SET_SUCCESS" });
```

With:

```typescript
      const res = await fetch("/api/devis", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(t("error_server"));

      const result = await res.json();
      if (result.magicplanProjectId) {
        dispatch({ type: "SET_MAGICPLAN_PROJECT", projectId: result.magicplanProjectId });
      }
      dispatch({ type: "SET_SUCCESS" });
```

- [ ] **Step 2: Pass magicplanProjectId to StepSuccessOverlay**

In the success view section (around line 117), change:

```typescript
        <StepSuccessOverlay dispatch={dispatch} />
```

To:

```typescript
        <StepSuccessOverlay dispatch={dispatch} magicplanProjectId={state.magicplanProjectId} />
```

- [ ] **Step 3: Commit**

```bash
git add components/devis/devis-blueprint.tsx
git commit -m "feat: pass MagicPlan project ID to success overlay"
```

---

### Task 7: Update success overlay with MagicPlan deep link + QR code

**Files:**
- Modify: `components/devis/steps/step-success.tsx`

- [ ] **Step 1: Rewrite step-success.tsx with MagicPlan section**

```typescript
// components/devis/steps/step-success.tsx

"use client";

import { useRef, useEffect } from "react";
import { CheckCircle, Phone, ArrowLeft, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/link-button";
import type { DevisAction } from "../devis-types";

interface StepSuccessProps {
  dispatch: React.Dispatch<DevisAction>;
  magicplanProjectId: string | null;
}

function QRCode({ value, size = 160 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simple QR placeholder — in production, use a QR library
    // For now, display the deep link text
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";

    const lines = value.match(/.{1,20}/g) || [value];
    lines.forEach((line, i) => {
      ctx.fillText(line, size / 2, size / 2 - (lines.length * 6) + i * 14);
    });
  }, [value, size]);

  return <canvas ref={canvasRef} width={size} height={size} className="rounded-lg" />;
}

export function StepSuccessOverlay({ dispatch, magicplanProjectId }: StepSuccessProps) {
  const t = useTranslations("devis.success");

  const deepLink = magicplanProjectId
    ? `magicplanstd://project/${magicplanProjectId}`
    : null;

  return (
    <div className="w-full max-w-md mx-4">
      <div className="bg-[#111] rounded-3xl p-10 shadow-2xl border border-white/10 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">{t("title")}</h2>
        <p className="text-gray-300 mb-6">{t("message")}</p>
        <p className="text-gray-400 text-sm mb-8">{t("email_sent")}</p>

        {/* MagicPlan Deep Link Section */}
        {deepLink && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 mb-8 space-y-4">
            <div className="flex items-center justify-center gap-2 text-blue-400">
              <Smartphone className="w-5 h-5" />
              <h3 className="font-semibold text-sm">{t("magicplan_title")}</h3>
            </div>
            <p className="text-gray-300 text-sm">{t("magicplan_subtitle")}</p>

            {/* QR Code */}
            <div className="flex justify-center">
              <QRCode value={deepLink} />
            </div>

            {/* Deep link button (mobile) */}
            <a
              href={deepLink}
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors text-center"
            >
              {t("magicplan_open")}
            </a>

            <p className="text-gray-500 text-xs">{t("magicplan_hint")}</p>
          </div>
        )}

        <div className="space-y-3">
          <LinkButton
            href="/"
            size="lg"
            className="w-full bg-[#E50000] hover:bg-red-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> {t("back_home")}
          </LinkButton>
          <LinkButton
            href="tel:0939245515"
            external
            variant="outline"
            size="lg"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <Phone className="w-4 h-4 mr-2" /> {t("call_now")}
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/devis/steps/step-success.tsx
git commit -m "feat: add MagicPlan deep link and QR code to success overlay"
```

---

### Task 8: Simplify MagicPlan section in panel-recap

**Files:**
- Modify: `components/devis/panels/panel-recap.tsx`

- [ ] **Step 1: Replace MagicPlanSection wizard with simple info card**

In `components/devis/panels/panel-recap.tsx`, replace the entire `MagicPlanSection` function (lines 32-188) with:

```typescript
function MagicPlanSection() {
  const t = useTranslations("devis.panel_recap");

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Ruler className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm">{t("magicplan_title")}</h4>
          <p className="text-gray-400 text-xs mt-1">{t("magicplan_auto_info")}</p>
        </div>
      </div>
    </div>
  );
}
```

Also remove unused imports that were only used by the wizard: `Download`, `Camera`, `Share2`, and the `WIZARD_ICONS`/`WIZARD_VISUALS` constants. Remove the `useState` import if no longer used elsewhere in the file.

Also remove the magicplan link input field (lines 286-301 in the current file — the `<div className="space-y-1.5">` block with the `Input` for magicplan link).

- [ ] **Step 2: Commit**

```bash
git add components/devis/panels/panel-recap.tsx
git commit -m "refactor: replace MagicPlan wizard with simple info card, remove manual link input"
```

---

### Task 9: Add i18n translation keys

**Files:**
- Modify: `messages/fr.json`
- Modify: `messages/de.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Add MagicPlan confirmation keys to FR**

In `messages/fr.json`, add these keys inside `devis.success`:

```json
"magicplan_title": "Scannez votre logement avec MagicPlan",
"magicplan_subtitle": "Un projet MagicPlan a été créé pour vous. Scannez vos pièces pour nous aider à établir un devis précis.",
"magicplan_open": "Ouvrir MagicPlan",
"magicplan_hint": "Scannez le QR code depuis votre téléphone ou cliquez sur le bouton ci-dessus."
```

Add this key inside `devis.panel_recap`:

```json
"magicplan_auto_info": "Après envoi, vous pourrez scanner votre logement avec MagicPlan pour un devis plus précis."
```

- [ ] **Step 2: Add MagicPlan confirmation keys to DE**

In `messages/de.json`, add inside `devis.success`:

```json
"magicplan_title": "Scannen Sie Ihre Wohnung mit MagicPlan",
"magicplan_subtitle": "Ein MagicPlan-Projekt wurde für Sie erstellt. Scannen Sie Ihre Räume, damit wir Ihnen ein genaues Angebot erstellen können.",
"magicplan_open": "MagicPlan öffnen",
"magicplan_hint": "Scannen Sie den QR-Code mit Ihrem Telefon oder klicken Sie auf die Schaltfläche oben."
```

Add inside `devis.panel_recap`:

```json
"magicplan_auto_info": "Nach dem Absenden können Sie Ihre Wohnung mit MagicPlan scannen, um ein genaueres Angebot zu erhalten."
```

- [ ] **Step 3: Add MagicPlan confirmation keys to EN**

In `messages/en.json`, add inside `devis.success`:

```json
"magicplan_title": "Scan your home with MagicPlan",
"magicplan_subtitle": "A MagicPlan project has been created for you. Scan your rooms to help us provide an accurate quote.",
"magicplan_open": "Open MagicPlan",
"magicplan_hint": "Scan the QR code from your phone or click the button above."
```

Add inside `devis.panel_recap`:

```json
"magicplan_auto_info": "After submitting, you'll be able to scan your home with MagicPlan for a more accurate quote."
```

- [ ] **Step 4: Commit**

```bash
git add messages/fr.json messages/de.json messages/en.json
git commit -m "feat: add MagicPlan confirmation i18n keys (FR/DE/EN)"
```

---

### Task 10: Install QR code library and replace placeholder

**Files:**
- Modify: `components/devis/steps/step-success.tsx`

- [ ] **Step 1: Install qrcode library**

```bash
cd /Users/Aiman/aiman-renovation && npm install qrcode && npm install -D @types/qrcode
```

- [ ] **Step 2: Replace QRCode placeholder with real QR generation**

In `components/devis/steps/step-success.tsx`, replace the `QRCode` component with:

```typescript
import QRCodeLib from "qrcode";

function QRCode({ value, size = 160 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    QRCodeLib.toCanvas(canvas, value, {
      width: size,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });
  }, [value, size]);

  return <canvas ref={canvasRef} width={size} height={size} className="rounded-lg" />;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/devis/steps/step-success.tsx package.json package-lock.json
git commit -m "feat: add real QR code generation for MagicPlan deep link"
```

---

### Task 11: Configure MagicPlan webhook URL

**Files:** None (API call only)

- [ ] **Step 1: Set the webhook URL on MagicPlan workspace**

Run this curl command to configure the webhook URL:

```bash
curl -X PUT "https://cloud.magicplan.app/api/v2/workspace" \
  -H "customer: $(grep MAGICPLAN_CUSTOMER_ID /Users/Aiman/aiman-renovation/.env.local | cut -d= -f2)" \
  -H "key: $(grep MAGICPLAN_API_KEY /Users/Aiman/aiman-renovation/.env.local | cut -d= -f2)" \
  -H "Content-Type: application/json" \
  -d '{"webhook_url": "https://aiman-renovation.fr/api/magicplan/webhook"}'
```

- [ ] **Step 2: Verify the webhook URL was set**

```bash
curl -X GET "https://cloud.magicplan.app/api/v2/workspace" \
  -H "customer: $(grep MAGICPLAN_CUSTOMER_ID /Users/Aiman/aiman-renovation/.env.local | cut -d= -f2)" \
  -H "key: $(grep MAGICPLAN_API_KEY /Users/Aiman/aiman-renovation/.env.local | cut -d= -f2)"
```

Confirm the response includes `"webhook_url": "https://aiman-renovation.fr/api/magicplan/webhook"`.

---

### Task 12: Add env vars to Vercel

**Files:** None (Vercel CLI)

- [ ] **Step 1: Add S3 Scaleway credentials to Vercel**

```bash
cd /Users/Aiman/aiman-renovation
vercel env add SCW_ACCESS_KEY production preview development
vercel env add SCW_SECRET_KEY production preview development
vercel env add SCW_BUCKET production preview development
```

- [ ] **Step 2: Add Jarvis webhook URL (optional)**

```bash
vercel env add JARVIS_WEBHOOK_URL production preview development
```

---

### Task 13: Build verification and deploy

- [ ] **Step 1: Run build to verify no errors**

```bash
cd /Users/Aiman/aiman-renovation && npm run build
```

- [ ] **Step 2: Fix any build errors if needed**

- [ ] **Step 3: Push to deploy**

```bash
git push
```
