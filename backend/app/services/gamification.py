from datetime import datetime, timezone
import math
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session

from app.models.models import User, Achievement, UserAchievement, Activity

# Formula: Level N requires 100 * (N - 1)^1.5 total XP
# Level 1: 0 XP
# Level 2: 100 XP
# Level 3: 283 XP
# Level 4: 520 XP
# Level 5: 800 XP

def calculate_level_from_xp(xp: int) -> int:
    if xp <= 0:
        return 1
    lvl = 1
    while True:
        next_lvl_xp = int(100 * math.pow(lvl, 1.5))
        if xp < next_lvl_xp:
            return lvl
        lvl += 1

def get_xp_bounds_for_level(level: int) -> Tuple[int, int]:
    """Returns (current_level_base_xp, next_level_required_xp)"""
    if level <= 1:
        current_base = 0
    else:
        current_base = int(100 * math.pow(level - 1, 1.5))
    next_base = int(100 * math.pow(level, 1.5))
    return current_base, next_base

INITIAL_ACHIEVEMENTS = [
    {
        "id": "first_step",
        "title": "First Step Outdoors",
        "description": "Complete your very first NatureQuest challenge.",
        "icon_name": "Footprints",
        "category": "exploration",
        "xp_bonus": 50,
        "requirement_type": "quest_count",
        "requirement_threshold": 1,
    },
    {
        "id": "quest_trio",
        "title": "Trail Blazer",
        "description": "Complete 3 outdoor quests.",
        "icon_name": "Compass",
        "category": "exploration",
        "xp_bonus": 100,
        "requirement_type": "quest_count",
        "requirement_threshold": 3,
    },
    {
        "id": "first_discovery",
        "title": "Curious Naturalist",
        "description": "Record your first plant or wildlife discovery in the Nature Journal.",
        "icon_name": "Leaf",
        "category": "journal",
        "xp_bonus": 50,
        "requirement_type": "discovery_count",
        "requirement_threshold": 1,
    },
    {
        "id": "flora_collector",
        "title": "Flora Explorer",
        "description": "Record 5 distinct discoveries in your nature journal.",
        "icon_name": "Trees",
        "category": "journal",
        "xp_bonus": 150,
        "requirement_type": "discovery_count",
        "requirement_threshold": 5,
    },
    {
        "id": "streak_3",
        "title": "Fresh Air Habit",
        "description": "Achieve a 3-day outdoor streak.",
        "icon_name": "Flame",
        "category": "streak",
        "xp_bonus": 100,
        "requirement_type": "streak",
        "requirement_threshold": 3,
    },
    {
        "id": "outdoor_hour",
        "title": "Hour in the Woods",
        "description": "Log a cumulative 60 minutes of outdoor time.",
        "icon_name": "Clock",
        "category": "time",
        "xp_bonus": 100,
        "requirement_type": "minutes",
        "requirement_threshold": 60,
    },
]

def seed_achievements_if_needed(db: Session):
    for ach_data in INITIAL_ACHIEVEMENTS:
        existing = db.query(Achievement).filter(Achievement.id == ach_data["id"]).first()
        if not existing:
            ach = Achievement(**ach_data)
            db.add(ach)
    db.commit()

def check_and_unlock_achievements(db: Session, user: User, completed_quests_count: int, discoveries_count: int) -> List[str]:
    seed_achievements_if_needed(db)
    
    unlocked_ids = {
        ua.achievement_id for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    }
    
    newly_unlocked = []
    all_achievements = db.query(Achievement).all()
    
    for ach in all_achievements:
        if ach.id in unlocked_ids:
            continue
            
        qualifies = False
        if ach.requirement_type == "quest_count" and completed_quests_count >= ach.requirement_threshold:
            qualifies = True
        elif ach.requirement_type == "discovery_count" and discoveries_count >= ach.requirement_threshold:
            qualifies = True
        elif ach.requirement_type == "streak" and user.streak_days >= ach.requirement_threshold:
            qualifies = True
        elif ach.requirement_type == "minutes" and user.outdoor_minutes >= ach.requirement_threshold:
            qualifies = True
            
        if qualifies:
            ua = UserAchievement(
                user_id=user.id,
                achievement_id=ach.id,
                unlocked_at=datetime.now(timezone.utc)
            )
            db.add(ua)
            # Award achievement bonus XP
            user.xp += ach.xp_bonus
            newly_unlocked.append(ach.title)
            
    if newly_unlocked:
        # Re-evaluate level if XP increased
        user.level = calculate_level_from_xp(user.xp)
        db.commit()
        
    return newly_unlocked
