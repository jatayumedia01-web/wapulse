import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/school/PageHero";
import ScrollReveal from "@/components/school/ScrollReveal";
import { getNewsBySlug, newsEvents } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return newsEvents.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return { title: `${article.title} | Bright Future International School`, description: article.excerpt };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) notFound();

  const related = newsEvents.filter((n) => n.slug !== slug).slice(0, 2);

  return (
    <>
      <PageHero
        label={article.category}
        title={article.title}
        subtitle={article.excerpt}
        image={article.image}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: article.title },
        ]}
      />

      <article className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-text">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-gold" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gold" />
                {article.readTime}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl shadow-lg">
              <Image src={article.image} alt={article.title} fill className="object-cover" sizes="768px" priority />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="prose prose-navy mt-10 max-w-none">
              {article.content.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mb-5 text-base leading-relaxed text-gray-text">
                  {paragraph}
                </p>
              ))}
            </div>
          </ScrollReveal>

          {related.length > 0 && (
            <ScrollReveal delay={300}>
              <div className="mt-16 border-t border-gray-100 pt-10">
                <h3 className="font-serif text-xl font-bold text-navy">Related Articles</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/news/${item.slug}`}
                      className="card-hover rounded-xl border border-gray-100 p-4"
                    >
                      <p className="text-xs text-gold">{item.category}</p>
                      <p className="mt-1 font-semibold text-navy">{item.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          <Link
            href="/news"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All News
          </Link>
        </div>
      </article>
    </>
  );
}
