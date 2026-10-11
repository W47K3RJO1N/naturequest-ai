export interface UserProfile {
  id: number;
  email: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak_days: number;
  outdoor_minutes: number;
  preferences: {
    preferred_duration?: number;
    default_environment?: string;
    accessibility_preference?: string;
    interests?: string[];
    notifications_enabled?: boolean;
    [key: string]: any;
  };
  created_at: string;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Challenging";
  duration_minutes: number;
  activity_category: string;
  environment: string;
  tasks: string[];
  safety_reminders: string[];
  completion_instructions?: string;
  xp_reward: number;
  status: "available" | "active" | "completed" | "skipped";
  is_daily: boolean;
  source: string;
  created_at: string;
}

export interface QuestCompletionResult {
  id: number;
  quest_id: number;
  completed_at: string;
  xp_earned: number;
  outdoor_minutes: number;
  user_notes?: string;
  reflection?: string;
  new_level: number;
  new_total_xp: number;
  new_streak: number;
  unlocked_achievements: string[];
}

export interface Discovery {
  id: number;
  title: string;
  common_name: string | null;
  scientific_name: string | null;
  category: string;
  image_url: string | null;
  notes: string | null;
  confidence: number | null;
  location_name: string | null;
  is_verified_by_ai: boolean;
  identification_provider: string | null;
  discovered_at: string;
  created_at: string;
}

export interface IdentificationResult {
  common_name: string;
  scientific_name?: string | null;
  category: string;
  confidence: number;
  description: string;
  care_or_nature_notes?: string | null;
  safety_disclaimer: string;
  provider: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  category: string;
  xp_bonus: number;
  is_unlocked: boolean;
  unlocked_at?: string | null;
}

export interface DayActivity {
  day: string;
  date: string;
  minutes: number;
  quests_completed: number;
}

export interface DashboardData {
  user: UserProfile;
  current_quest: Quest | null;
  completed_quests_count: number;
  total_xp: number;
  level: number;
  xp_for_next_level: number;
  xp_current_level_progress: number;
  streak_days: number;
  outdoor_minutes: number;
  weekly_activity: DayActivity[];
  recent_discoveries: Discovery[];
  recent_achievements: Achievement[];
  ai_status: "available" | "fallback_only" | "not_configured";
}
