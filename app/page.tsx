import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import About from "@/components/home/About";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <FeaturedProjects />
        <About />
      </main>
      <Footer />
    </>
  );
}
