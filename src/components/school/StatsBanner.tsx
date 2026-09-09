import { Award, BarChart3, GraduationCap, Trophy, Users } from "lucide-react";
import { stats } from "@/lib/data";

const iconMap = {
  award: Award,
  users: Users,
  graduation: GraduationCap,
  trophy: Trophy,
  chart: BarChart3,
};

export default function StatsBanner() {
  return (
    <section className="bg-navy py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <p className="font-serif text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/60 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
