import "./globals.css";
import type { Metadata } from "next";
import { Inter, Pacifico } from "next/font/google";
import Header from "@/components/Header/Header";
import { SupabaseProvider } from "@/lib/supabase/context";
import DollarSignBackground from "@/components/DollarSignBackground";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

export const metadata: Metadata = {
  title: "PiggyPal",
  description: "Your personal financial advisor",
  icons: {
    icon: "/piggypal.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${pacifico.variable}`}>
        <SupabaseProvider>
          <DollarSignBackground />
          <Header />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
