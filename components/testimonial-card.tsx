import type { Testimonial } from "@/lib/testimonials";

interface Props {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: Props) {
  const stars = "★".repeat(testimonial.rating) + "☆".repeat(5 - testimonial.rating);
  const date = new Date(testimonial.date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });

  const countryFlag: Record<string, string> = {
    FR: "🇫🇷",
    CH: "🇨🇭",
    DE: "🇩🇪",
  };

  return (
    <article className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-yellow-500 text-lg tracking-tight" aria-label={`${testimonial.rating} étoiles sur 5`}>
          {stars}
        </div>
        {testimonial.verified && (
          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
            Vérifié
          </span>
        )}
      </div>

      <p className="text-zinc-700 leading-relaxed text-sm flex-1">
        &ldquo;{testimonial.commentFR}&rdquo;
      </p>

      <div className="border-t border-zinc-100 pt-3 mt-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-zinc-900 text-sm">{testimonial.author}</p>
            <p className="text-xs text-zinc-500">
              {countryFlag[testimonial.country]} {testimonial.location} — {date}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
