import { AnimatedBackground } from "@/components/Index/Hero/AnimatedBackground";
import { DoctorProfile } from "@/components/Index/Hero/DoctorProfile";
import { TextContent } from "@/components/Index/Hero/TextContent";
import { TrustedBy } from "@/components/Index/Hero/TrustedBy";

import { ProfilePreview } from "@/components/Index/ProfilePreview";

import { AppFeedDemo } from "@/components/Index/AppFeedDemo";

import { GlobalMap } from "@/components/Index/GlobalMap";

import { Testimonials } from "@/components/Index/Testimonials";

import { TimelineJourney } from "@/components/Index/TimelineJourney";

import { CtaSection } from "@/components/Index/CtaSection";

import { Navbar } from "@/components/Index/Navbar";
import { Footer } from "@/components/Index/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* hero section */}
      <section className="relative pt-24 pb-16 hero-gradient overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <TextContent />
            <DoctorProfile />
          </div>
        </div>
        <TrustedBy />
      </section>

      {/* profile preview */}
      <ProfilePreview />

      {/* app feed demo */}
      <AppFeedDemo />

      {/* global map */}
      <GlobalMap />

      {/* testimonials */}
      <Testimonials />

      {/* timeline journey */}
      <TimelineJourney />

      {/* cta  */}
      <CtaSection />

      {/* footer */}
      <Footer />
    </main>
  );
}
