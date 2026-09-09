import {
  BookOpen,
  Globe,
  Lightbulb,
  Shield,
  Users,
} from "lucide-react";
import { features } from "@/lib/data";

const iconMap = {
  book: BookOpen,
  users: Users,
  lightbulb: Lightbulb,
  globe: Globe,
  shield: Shield,
};

export default function FeaturesBar() {
  return (
    <section className="relative z-10 -mt-1 bg-navy py-8 shadow-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div
                key={feature.title}
                className="flex items-center gap-4 lg:flex-col lg:text-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
