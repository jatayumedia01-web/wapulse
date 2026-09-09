import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/school/PageHero";
import ScrollReveal from "@/components/school/ScrollReveal";
import SectionHeading from "@/components/school/SectionHeading";
import { getProgramBySlug, programs } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) return { title: "Program Not Found" };
  return {
    title: `${program.title} | Bright Future International School`,
    description: program.overview,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  return (
    <>
      <PageHero
        label={program.grades}
        title={program.title}
        subtitle={program.overview}
        image={program.heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academics", href: "/academics" },
          { label: program.title },
        ]}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ScrollReveal>
                <SectionHeading label="Overview" title={`About ${program.title}`} />
                <p className="mt-4 text-base leading-relaxed text-gray-text">{program.overview}</p>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <h3 className="mt-10 font-serif text-xl font-bold text-navy">Program Highlights</h3>
                <ul className="mt-4 space-y-3">
                  {program.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-text">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <h3 className="mt-10 font-serif text-xl font-bold text-navy">Curriculum Areas</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {program.curriculum.map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-gray-100 bg-cream/50 px-4 py-3 text-sm font-medium text-navy"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <div className="space-y-6">
              <ScrollReveal delay={150}>
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <div className="relative aspect-[4/3]">
                    <Image src={program.image} alt={program.title} fill className="object-cover" sizes="33vw" />
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={250}>
                <div className="rounded-2xl bg-navy p-6 text-white">
                  <h3 className="font-serif text-lg font-bold">Learning Outcomes</h3>
                  <ul className="mt-4 space-y-2">
                    {program.outcomes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-white/80">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/admissions"
                    className="btn-gold mt-6 block rounded py-3 text-center text-sm"
                  >
                    APPLY FOR THIS PROGRAM
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-cream py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/academics"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Programs
          </Link>
        </div>
      </section>
    </>
  );
}
