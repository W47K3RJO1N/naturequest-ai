"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  MapPin, 
  BookOpen, 
  User, 
  Sparkles, 
  Menu, 
  X,
  Leaf
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Compass },
    { href: "/quests", label: "AI Quests", icon: Sparkles },
    { href: "/explorer", label: "Nature Explorer", icon: MapPin },
    { href: "/journal", label: "Nature Journal", icon: BookOpen },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full nature-glass border-b border-[#D6E8D1]/60 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#245C43] text-white flex items-center justify-center shadow-md group-hover:bg-[#19402e] transition-colors">
            <Leaf className="w-5 h-5 text-[#A8D5A2]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#18382A] flex items-center gap-1">
              NatureQuest <span className="text-xs px-1.5 py-0.5 rounded-md bg-[#EAF5E9] text-[#245C43] font-semibold">AI</span>
            </span>
            <p className="text-[10px] text-[#6F8174] font-medium leading-none">Touch Grass Daily</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#245C43] text-white shadow-xs"
                    : "text-[#18382A] hover:bg-[#EAF5E9] hover:text-[#245C43]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#A8D5A2]" : "text-[#6F8174]"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/quests"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#245C43] hover:bg-[#19402e] text-white text-sm font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-[#E7C76A]" />
            New Quest
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-[#18382A] hover:bg-[#EAF5E9] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-[#D6E8D1] bg-[#F8FBF5]/95 backdrop-blur-md px-4 pt-2 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-[#245C43] text-white"
                    : "text-[#18382A] hover:bg-[#EAF5E9]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/quests"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#245C43] text-white font-semibold shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#E7C76A]" />
              Start Quest
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
