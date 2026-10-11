"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Trophy, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  ShieldAlert,
  Leaf,
  Activity,
  Layers,
  Award
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import confetti from "canvas-confetti";

import { DashboardData, Quest } from "@/types";
import { fetchApi } from "@/lib/api";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [notes, setNotes] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchApi<DashboardData>("/dashboard");
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleStartQuest = async (questId: number) => {
    try {
      await fetchApi(`/quests/${questId}/start`, { method: "POST" });
      await loadDashboard();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCompleteQuest = async () => {
    if (!data?.current_quest) return;
    try {
      setCompleting(true);
      const res: any = await fetchApi(`/quests/${data.current_quest.id}/complete`, {
        method: "POST",
        body: JSON.stringify({
          user_notes: notes,
          reflection: "Completed from dashboard"
        })
      });
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setShowCompleteModal(false);
      setNotes("");
      setSuccessMessage(`Quest completed! Earned +${res.xp_earned} XP. Level: ${res.new_level}`);
      setTimeout(() => setSuccessMessage(null), 5000);
      await loadDashboard();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#245C43] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-[#6F8174]">Connecting to NatureQuest AI...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3">
        <ShieldAlert className="w-8 h-8 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-red-800">Could not connect to backend</h3>
        <p className="text-sm text-red-600">{error || "Backend is currently unreachable."}</p>
        <button
          onClick={loadDashboard}
          className="px-4 py-2 rounded-xl bg-[#245C43] text-white text-sm font-semibold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { user, current_quest, weekly_activity, recent_discoveries, recent_achievements } = data;
  const progressPercent = Math.min(
    100,
    Math.round(((data.xp_current_level_progress) / Math.max(1, (data.xp_for_next_level - (data.xp_for_next_level - data.xp_current_level_progress)))) * 100)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Alert */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-[#EAF5E9] border border-[#245C43] text-[#245C43] flex items-center gap-3 shadow-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#245C43] shrink-0" />
          <span className="font-semibold text-sm">{successMessage}</span>
        </div>
      )}

      {/* Top Banner: User Greetings & AI Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18382A]">
              Welcome back, {user.display_name || user.username}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF5E9] text-[#245C43]">
              Lvl {user.level}
            </span>
          </div>
          <p className="text-sm text-[#6F8174]">
            Ready to touch grass? Your daily nature journey awaits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8FBF5] border border-[#D6E8D1] text-xs font-medium text-[#6F8174]">
            <span className={`w-2 h-2 rounded-full ${data.ai_status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            AI: {data.ai_status === 'available' ? 'Gemini Active' : 'Fallback Engine'}
          </div>
          <Link
            href="/quests"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#245C43] hover:bg-[#19402e] text-white text-sm font-semibold shadow-xs transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-[#E7C76A]" />
            Generate New Quest
          </Link>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* XP Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6E8D1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6F8174]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Experience</span>
            <Trophy className="w-4 h-4 text-[#E7C76A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#18382A]">{user.xp} XP</div>
          <div className="space-y-1">
            <div className="w-full bg-[#EAF5E9] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#245C43] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, (user.xp % 150) / 1.5))}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-[#6F8174]">Level {user.level} Naturalist</p>
          </div>
        </div>

        {/* Streak Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6E8D1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6F8174]">
            <span className="text-xs font-semibold uppercase tracking-wider">Outdoor Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#18382A] flex items-baseline gap-1">
            {user.streak_days} <span className="text-base font-normal text-[#6F8174]">days</span>
          </div>
          <p className="text-[11px] text-[#6F8174]">Log today to keep streak active</p>
        </div>

        {/* Minutes Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6E8D1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6F8174]">
            <span className="text-xs font-semibold uppercase tracking-wider">Time Outdoors</span>
            <Clock className="w-4 h-4 text-[#245C43]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#18382A] flex items-baseline gap-1">
            {user.outdoor_minutes} <span className="text-base font-normal text-[#6F8174]">mins</span>
          </div>
          <p className="text-[11px] text-[#6F8174]">Across mindful excursions</p>
        </div>

        {/* Quests Completed Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6E8D1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6F8174]">
            <span className="text-xs font-semibold uppercase tracking-wider">Quests Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#18382A]">
            {data.completed_quests_count}
          </div>
          <p className="text-[11px] text-[#6F8174]">Missions accomplished</p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Quest & Activity Chart (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active / Featured Daily Quest */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF5E9] text-[#245C43]">
                  {current_quest?.status === "active" ? "Ongoing Mission" : "Daily Outdoor Quest"}
                </span>
                <span className="text-xs font-medium text-[#6F8174]">
                  +{current_quest?.xp_reward || 50} XP
                </span>
              </div>
              <span className="text-xs font-medium text-[#6F8174] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {current_quest?.duration_minutes || 15} mins
              </span>
            </div>

            {current_quest ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-[#18382A]">{current_quest.title}</h2>
                  <p className="text-sm text-[#6F8174] leading-relaxed">{current_quest.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FBF5] border border-[#D6E8D1]/80 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#245C43]">Actionable Tasks:</h4>
                  <ul className="space-y-1.5 text-sm text-[#18382A]">
                    {current_quest.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#245C43] shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {current_quest.safety_reminders && (
                  <div className="text-xs text-[#6F8174] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{current_quest.safety_reminders[0]}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {current_quest.status === "available" ? (
                    <button
                      onClick={() => handleStartQuest(current_quest.id)}
                      className="px-6 py-2.5 rounded-xl bg-[#245C43] hover:bg-[#19402e] text-white text-sm font-semibold shadow-xs flex items-center gap-2"
                    >
                      <Compass className="w-4 h-4 text-[#A8D5A2]" />
                      Begin Quest Outdoors
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowCompleteModal(true)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Complete & Claim {current_quest.xp_reward} XP
                    </button>
                  )}
                  <Link
                    href="/quests"
                    className="px-4 py-2.5 rounded-xl bg-[#F8FBF5] hover:bg-[#EAF5E9] text-[#245C43] text-sm font-medium border border-[#D6E8D1]"
                  >
                    Customize Different Quest
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <Compass className="w-12 h-12 text-[#245C43] mx-auto opacity-70" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#18382A]">No active quests right now</h3>
                  <p className="text-sm text-[#6F8174]">Generate a custom AI outdoor challenge to get moving!</p>
                </div>
                <Link
                  href="/quests"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#245C43] text-white font-semibold text-sm shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-[#E7C76A]" />
                  Generate New Quest
                </Link>
              </div>
            )}
          </div>

          {/* Weekly Activity Chart */}
          <div className="p-6 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#18382A]">Weekly Outdoor Minutes</h3>
                <p className="text-xs text-[#6F8174]">Time spent in fresh air over the last 7 days</p>
              </div>
              <Activity className="w-5 h-5 text-[#245C43]" />
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly_activity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAF5E9" vertical={false} />
                  <XAxis dataKey="day" stroke="#6F8174" fontSize={12} tickLine={false} />
                  <YAxis stroke="#6F8174" fontSize={12} tickLine={false} unit="m" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#FFFFFF", 
                      borderRadius: "12px", 
                      border: "1px solid #D6E8D1",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" 
                    }} 
                    formatter={(val: any) => [`${val} minutes`, "Outdoor Time"]}
                  />
                  <Bar dataKey="minutes" fill="#245C43" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Discoveries & Badges (1 col) */}
        <div className="space-y-8">
          {/* Recent Discoveries */}
          <div className="p-6 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#18382A]">Recent Discoveries</h3>
              <Link href="/journal" className="text-xs font-semibold text-[#245C43] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recent_discoveries.length > 0 ? (
              <div className="space-y-3">
                {recent_discoveries.map((disc) => (
                  <div key={disc.id} className="p-3.5 rounded-2xl bg-[#F8FBF5] border border-[#D6E8D1]/80 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-[#18382A]">{disc.common_name || disc.title}</h4>
                      <p className="text-xs text-[#6F8174] italic">{disc.scientific_name || disc.category}</p>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-1 rounded-md bg-[#EAF5E9] text-[#245C43]">
                      {disc.category}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <Leaf className="w-8 h-8 text-[#6F8174]/60 mx-auto" />
                <p className="text-xs text-[#6F8174]">No discoveries logged yet.</p>
                <Link href="/explorer" className="inline-block text-xs font-semibold text-[#245C43] hover:underline">
                  Identify your first plant →
                </Link>
              </div>
            )}
          </div>

          {/* Achievement Badges */}
          <div className="p-6 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#18382A]">Achievements</h3>
              <span className="text-xs text-[#6F8174]">
                {recent_achievements.filter(a => a.is_unlocked).length}/{recent_achievements.length} unlocked
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {recent_achievements.map((ach) => (
                <div 
                  key={ach.id} 
                  className={`p-3.5 rounded-2xl border text-center space-y-2 transition-all ${
                    ach.is_unlocked 
                      ? "bg-[#EAF5E9] border-[#A8D5A2] text-[#245C43]" 
                      : "bg-[#F8FBF5] border-[#D6E8D1]/60 text-gray-400 opacity-60"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/80 mx-auto flex items-center justify-center shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold leading-tight line-clamp-1">{ach.title}</h5>
                    <p className="text-[10px] text-[#6F8174] mt-0.5 leading-snug line-clamp-2">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-xl border border-[#D6E8D1]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5E9] text-[#245C43] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#245C43]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#18382A]">Complete Your Quest</h3>
                <p className="text-xs text-[#6F8174]">Record your reflection to claim your XP</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#18382A]">How did it feel outdoors? (Optional Notes)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observed three distinct leaf textures and enjoyed the morning breeze..."
                className="w-full h-24 p-3 rounded-xl border border-[#D6E8D1] focus:ring-2 focus:ring-[#245C43] focus:outline-none text-sm resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-[#6F8174] hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteQuest}
                disabled={completing}
                className="px-5 py-2 rounded-xl bg-[#245C43] text-white text-sm font-semibold shadow-xs flex items-center gap-2 hover:bg-[#19402e]"
              >
                {completing ? "Claiming..." : `Claim Reward (+${current_quest?.xp_reward} XP)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
