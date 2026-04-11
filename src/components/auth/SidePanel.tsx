import Image from "next/image";
import { TestimonialCarousel } from "./TestimonialCarousel";

export function SidePanel() {
  return (
    <div className="hidden lg:flex h-full animated-gradient flex-col justify-between p-12 relative overflow-hidden">
      <style>{`
        .animated-gradient {
          background: linear-gradient(135deg, #233F64, #169BA4, #4ADAAF, #0AD4CE);
          background-size: 400% 400%;
          animation: ocean-wave 12s ease infinite;
        }

        @keyframes ocean-wave {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
      `}</style>
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
