import localFont from "next/font/local";
import { Figtree, Poppins, Nunito } from "next/font/google";


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
  variable: "--chirp-font",
  display: "swap",
});

export const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--figtree-font",
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--poppins-font",
  display: "swap",
});

export const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--nunito-font",
  display: "swap",
});
