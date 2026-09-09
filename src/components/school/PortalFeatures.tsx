import { BookOpen, Calendar, CreditCard, FileText, GraduationCap, Library, Mail, Users } from "lucide-react";
import type { ComponentType } from "react";
import type { PortalFeature } from "@/lib/types";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  grades: GraduationCap,
  attendance: Users,
  fees: CreditCard,
  messages: Mail,
  assignments: FileText,
  timetable: Calendar,
  library: Library,
  events: BookOpen,
};

export default function PortalFeatures({ features }: { features: PortalFeature[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {features.map((feature) => {
        const Icon = iconMap[feature.icon] ?? BookOpen;
        return (
          <div key={feature.title} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
              <Icon className="h-5 w-5 text-gold" />
            </div>
            <h3 className="mt-3 font-semibold text-navy">{feature.title}</h3>
            <p className="mt-1 text-sm text-gray-text">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}
