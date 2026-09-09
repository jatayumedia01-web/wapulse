import { ChevronRight } from "lucide-react";
import Link from "next/link";

type BreadcrumbItem = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/40" />}
          {item.href ? (
            <Link href={item.href} className="text-white/60 transition-colors hover:text-gold">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-gold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
