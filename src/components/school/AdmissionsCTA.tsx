import Image from "next/image";

export default function AdmissionsCTA() {
  return (
    <section id="admissions" className="relative overflow-hidden bg-cream py-16 sm:py-24">
      <div className="absolute inset-0 opacity-5">
        <Image
          src="https://images.unsplash.com/photo-1427504494784-3a9ca7044f45?w=1920&h=600&fit=crop"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="relative aspect-square overflow-hidden rounded-full shadow-2xl ring-8 ring-white">
              <Image
                src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=600&fit=crop"
                alt="Students studying together"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 80vw, 40vw"
              />
            </div>
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gold/20 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-navy/10 blur-2xl" />
          </div>

          <div>
            <p className="section-label">Admissions Open 2026–27</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-[2.75rem]">
              Begin Your Journey Toward a Bright Future
            </h2>
            <p className="mt-5 text-base leading-relaxed text-gray-text">
              Join a community of learners where excellence is nurtured, dreams
              are supported, and every student is empowered to reach their full
              potential. Applications for the 2026–27 academic year are now
              open.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="btn-gold rounded px-8 py-3.5 text-sm"
              >
                APPLY NOW
              </a>
              <a
                href="#contact"
                className="inline-flex items-center rounded border-2 border-navy px-8 py-3.5 text-sm font-semibold text-navy transition-all hover:bg-navy hover:text-white"
              >
                SCHEDULE A TOUR
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 border-t border-gray-200 pt-8">
              <div>
                <p className="font-serif text-2xl font-bold text-navy">Feb 15</p>
                <p className="text-xs text-gray-text">Application Deadline</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-navy">Mar 1</p>
                <p className="text-xs text-gray-text">Entrance Assessment</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-navy">Apr 10</p>
                <p className="text-xs text-gray-text">Session Begins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
