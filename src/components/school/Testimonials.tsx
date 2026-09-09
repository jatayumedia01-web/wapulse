import { Quote } from "lucide-react";
import Image from "next/image";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Testimonials</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-navy sm:text-4xl">
            What Our Community Says
          </h2>
          <p className="mt-4 text-base text-gray-text">
            Hear from parents, alumni, and educators who are part of the Bright
            Future family.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="card-hover relative rounded-2xl border border-gray-100 bg-cream/50 p-8"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-gold/20" />
              <p className="relative text-base leading-relaxed text-gray-text italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-gold/30">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-navy">{item.name}</p>
                  <p className="text-xs text-gray-text">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
