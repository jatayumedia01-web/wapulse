import About from "@/components/school/About";
import AdmissionsCTA from "@/components/school/AdmissionsCTA";
import CampusLife from "@/components/school/CampusLife";
import FeaturesBar from "@/components/school/FeaturesBar";
import Footer from "@/components/school/Footer";
import Header from "@/components/school/Header";
import Hero from "@/components/school/Hero";
import NewsEvents from "@/components/school/NewsEvents";
import Programs from "@/components/school/Programs";
import StatsBanner from "@/components/school/StatsBanner";
import Testimonials from "@/components/school/Testimonials";
import TopBar from "@/components/school/TopBar";

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Hero />
        <FeaturesBar />
        <About />
        <Programs />
        <StatsBanner />
        <CampusLife />
        <Testimonials />
        <NewsEvents />
        <AdmissionsCTA />
      </main>
      <Footer />
    </>
  );
}
