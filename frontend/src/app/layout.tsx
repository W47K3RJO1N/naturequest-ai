import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "NatureQuest AI — Touch Grass & Explore Nature",
  description: "An open-source AI-powered outdoor adventure platform. Complete personalized quests, identify plants, keep a nature journal, and level up outdoor habits.",
  keywords: ["Nature", "Touch Grass", "Outdoor exploration", "AI quests", "Gemini", "Nature journal", "Plant identification"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F8FBF5] text-[#18382A] antialiased">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
