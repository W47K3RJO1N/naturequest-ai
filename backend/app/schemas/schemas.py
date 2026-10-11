from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# ----------------- User & Auth Schemas -----------------
class UserBase(BaseModel):
    email: EmailStr
    username: str
    display_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

class UserOut(UserBase):
    id: int
    avatar_url: Optional[str] = None
    xp: int
    level: int
    streak_days: int
    outdoor_minutes: int
    preferences: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ----------------- Quest Schemas -----------------
class QuestGenerateRequest(BaseModel):
    duration_minutes: int = Field(15, ge=5, le=120)
    difficulty: str = Field("Easy", pattern="^(Easy|Medium|Challenging)$")
    activity_category: str = Field("Walking")
    environment: str = Field("Park")
    interests: Optional[List[str]] = Field(default_factory=list)
    accessibility_preference: Optional[str] = "Standard"

class QuestStructuredOutput(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    description: str = Field(..., min_length=10)
    difficulty: str = Field("Easy")
    duration_minutes: int = Field(15)
    activity_category: str = Field("General Exploration")
    environment: str = Field("Any Safe Outdoor Area")
    tasks: List[str] = Field(..., min_items=1)
    safety_reminders: List[str] = Field(..., min_items=1)
    completion_instructions: str = Field(...)
    xp_reward: int = Field(50, ge=10, le=500)

class QuestOut(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    duration_minutes: int
    activity_category: str
    environment: str
    tasks: List[str]
    safety_reminders: List[str]
    completion_instructions: Optional[str] = None
    xp_reward: int
    status: str
    is_daily: bool
    source: str
    created_at: datetime

    class Config:
        from_attributes = True

class QuestCompleteRequest(BaseModel):
    user_notes: Optional[str] = None
    reflection: Optional[str] = None
    completion_photos: Optional[List[str]] = Field(default_factory=list)
    outdoor_minutes_override: Optional[int] = None

class QuestCompletionOut(BaseModel):
    id: int
    quest_id: int
    completed_at: datetime
    xp_earned: int
    outdoor_minutes: int
    user_notes: Optional[str] = None
    reflection: Optional[str] = None
    new_level: int
    new_total_xp: int
    new_streak: int
    unlocked_achievements: List[str] = []

    class Config:
        from_attributes = True

# ----------------- Discovery & Identification Schemas -----------------
class DiscoveryCreate(BaseModel):
    title: str
    common_name: Optional[str] = None
    scientific_name: Optional[str] = None
    category: str = "Plant"
    image_url: Optional[str] = None
    notes: Optional[str] = None
    confidence: Optional[float] = None
    location_name: Optional[str] = None
    is_verified_by_ai: bool = False
    identification_provider: Optional[str] = "manual"

class DiscoveryUpdate(BaseModel):
    title: Optional[str] = None
    common_name: Optional[str] = None
    scientific_name: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None
    location_name: Optional[str] = None

class DiscoveryOut(BaseModel):
    id: int
    title: str
    common_name: Optional[str] = None
    scientific_name: Optional[str] = None
    category: str
    image_url: Optional[str] = None
    notes: Optional[str] = None
    confidence: Optional[float] = None
    location_name: Optional[str] = None
    is_verified_by_ai: bool
    identification_provider: Optional[str] = None
    discovered_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class PlantIdentificationResult(BaseModel):
    common_name: str
    scientific_name: Optional[str] = None
    category: str = "Plant"
    confidence: float
    description: str
    care_or_nature_notes: Optional[str] = None
    safety_disclaimer: str = "Identifications are suggestions based on AI vision and should not be used to consume wild plants or fungi."
    provider: str

# ----------------- Gamification & Dashboard Schemas -----------------
class AchievementOut(BaseModel):
    id: str
    title: str
    description: str
    icon_name: str
    category: str
    xp_bonus: int
    is_unlocked: bool = False
    unlocked_at: Optional[datetime] = None

class ActivityCreate(BaseModel):
    activity_type: str
    duration_minutes: int = Field(..., gt=0)
    notes: Optional[str] = None

class ActivityOut(BaseModel):
    id: int
    activity_type: str
    duration_minutes: int
    notes: Optional[str] = None
    date: datetime

    class Config:
        from_attributes = True

class DayActivity(BaseModel):
    day: str # e.g. "Mon", "Tue"
    date: str # YYYY-MM-DD
    minutes: int
    quests_completed: int

class DashboardData(BaseModel):
    user: UserOut
    current_quest: Optional[QuestOut] = None
    completed_quests_count: int
    total_xp: int
    level: int
    xp_for_next_level: int
    xp_current_level_progress: int
    streak_days: int
    outdoor_minutes: int
    weekly_activity: List[DayActivity]
    recent_discoveries: List[DiscoveryOut]
    recent_achievements: List[AchievementOut]
    ai_status: str # "available" | "fallback_only" | "not_configured"
