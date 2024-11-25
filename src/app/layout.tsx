import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Atrium Tracker",
  description: "Les stats de tes longues heures à l'atrium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./favicon.ico" />
      </head>
      <body>
        <div style={{ paddingBottom: "10%" }}>
          {children}
        </div>
        <Navbar />
      </body>
    </html>
  );
}
