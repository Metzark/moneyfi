import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import { SupabaseProvider } from "@/lib/supabase/context";
import DollarSignBackground from "@/components/Background/DollarSignBackground";
import { inter, pacifico } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "MoneyFi",
  description: "Your personal financial advisor",
  icons: {
    icon: "/moneyfi.svg",
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
