import Image from "next/image";
import { TestimonialCarousel } from "./TestimonialCarousel";

export function SidePanel() {
  return (
    <div className="hidden lg:flex h-full bg-[linear-gradient(135deg,#233F64_0%,#169BA4_33%,#4ADAAF_66%,#0AD4CE_100%)] flex-col justify-between p-12 relative overflow-hidden">
      <TestimonialCarousel />

      <div className="relative z-10 flex justify-center items-end translate-y-24">
        <div className="relative w-full">
          <Image
            src="/auth/intro.webp"
            alt="PharmInc Platform Preview"
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
