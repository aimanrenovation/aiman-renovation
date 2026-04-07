import Link from "next/link";
import { JsonLd } from "./seo/json-ld";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://aiman-renovation.fr${item.url}`,
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <nav
        aria-label="Fil d'Ariane"
        className="relative z-20 bg-black border-b border-white/5 px-6 py-3"
      >
        <ol className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          {items.map((item, idx) => (
            <li key={item.url} className="flex items-center gap-2">
              {idx > 0 && (
                <span aria-hidden="true" className="text-gray-700">
                  /
                </span>
              )}
              {idx < items.length - 1 ? (
                <Link
                  href={item.url}
                  className="hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-white font-medium">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
