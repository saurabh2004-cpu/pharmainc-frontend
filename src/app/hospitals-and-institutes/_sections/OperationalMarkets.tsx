"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const cities = [
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Maharashtra", lat: 19.7515, lng: 75.7139 },
  { name: "Gujarat", lat: 22.2587, lng: 71.1924 },
  { name: "Karnataka", lat: 15.3173, lng: 75.7139 },
];

export default function OperationalMarkets() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [visibleCities, setVisibleCities] = useState<boolean[]>([
    false, false, false, false,
  ]);

  useEffect(() => {
    setMounted(true);
    cities.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCities((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 600 + i * 150);
    });
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current || mapInstanceRef.current) return;

    const loadMap = async () => {
      const L = (await import("leaflet")).default;

      // Fix Leaflet default icon for Next.js
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [17.5, 75.5],
        zoom: 5,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Clean light tile layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            "&copy; OpenStreetMap contributors &copy; CARTO",
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map);

      // Custom marker icon factory
      const createIcon = (label: string) =>
        L.divIcon({
          className: "",
          html: `
            <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 10px rgba(16,185,129,0.45))">
              <div style="
                background:linear-gradient(135deg,#10B981,#06B6D4);
                color:#fff;
                font-family:'DM Sans',sans-serif;
                font-size:11px;font-weight:700;
                padding:5px 11px;border-radius:20px;
                white-space:nowrap;
                border:2px solid rgba(255,255,255,0.65);
                box-shadow:0 2px 10px rgba(255, 255, 255, 0.86);
                letter-spacing:0.04em;
              ">${label}</div>
              <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:10px solid #10B981;margin-top:-1px;"></div>
              <div style="width:7px;height:7px;border-radius:50%;background:#10B981;margin-top:-1px;box-shadow:0 0 0 3px rgba(16,185,129,0.22);"></div>
            </div>`,
          iconAnchor: [40, 50],
          iconSize: [80, 50],
        });

      // Add markers
      cities.forEach((city) => {
        L.marker([city.lat, city.lng], { icon: createIcon(city.name) })
          .addTo(map)
          .bindTooltip(`<b>${city.name}</b>`, {
            direction: "top",
            className: "leaflet-tooltip-custom",
          });
      });

      // Dashed polyline connecting cities
      const latlngs = cities.map((c) => [c.lat, c.lng] as [number, number]);
      L.polyline(latlngs, {
        color: "#10B981",
        weight: 1.5,
        dashArray: "6 6",
        opacity: 0.45,
      }).addTo(map);
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mounted]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Poppins:wght@400;600&family=Sora:wght@700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .leaflet-tooltip-custom {
          background: #111827 !important;
          color: #fff !important;
          border: none !important;
          border-radius: 8px !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          padding: 4px 10px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.18) !important;
        }
        .leaflet-tooltip-custom::before {
          border-top-color: #111827 !important;
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        @keyframes pulseRing {
          0%  { transform:scale(1); opacity:0.7; }
          70% { transform:scale(2.4); opacity:0; }
          100%{ transform:scale(1); opacity:0; }
        }
        .pulse-ring { animation: pulseRing 2s infinite; }
      `}</style>

      <section
        className="w-full bg-white flex items-start justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-14 lg:py-0 lg:px-16 xl:pb-20 lg:max-h-screen"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="w-full max-w-6xl grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-24 lg:ml-4 items-start lg:items-center">

          {/* ── LEFT: REAL MAP ── */}
          <div
            className="relative w-full rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden order-2 xl:order-1"
            style={{ aspectRatio: "4/3", minHeight: "320px" }}
          >
            {/* Leaflet map */}
            <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

            {/* Inner glow border overlay */}
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none z-10 shadow-[inset_0_0_0_2px_rgba(16,185,129,0.25)]" />
          </div>

          {/* ── RIGHT: CONTENT ── */}
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 h-full items-start order-1 xl:order-2 w-full">
            {/* Accent bar */}
            {/* Heading */}
            <h2 className="text-gray-900 m-0 font-['Poppins'] font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-[42.92px] leading-[1.4] tracking-[0%]">
              Operational in{" "}
              <span className="bg-gradient-to-r from-[#08D5CE] to-[#8DEFA4] bg-clip-text text-transparent inline-block">
                Key
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#08D5CE] to-[#8DEFA4] bg-clip-text text-transparent inline-block">
                Healthcare
              </span>{" "}
              <span className="bg-gradient-to-r from-[#08D5CE] to-[#8DEFA4] bg-clip-text text-transparent inline-block">
                Markets
              </span>
            </h2>

            {/* Description */}
            <p className="text-black m-0 font-['Poppins'] font-normal text-base sm:text-lg md:text-xl lg:text-[20px] leading-relaxed md:leading-[1.78rem] tracking-[0%]">
              Supporting hospitals with verified healthcare staffing in active
              cities, expanding rapidly.
            </p>

            {/* City badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-x-16 w-full">
              {cities.map((city, i) => (
                <div
                  key={city.name}
                  className={`flex items-center gap-3 py-2 sm:py-2.5 opacity-0 ${visibleCities[i] ? "fade-up" : ""
                    }`}
                >
                  <div
                    className="w-8 sm:w-9 h-8 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-0"
                    style={{
                      background: "linear-gradient(90deg, #08D5CE 0%, #8DEFA4 100%)",
                    }}
                  >
                    <Image src="/hospitals-and-institutes/map-icon.png" alt="map icon" width={16} height={16} className="object-contain" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm sm:text-base">
                    {city.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
