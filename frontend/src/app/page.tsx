"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  MapPin, 
  BookOpen, 
  Trophy, 
  Compass, 
  ArrowRight, 
  Footprints, 
  ShieldCheck, 
  Sun, 
  Clock, 
  Leaf 
} from "lucide-react";

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="space-y-24 py-6 md:py-12">
      {/* Hero Section */}
      <motion.section 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
        className="text-center max-w-4xl mx-auto space-y-6 pt-4"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5E9] border border-[#D6E8D1] text-[#245C43] text-sm font-medium shadow-xs">
          <Sparkles className="w-4 h-4 text-[#245C43]" />
          <span>The "Touch Grass" AI Adventure Platform</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants} 
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#18382A] leading-[1.1]"
        >
          Your Next Adventure <br className="hidden sm:inline" />
          <span className="text-[#245C43] underline decoration-[#A8D5A2] decoration-wavy decoration-2">
            Starts Outside.
          </span>
        </motion.h1>

        <motion.p 
          variants={itemVariants} 
          className="text-lg sm:text-xl text-[#6F8174] max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Turn screen time into nature time. NatureQuest AI creates personalized, mindful outdoor challenges, identifies local plants and flora, and rewards your daily connection with the living world.
        </motion.p>

        <motion.div 
          variants={itemVariants} 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/quests"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#245C43] hover:bg-[#19402e] text-white font-semibold text-base shadow-lg shadow-[#245C43]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Compass className="w-5 h-5 text-[#A8D5A2]" />
            Start Your Quest
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-[#EAF5E9] text-[#245C43] font-semibold text-base border border-[#D6E8D1] shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            Explore Dashboard
          </Link>
        </motion.div>

        {/* Quick stat highlights */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto"
        >
          <div className="p-4 rounded-2xl bg-white border border-[#D6E8D1]/80 shadow-xs text-center">
            <span className="block text-2xl font-bold text-[#245C43]">5–60 min</span>
            <span className="text-xs text-[#6F8174]">Flexible Quests</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#D6E8D1]/80 shadow-xs text-center">
            <span className="block text-2xl font-bold text-[#245C43]">100%</span>
            <span className="text-xs text-[#6F8174]">Leave No Trace</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#D6E8D1]/80 shadow-xs text-center">
            <span className="block text-2xl font-bold text-[#245C43]">AI Vision</span>
            <span className="text-xs text-[#6F8174]">Flora Discovery</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#D6E8D1]/80 shadow-xs text-center">
            <span className="block text-2xl font-bold text-[#245C43]">XP & Streaks</span>
            <span className="text-xs text-[#6F8174]">Outdoor Habits</span>
          </div>
        </motion.div>
      </motion.section>

      {/* Feature Grid */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-[#18382A]">
            Discover What Awaits Beyond Your Screen
          </h2>
          <p className="text-[#6F8174]">
            Four core outdoor exploration tools designed to build lifelong nature mindfulness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-[#D6E8D1] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EAF5E9] text-[#245C43] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-[#245C43]" />
              </div>
              <h3 className="text-xl font-bold text-[#18382A]">AI Quest Generator</h3>
              <p className="text-sm text-[#6F8174] leading-relaxed">
                Generate micro-adventures tailored to your available time (5-60 min), location, and activity preferences using Google Gemini.
              </p>
            </div>
            <Link href="/quests" className="pt-6 inline-flex items-center text-sm font-semibold text-[#245C43] hover:underline">
              Generate Quest <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-[#D6E8D1] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EAF5E9] text-[#245C43] flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-[#245C43]" />
              </div>
              <h3 className="text-xl font-bold text-[#18382A]">Nature Explorer</h3>
              <p className="text-sm text-[#6F8174] leading-relaxed">
                Snap photos of flowers, trees, moss, or wildlife. Get immediate visual identification insights, scientific names, and ecological facts.
              </p>
            </div>
            <Link href="/explorer" className="pt-6 inline-flex items-center text-sm font-semibold text-[#245C43] hover:underline">
              Identify Flora <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-[#D6E8D1] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EAF5E9] text-[#245C43] flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-[#245C43]" />
              </div>
              <h3 className="text-xl font-bold text-[#18382A]">Field Journal</h3>
              <p className="text-sm text-[#6F8174] leading-relaxed">
                Log your personal outdoor discoveries, personal reflections, sensory observations, and build your digital naturalist herbarium.
              </p>
            </div>
            <Link href="/journal" className="pt-6 inline-flex items-center text-sm font-semibold text-[#245C43] hover:underline">
              View Journal <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white border border-[#D6E8D1] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EAF5E9] text-[#245C43] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-[#245C43]" />
              </div>
              <h3 className="text-xl font-bold text-[#18382A]">Levels & Badges</h3>
              <p className="text-sm text-[#6F8174] leading-relaxed">
                Earn XP for outdoor minutes logged and quests completed. Unlock achievement badges, maintain streaks, and level up your outdoor rank.
              </p>
            </div>
            <Link href="/dashboard" className="pt-6 inline-flex items-center text-sm font-semibold text-[#245C43] hover:underline">
              Track Progress <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="rounded-3xl bg-[#245C43] text-white p-8 sm:p-14 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Leaf className="w-96 h-96 text-white" />
        </div>

        <div className="max-w-3xl space-y-8 relative z-10">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#A8D5A2] font-semibold">Step-by-step Guide</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How NatureQuest AI Works</h2>
            <p className="text-[#D6E8D1] text-base leading-relaxed">
              Connecting with nature doesn't require a remote mountain summit. A 10-minute mindful walk around your neighborhood or park is all it takes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-full bg-[#A8D5A2] text-[#245C43] font-bold flex items-center justify-center text-base">
                1
              </div>
              <h4 className="text-lg font-bold">Pick Your Time</h4>
              <p className="text-sm text-[#D6E8D1] leading-relaxed">
                Choose how many minutes you have (from 5 to 60) and your surroundings (park, yard, or sidewalk).
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-9 h-9 rounded-full bg-[#A8D5A2] text-[#245C43] font-bold flex items-center justify-center text-base">
                2
              </div>
              <h4 className="text-lg font-bold">Go Explore</h4>
              <p className="text-sm text-[#D6E8D1] leading-relaxed">
                Follow AI-tailored sensory tasks, look for patterns in leaves, and breathe in fresh outside air.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-9 h-9 rounded-full bg-[#A8D5A2] text-[#245C43] font-bold flex items-center justify-center text-base">
                3
              </div>
              <h4 className="text-lg font-bold">Log & Level Up</h4>
              <p className="text-sm text-[#D6E8D1] leading-relaxed">
                Claim your XP reward, save discoveries to your journal, and watch your outdoor streak grow.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/quests"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E7C76A] hover:bg-[#d6b758] text-[#18382A] font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              Generate Your First Quest Now
            </Link>
          </div>
        </div>
      </section>

      {/* Safety & Leave No Trace Banner */}
      <section className="rounded-2xl border border-[#D6E8D1] bg-white p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-[#EAF5E9] text-[#245C43] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-8 h-8 text-[#245C43]" />
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <h3 className="text-lg font-bold text-[#18382A]">Safety & Responsible Exploration First</h3>
          <p className="text-sm text-[#6F8174] leading-relaxed">
            NatureQuest AI promotes respectful observation. We follow strict Leave No Trace guidelines: never ingest wild plants or fungi, never disturb wildlife, and always respect private property.
          </p>
        </div>
      </section>
    </div>
  );
}
