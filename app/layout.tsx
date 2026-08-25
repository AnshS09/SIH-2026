import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drone3D | PS 26158",
  description: "PS 26158: single-pass drone video to accurate, georeferenced 3D reconstruction with semantic geometry and confidence heatmaps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@500;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0b1326] text-[#dae2fd]">
        {children}
      </body>
    </html>
  );
}
