import { Inter, Pacifico } from "next/font/google";

// Normal font
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Fancy cursive font
export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});
