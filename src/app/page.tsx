import AepSection from "@/components/AepSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MethodSection from "@/components/MethodSection";
import MiraiCase from "@/components/MiraiCase";

export default function Home() {
  return (
    <div className="site">
      <Header />
      <main>
        <Hero />
        <MiraiCase />
        <AepSection />
        <MethodSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
