import type { Metadata } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/ui/footer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Qamil Mirza",
  description: "Developed by Qamil Mirza",
  verification: {
    google: "6JnU6PmG619-vmgNef2xvtkbYnZ_b8jksYJ0H3k0kU8",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-backgroundColor`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
