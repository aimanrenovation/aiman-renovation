import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { Card, CardContent } from "@/components/ui/card";

export function ServicesPreview() {
  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl">NOS <span className="text-[#E50000]">SERVICES</span></h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            De la cuisine à la toiture, nous couvrons tous les métiers de la rénovation.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SERVICES.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`}>
              <Card className="bg-[#111111] border-white/10 hover:border-[#E50000]/50 transition-all duration-300 h-full group">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="font-semibold text-white group-hover:text-[#E50000] transition-colors text-sm">{service.shortTitle}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
