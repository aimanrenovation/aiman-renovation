interface JsonLdProps {
  data: Record<string, unknown>;
}

// All JSON-LD data is static/internal — no user input, XSS-safe
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
