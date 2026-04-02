import { COMPANY } from "@/lib/constants";

const stats = [
  { value: `+${COMPANY.projects}`, label: "projets réalisés" },
  { value: `${COMPANY.experience} ans`, label: "d'expérience" },
  { value: COMPANY.city, label: "et environs (68)" },
];

export function TrustBar() {
  return (
    <section className="bg-[#111111] border-y border-white/10 py-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="font-heading text-3xl md:text-4xl text-[#E50000]">{stat.value}</div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
