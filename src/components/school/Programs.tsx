import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { programs } from "@/lib/data";

export default function Programs({ preview = false }: { preview?: boolean }) {
  const items = preview ? programs.slice(0, 3) : programs;

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Academic Programs</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-navy sm:text-4xl">
            Discover Our Programs
          </h2>
          <p className="mt-4 text-base text-gray-text">
            From early childhood through high school, comprehensive programs designed
            to inspire lifelong learning.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((program) => (
            <Link
              key={program.slug}
              href={`/academics/${program.slug}`}
              className="card-hover group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-dark">
                  {program.grades}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg font-bold text-navy group-hover:text-gold">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-text">
                  {program.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {preview && (
          <div className="mt-12 text-center">
            <Link
              href="/academics"
              className="btn-navy inline-flex items-center gap-2 rounded px-8 py-3.5 text-sm"
            >
              VIEW ALL PROGRAMS
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
