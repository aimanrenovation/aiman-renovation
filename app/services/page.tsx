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
          <h1 className="font-heading text-5xl md:text-6xl">NOS <span className="text-[#E50000]">SERVICES</span></h1>
          <p className="mt-4 text-gray-400 text-lg max-w-3xl mx-auto">
            Du sol au plafond, de l&apos;intérieur à l&apos;extérieur — nous maîtrisons tous les corps de métier.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`}>
              <Card className="bg-[#111111] border-white/10 hover:border-[#E50000]/50 transition-all duration-300 h-full group">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{service.icon}</div>
                    <div className="flex-1">
                      <h2 className="font-heading text-xl text-white group-hover:text-[#E50000] transition-colors">{service.title}</h2>
                      <p className="mt-2 text-gray-400 text-sm leading-relaxed">{service.description}</p>
                      <ul className="mt-4 grid grid-cols-2 gap-1">
                        {service.features.map((f) => (
                          <li key={f} className="text-xs text-gray-500">→ {f}</li>
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
