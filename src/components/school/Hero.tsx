import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop"
        alt="Students at Bright Future International School"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy/75 to-navy/40" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl animate-fade-up">
          <p className="section-label mb-4">Welcome to Excellence</p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Inspiring Minds. <span className="text-gold">Shaping Futures.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
            Where every child discovers their potential through world-class
            education, character building, and a nurturing community.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/about"
              className="btn-navy inline-flex items-center gap-2 rounded px-6 py-3.5 text-sm"
            >
              DISCOVER OUR SCHOOL
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/campus-life"
              className="btn-outline inline-flex items-center gap-2 rounded px-6 py-3.5 text-sm"
            >
              <Play className="h-4 w-4 fill-white" />
              EXPLORE CAMPUS
            </Link>
          </div>
        </div>

        <div className="animate-float absolute right-4 top-1/2 hidden -translate-y-1/2 lg:block xl:right-12">
          <div className="relative">
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 border-gold bg-navy/80 text-center shadow-2xl backdrop-blur-sm xl:h-44 xl:w-44">
              <p className="font-serif text-2xl font-bold text-gold xl:text-3xl">1998</p>
              <p className="mt-1 px-3 text-[10px] font-semibold uppercase leading-tight tracking-wider text-white xl:text-xs">
                A Legacy of
                <br />
                Excellence
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
