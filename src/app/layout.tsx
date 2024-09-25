import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Showtime Africa",
  description: "Discover and attend the best events happening across Africa, from electrifying music festivals to exclusive private parties and spectacular shows. Showtime Africa is your gateway to the continent's most exciting gatherings."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
        <Toaster />
      </body>
    </html>
  );
}
