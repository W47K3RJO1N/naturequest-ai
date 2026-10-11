"use client";

import { useEffect, useState } from "react";
import { 
  User, 
  Settings, 
  Award, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Save, 
  Sparkles,
  Download,
  Trash2
} from "lucide-react";

import { UserProfile, Achievement } from "@/types";
import { fetchApi } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Editable preferences
  const [displayName, setDisplayName] = useState("");
  const [preferredDuration, setPreferredDuration] = useState(15);
  const [defaultEnv, setDefaultEnv] = useState("Park");
  const [accessibility, setAccessibility] = useState("Standard");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const [userData, achData] = await Promise.all([
          fetchApi<UserProfile>("/users/me"),
          fetchApi<Achievement[]>("/achievements")
        ]);
        setUser(userData);
        setAchievements(achData);
        setDisplayName(userData.display_name || userData.username);
        if (userData.preferences) {
          setPreferredDuration(userData.preferences.preferred_duration || 15);
          setDefaultEnv(userData.preferences.default_environment || "Park");
          setAccessibility(userData.preferences.accessibility_preference || "Standard");
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await fetchApi<UserProfile>("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          display_name: displayName,
          preferences: {
            preferred_duration: preferredDuration,
            default_environment: defaultEnv,
            accessibility_preference: accessibility
          }
        })
      });
      setUser(updated);
      setSaveMessage("Profile preferences saved successfully!");
      setTimeout(() => setSaveMessage(null), 4000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `naturequest_profile_${user?.username || 'user'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading || !user) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#245C43] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-[#6F8174] mt-3">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-[#245C43] text-white flex items-center justify-center font-bold text-2xl shadow-md">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold text-[#18382A]">{displayName}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF5E9] text-[#245C43] w-fit mx-auto sm:mx-0">
              Level {user.level} Explorer
            </span>
          </div>
          <p className="text-xs text-[#6F8174]">{user.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-[#6F8174]">
            <span className="flex items-center gap-1 font-semibold text-[#18382A]">
              <Sparkles className="w-3.5 h-3.5 text-[#E7C76A]" /> {user.xp} XP
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-[#18382A]">
              <Flame className="w-3.5 h-3.5 text-orange-500" /> {user.streak_days} Day Streak
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-[#18382A]">
              <Clock className="w-3.5 h-3.5 text-[#245C43]" /> {user.outdoor_minutes} Outdoor Mins
            </span>
          </div>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 rounded-xl bg-[#EAF5E9] text-[#245C43] text-xs font-semibold border border-[#A8D5A2]">
          {saveMessage}
        </div>
      )}

      {/* Settings & Preferences */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#245C43]" />
          <h2 className="text-xl font-bold text-[#18382A]">Exploration Settings & Preferences</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-[#18382A]">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-xs font-medium text-[#18382A] focus:ring-2 focus:ring-[#245C43] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-[#18382A]">Preferred Duration (minutes)</label>
              <select
                value={preferredDuration}
                onChange={(e) => setPreferredDuration(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-xs font-medium text-[#18382A] focus:ring-2 focus:ring-[#245C43] focus:outline-none"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-[#18382A]">Default Environment</label>
              <select
                value={defaultEnv}
                onChange={(e) => setDefaultEnv(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-xs font-medium text-[#18382A] focus:ring-2 focus:ring-[#245C43] focus:outline-none"
              >
                <option value="Garden">Garden</option>
                <option value="Park">Park</option>
                <option value="Backyard">Backyard</option>
                <option value="Neighborhood">Neighborhood</option>
                <option value="Any Safe Outdoor Area">Any Safe Outdoor Area</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-[#18382A]">Accessibility Preference</label>
              <select
                value={accessibility}
                onChange={(e) => setAccessibility(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-xs font-medium text-[#18382A] focus:ring-2 focus:ring-[#245C43] focus:outline-none"
              >
                <option value="Standard">Standard (paved paths & gentle walking)</option>
                <option value="Wheelchair Friendly">Wheelchair Accessible Routes</option>
                <option value="Sitting Only">Seated / Bench Observation</option>
                <option value="Active Hiker">Trail / Active Hiker</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#245C43] hover:bg-[#19402e] text-white text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </div>

      {/* Badges and Trophies */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#245C43]" />
            <h2 className="text-xl font-bold text-[#18382A]">Unlocked Badges</h2>
          </div>
          <span className="text-xs text-[#6F8174]">
            {achievements.filter(a => a.is_unlocked).length} of {achievements.length} Badges
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                ach.is_unlocked
                  ? "bg-[#EAF5E9] border-[#A8D5A2] text-[#245C43]"
                  : "bg-[#F8FBF5] border-[#D6E8D1]/60 text-gray-400 opacity-60"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold">{ach.title}</h4>
                <p className="text-[10px] text-[#6F8174] line-clamp-2 leading-snug">{ach.description}</p>
                <span className="text-[10px] font-semibold text-[#245C43]">+{ach.xp_bonus} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Export and Privacy */}
      <div className="p-6 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#18382A]">Data Export & Privacy</h4>
          <p className="text-xs text-[#6F8174]">
            Export all your outdoor journals, quest history, and XP metrics.
          </p>
        </div>
        <button
          onClick={handleExportData}
          className="px-4 py-2 rounded-xl bg-[#F8FBF5] border border-[#D6E8D1] text-[#245C43] text-xs font-bold flex items-center gap-2 hover:bg-[#EAF5E9]"
        >
          <Download className="w-4 h-4" />
          Export JSON Data
        </button>
      </div>
    </div>
  );
}
