import type { Metadata } from "next";
import RocketHero from "@/components/hero/RocketHero";

export const metadata: Metadata = {
  title: "WAPulse — Launch WhatsApp at planetary scale",
  description:
    "Cinematic 3D command deck for WhatsApp Business: team inbox, broadcast campaigns, automation, and developer APIs.",
};

export default function HomePage() {
  return <RocketHero />;
}
