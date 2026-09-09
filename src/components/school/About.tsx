import { ArrowRight, Award, Globe2, Users2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { aboutCards, aboutStats } from "@/lib/data";

const cardIcons = [Users2, Award, Globe2];

export default function About() {
  return (
    <section className="bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="section-label">About Our School</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-navy sm:text-4xl">
              Excellence in Education, Character for Life
            </h2>
            <p className="mt-5 text-base leading-relaxed text-gray-text">
              For over two decades, Bright Future International School has been
              a beacon of academic excellence and holistic development. We
              nurture curious minds, build strong character, and prepare students
              to thrive in an ever-changing world.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-text">
              Our internationally recognized curriculum, combined with
              state-of-the-art facilities and a passionate faculty, creates an
              environment where every student can flourish.
            </p>
            <Link
              href="/about"
              className="btn-navy mt-8 inline-flex items-center gap-2 rounded px-6 py-3 text-sm"
            >
              LEARN MORE ABOUT US
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-10 flex flex-wrap gap-8">
              {aboutStats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-3xl font-bold text-navy">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-gray-text">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=1000&fit=crop"
                alt="Bright Future International School campus building"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-2xl border-4 border-gold bg-navy/10 backdrop-blur-sm lg:-left-8" />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-3">
            {aboutCards.map((card, i) => {
              const Icon = cardIcons[i];
              return (
                <div
                  key={card.subtitle}
                  className="card-hover flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy/5">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-serif text-2xl font-bold text-navy">
                      {card.title}
                    </p>
                    <p className="text-sm text-gray-text">{card.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
