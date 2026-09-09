import { ArrowRight } from "lucide-react";
import Link from "next/link";

type CTABannerProps = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function CTABanner({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTABannerProps) {
  return (
    <section className="bg-navy py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        <p className="mt-3 text-base text-white/70">{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={primaryHref} className="btn-gold inline-flex items-center gap-2 rounded px-8 py-3.5 text-sm">
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center rounded border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
