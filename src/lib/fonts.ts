import localFont from "next/font/local";

export const twitterChirp = localFont({
  src: [
    {
      path: "../fonts/Chirp-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Chirp-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Chirp-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Chirp-Heavy.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-chirp",
  display: "swap",
});
