import About from "@/components/school/About";
import AdmissionsCTA from "@/components/school/AdmissionsCTA";
import CampusLife from "@/components/school/CampusLife";
import FeaturesBar from "@/components/school/FeaturesBar";
import Hero from "@/components/school/Hero";
import NewsEvents from "@/components/school/NewsEvents";
import Programs from "@/components/school/Programs";
import QuickLinks from "@/components/school/QuickLinks";
import StatsBanner from "@/components/school/StatsBanner";
import Testimonials from "@/components/school/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesBar />
      <QuickLinks />
      <About />
      <Programs preview />
      <StatsBanner />
      <CampusLife />
      <Testimonials />
      <NewsEvents preview />
      <AdmissionsCTA />
    </>
  );
}
