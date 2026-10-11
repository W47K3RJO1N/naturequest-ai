import Link from "next/link";
import { Leaf, Heart, Shield, Compass, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#D6E8D1] bg-[#FFFFFF] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#245C43] text-white flex items-center justify-center">
                <Leaf className="w-4 h-4 text-[#A8D5A2]" />
              </div>
              <span className="text-lg font-bold text-[#18382A]">NatureQuest AI</span>
            </div>
            <p className="text-sm text-[#6F8174] max-w-md leading-relaxed">
              An open-source wellness platform encouraging everyone to touch grass, observe biodiversity, and form lasting outdoor habits through mindful, AI-curated outdoor missions.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#6F8174]">
              <Shield className="w-4 h-4 text-[#245C43]" />
              <span>Leave No Trace principles & mindful exploration</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-[#18382A] uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-[#6F8174]">
              <li>
                <Link href="/dashboard" className="hover:text-[#245C43] transition-colors">Personal Dashboard</Link>
              </li>
              <li>
                <Link href="/quests" className="hover:text-[#245C43] transition-colors">AI Quest Generator</Link>
              </li>
              <li>
                <Link href="/explorer" className="hover:text-[#245C43] transition-colors">Nature Explorer</Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-[#245C43] transition-colors">Nature Journal</Link>
              </li>
            </ul>
          </div>

          {/* Ethics & Safety */}
          <div>
            <h4 className="text-sm font-semibold text-[#18382A] uppercase tracking-wider mb-3">Safety & Ethics</h4>
            <p className="text-xs text-[#6F8174] leading-relaxed mb-3">
              NatureQuest AI never encourages foraging toxic plants or trespassing on private land. Always explore safely with awareness of your environment.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5E9] text-[#245C43] text-xs font-medium">
              <Heart className="w-3.5 h-3.5 fill-[#245C43]" /> Touch Grass Theme
            </div>
          </div>
        </div>

        <div className="border-t border-[#D6E8D1]/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6F8174] gap-4">
          <p>© 2026 NatureQuest AI. Open-source nature exploration web app.</p>
          <p className="flex items-center gap-1">
            Built for Hacktoberfest & outdoor wellness adventures.
          </p>
        </div>
      </div>
    </footer>
  );
}
