import Header
  from "../components/Header/Header";

import Hero
  from "../components/Hero/Hero";

import Pricing
  from "../components/Pricing/Pricing";

import Programs
  from "../components/Programs/Programs";

import Trainers
  from "../components/Trainers/Trainers";

import About
  from "../components/About/About";

import Transformations
  from "../components/Transformations/Transformations";

import Gallery
  from "../components/Gallery/Gallery";

import Testimonials
  from "../components/Testimonials/Testimonials";

import FAQ
  from "../components/FAQ/FAQ";

import BenchPressGame
  from "../components/BenchPressGame/BenchPressGame";

import Contact
  from "../components/Contact/Contact";

import Footer
  from "../components/Footer/Footer";

import DetailReader
  from "../components/DetailReader/DetailReader";

import {
  DetailReaderProvider,
} from "../components/DetailReader/DetailReaderContext";


function Home() {
  return (
    <DetailReaderProvider>
      <main>
        <div className="home-hero-shell">
          <Header />
          <Hero />
        </div>

        <Pricing />

        <Programs />

        <Trainers />

        <About />

        <Transformations />

        <Gallery />

        <Testimonials />

        <FAQ />

        <BenchPressGame />

        <Contact />

        <Footer />
      </main>


      <DetailReader />
    </DetailReaderProvider>
  );
}


export default Home;