"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Clock, 
  Sliders, 
  CheckCircle2, 
  ShieldAlert, 
  MapPin, 
  Heart, 
  Compass, 
  ArrowRight,
  Flame,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";

import { Quest } from "@/types";
import { fetchApi } from "@/lib/api";

const DURATIONS = [5, 10, 15, 30, 60];
const DIFFICULTIES = ["Easy", "Medium", "Challenging"];
const ACTIVITIES = [
  "Walking",
  "Plant Observation",
  "Bird Watching",
  "Photography",
  "Mindfulness",
  "Litter Cleanup",
  "General Exploration"
];
const ENVIRONMENTS = [
  "Garden",
  "Park",
  "Backyard",
  "Neighborhood",
  "Any Safe Outdoor Area"
];

export default function QuestGeneratorPage() {
  const router = useRouter();

  // Generator form state
  const [duration, setDuration] = useState<number>(15);
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [activity, setActivity] = useState<string>("Plant Observation");
  const [environment, setEnvironment] = useState<string>("Park");
  const [interestInput, setInterestInput] = useState<string>("");
  const [accessibility, setAccessibility] = useState<string>("Standard (paved or mild paths)");

  const [loading, setLoading] = useState(false);
  const [generatedQuest, setGeneratedQuest] = useState<Quest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const interests = interestInput.split(",").map(i => i.trim()).filter(Boolean);

      const res = await fetchApi<Quest>("/quests/generate", {
        method: "POST",
        body: JSON.stringify({
          duration_minutes: duration,
          difficulty,
          activity_category: activity,
          environment,
          interests,
          accessibility_preference: accessibility
        })
      });

      setGeneratedQuest(res);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch (err: any) {
      setError(err.message || "Failed to generate quest.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuest = async (questId: number) => {
    try {
      await fetchApi(`/quests/${questId}/start`, { method: "POST" });
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5E9] text-[#245C43] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#245C43]" />
          <span>Powered by Google Gemini</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18382A]">
          AI Quest Generator
        </h1>
        <p className="text-sm sm:text-base text-[#6F8174] max-w-xl mx-auto">
          Customize your outdoor mission to match your schedule and surroundings. Step outside, breathe, and explore.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Form Controls (3 cols) */}
        <div className="md:col-span-3 p-6 sm:p-8 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs space-y-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#18382A] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#245C43]" /> Duration
              </label>
              <div className="grid grid-cols-5 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      duration === d
                        ? "bg-[#245C43] text-white border-[#245C43] shadow-xs"
                        : "bg-[#F8FBF5] text-[#18382A] border-[#D6E8D1] hover:bg-[#EAF5E9]"
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#18382A] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#245C43]" /> Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      difficulty === diff
                        ? "bg-[#245C43] text-white border-[#245C43] shadow-xs"
                        : "bg-[#F8FBF5] text-[#18382A] border-[#D6E8D1] hover:bg-[#EAF5E9]"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#18382A]">
                Activity Category
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-sm font-medium text-[#18382A] focus:ring-2 focus:ring-[#245C43] focus:outline-none"
              >
                {ACTIVITIES.map((act) => (
                  <option key={act} value={act}>{act}</option>
                ))}
              </select>
            </div>

            {/* Environment */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#18382A] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#245C43]" /> Environment
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-sm font-medium text-[#18382A] focus:ring-2 focus:ring-[#245C43] focus:outline-none"
              >
                {ENVIRONMENTS.map((env) => (
                  <option key={env} value={env}>{env}</option>
                ))}
              </select>
            </div>

            {/* Optional Specific Interests */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#18382A]">
                Personal Interests (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. wild mushrooms, moss, bird calls, cloud shapes"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-sm text-[#18382A] focus:ring-2 focus:ring-[#245C43] focus:outline-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#245C43] hover:bg-[#19402e] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Quest with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#E7C76A]" />
                  Generate Personalized Quest
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Panel (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {generatedQuest ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#A8D5A2] shadow-md space-y-5 animate-fade-in relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF5E9] text-[#245C43]">
                  {generatedQuest.difficulty}
                </span>
                <span className="text-xs font-bold text-[#E7C76A] bg-[#245C43] px-2.5 py-1 rounded-full">
                  +{generatedQuest.xp_reward} XP
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#18382A]">{generatedQuest.title}</h3>
                <p className="text-xs text-[#6F8174] leading-relaxed">{generatedQuest.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#245C43]">Your Tasks:</h4>
                <ul className="space-y-1.5 text-xs text-[#18382A]">
                  {generatedQuest.tasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#245C43] shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {generatedQuest.safety_reminders.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-[11px]">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Safety Note:
                  </div>
                  <p className="text-[11px] leading-snug">{generatedQuest.safety_reminders[0]}</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => handleStartQuest(generatedQuest.id)}
                  className="w-full py-3 rounded-xl bg-[#245C43] hover:bg-[#19402e] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 text-[#A8D5A2]" />
                  Accept & Start Mission
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-[#D6E8D1] text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF5E9] text-[#245C43] mx-auto flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#245C43]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#18382A]">Your Quest Appears Here</h3>
                <p className="text-xs text-[#6F8174] leading-relaxed">
                  Choose your duration, difficulty, and setting to receive an engaging mindfulness or discovery challenge.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FBF5] border border-[#D6E8D1]/80 text-left text-xs text-[#6F8174] space-y-2">
                <span className="font-bold text-[#18382A] block">Safety Guaranteed:</span>
                <p>• Never encourages trespassing or private property entry.</p>
                <p>• Zero foraging or ingestion of unknown plants/fungi.</p>
                <p>• Strict Leave No Trace ethos.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
