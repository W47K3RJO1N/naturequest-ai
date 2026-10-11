from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float, JSON
)
from sqlalchemy.orm import relationship

from app.db.session import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    display_name = Column(String(150), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # Gamification stats
    xp = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=1, nullable=False)
    streak_days = Column(Integer, default=0, nullable=False)
    last_active_date = Column(DateTime, nullable=True)
    outdoor_minutes = Column(Integer, default=0, nullable=False)
    
    # Preferences stored in JSON
    preferences = Column(JSON, default=lambda: {
        "preferred_duration": 15,
        "default_environment": "Park",
        "accessibility_preference": "Standard",
        "interests": ["Plants", "Mindfulness"],
        "notifications_enabled": True
    }, nullable=False)
    
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    quests = relationship("Quest", back_populates="user", cascade="all, delete-orphan")
    completions = relationship("QuestCompletion", back_populates="user", cascade="all, delete-orphan")
    discoveries = relationship("Discovery", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")


class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Easy", nullable=False) # Easy, Medium, Challenging
    duration_minutes = Column(Integer, default=15, nullable=False)
    activity_category = Column(String(100), default="General Exploration", nullable=False)
    environment = Column(String(100), default="Any Safe Outdoor Area", nullable=False)
    
    tasks = Column(JSON, nullable=False) # List of string instructions
    safety_reminders = Column(JSON, nullable=False) # List of reminders
    completion_instructions = Column(Text, nullable=True)
    xp_reward = Column(Integer, default=50, nullable=False)
    
    # Status
    status = Column(String(50), default="available", nullable=False) # available, active, completed, skipped
    is_daily = Column(Boolean, default=False, nullable=False)
    source = Column(String(50), default="ai", nullable=False) # ai or fallback
    
    created_at = Column(DateTime, default=utc_now, nullable=False)
    expires_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="quests")
    completion = relationship("QuestCompletion", back_populates="quest", uselist=False, cascade="all, delete-orphan")


class QuestCompletion(Base):
    __tablename__ = "quest_completions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    quest_id = Column(Integer, ForeignKey("quests.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    completed_at = Column(DateTime, default=utc_now, nullable=False)
    xp_earned = Column(Integer, default=0, nullable=False)
    outdoor_minutes = Column(Integer, default=0, nullable=False)
    user_notes = Column(Text, nullable=True)
    completion_photos = Column(JSON, default=list, nullable=True)
    reflection = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="completions")
    quest = relationship("Quest", back_populates="completion")


class Discovery(Base):
    __tablename__ = "discoveries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    common_name = Column(String(255), nullable=True)
    scientific_name = Column(String(255), nullable=True)
    category = Column(String(100), default="Plant", nullable=False) # Plant, Fungi, Bird, Insect, Tree, Other
    
    image_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    confidence = Column(Float, nullable=True) # 0.0 - 1.0 from vision provider
    location_name = Column(String(255), nullable=True)
    is_verified_by_ai = Column(Boolean, default=False, nullable=False)
    identification_provider = Column(String(100), nullable=True) # gemini, mock, manual
    
    discovered_at = Column(DateTime, default=utc_now, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="discoveries")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    activity_type = Column(String(100), default="Walk", nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
    date = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="activities")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String(100), primary_key=True) # unique slug e.g. "first_quest"
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    icon_name = Column(String(100), default="Award", nullable=False)
    category = Column(String(100), default="exploration", nullable=False)
    xp_bonus = Column(Integer, default=50, nullable=False)
    requirement_type = Column(String(100), nullable=False) # quest_count, streak, discovery_count, minutes
    requirement_threshold = Column(Integer, nullable=False)

    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    achievement_id = Column(String(100), ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False, index=True)
    unlocked_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
