import type { Metadata } from "next";
import NewsEvents from "@/components/school/NewsEvents";
import PageHero from "@/components/school/PageHero";

export const metadata: Metadata = {
  title: "News & Events | Bright Future International School",
  description: "Latest news, events, and achievements from Bright Future International School.",
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        label="News & Events"
        title="Latest from Our School"
        subtitle="Stay updated with campus news, upcoming events, student achievements, and community highlights."
        image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&h=500&fit=crop"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News & Events" }]}
      />
      <NewsEvents />
    </>
  );
}
