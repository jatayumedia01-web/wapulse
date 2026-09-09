import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  label?: string;
  image?: string;
  breadcrumbs: { label: string; href?: string }[];
};

export default function PageHero({
  title,
  subtitle,
  label,
  image = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&h=500&fit=crop",
  breadcrumbs,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-dark">
      <Image src={image} alt="" fill priority className="object-cover opacity-30" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy/90 to-navy/70" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />
        {label && <p className="section-label mt-6">{label}</p>}
        <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
