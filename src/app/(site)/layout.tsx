import Footer from "@/components/school/Footer";
import Header from "@/components/school/Header";
import TopBar from "@/components/school/TopBar";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <TopBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
