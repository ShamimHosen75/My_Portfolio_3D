import { Loader } from "@/components/sections/Loader";
import { Header } from "@/components/sections/Header";
import { Landing } from "@/components/sections/Landing";
import { About } from "@/components/sections/About";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { Career } from "@/components/sections/Career";
import { Work } from "@/components/sections/Work";
import { TechStack } from "@/components/sections/TechStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { GetInTouch } from "@/components/sections/GetInTouch";
import { Contact } from "@/components/sections/Contact";
import { CharacterStage } from "@/components/scene/CharacterStage";
import { Cursor } from "@/components/ui/Cursor";
import { IntroGate } from "@/components/providers/IntroGate";

export default function Home() {
  return (
    <>
      <Loader />
      {/* Purple glow on the right edge, as in the reference */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 right-0 z-0 h-[55vh] w-[18vw] translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/45 blur-[90px]"
      />
      <IntroGate>
        <Header />
        <main id="main" tabIndex={-1} className="relative z-[1] outline-none">
          <CharacterStage>
            <Landing />
            <About />
            <WhatIDo />
          </CharacterStage>
          <Career />
          <Work />
          <TechStack />
          <Testimonials />
          <GetInTouch />
        </main>
        <Contact />
      </IntroGate>
      <Cursor />
    </>
  );
}
