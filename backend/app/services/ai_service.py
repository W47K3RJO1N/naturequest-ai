import json
import logging
import random
from typing import Optional, Dict, Any, List, Tuple

from google import genai
from google.genai import types
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.schemas import QuestGenerateRequest, QuestStructuredOutput

logger = logging.getLogger("naturequest.ai")

# Safe predefined fallback quests when offline or API is unavailable
FALLBACK_QUESTS: List[Dict[str, Any]] = [
    {
        "title": "The Five-Leaf Explorer",
        "description": "Notice the subtle diversity of foliage right in your local environment. Focus on shapes, edges, and textures without harming any foliage.",
        "difficulty": "Easy",
        "duration_minutes": 15,
        "activity_category": "Plant Observation",
        "environment": "Park or Garden",
        "tasks": [
            "Find three different leaf shapes (lobed, oval, needle-like) without damaging plants.",
            "Carefully observe and feel the texture of one leaf (waxy, fuzzy, or rough).",
            "Take a photo of your favorite discovery to record in your journal.",
            "Take three deep breaths of fresh air and note one distinct nature scent."
        ],
        "safety_reminders": [
            "Do not pluck live branches or flowers; observe gently on the stem.",
            "Never ingest any unknown leaves, berries, or mushrooms.",
            "Watch your step around uneven ground and roots."
        ],
        "completion_instructions": "Take a photo or jot down the shapes you observed in your Nature Journal to claim your 50 XP.",
        "xp_reward": 50
    },
    {
        "title": "Breeze & Canopy Mindfulness",
        "description": "Step outside for a peaceful sensory reset. Tune your senses to the sounds of rustling leaves, birdsong, and sunlight through branches.",
        "difficulty": "Easy",
        "duration_minutes": 10,
        "activity_category": "Mindfulness",
        "environment": "Backyard or Neighborhood Park",
        "tasks": [
            "Find a safe bench, rock, or grassy patch to sit comfortably for 5 minutes.",
            "Close your eyes and identify 3 distinct natural sounds (birdcall, wind, flowing water).",
            "Look up at the tree canopy or clouds and observe the motion for 2 minutes.",
            "Note the temperature and direction of the breeze against your skin."
        ],
        "safety_reminders": [
            "Pick a quiet spot away from vehicle traffic.",
            "Stay aware of your surroundings and personal belongings."
        ],
        "completion_instructions": "Reflect on how your mood shifted before and after the session.",
        "xp_reward": 45
    },
    {
        "title": "Urban Biodiversity Patrol",
        "description": "Discover resilient urban nature thriving in cracks, park boundaries, and garden beds.",
        "difficulty": "Medium",
        "duration_minutes": 20,
        "activity_category": "General Exploration",
        "environment": "Neighborhood",
        "tasks": [
            "Spot two species of birds or pollinators visiting neighborhood greenery.",
            "Find a plant or moss thriving in an unexpected spot (stone wall, sidewalk margin).",
            "Identify two different bark textures on trees along your walking route.",
            "Pick up one safe piece of litter if you have gloves or safely dispose of trash."
        ],
        "safety_reminders": [
            "Always follow pedestrian signals and look both ways before crossing streets.",
            "Never pick up broken glass or hazardous items.",
            "Respect private residential property."
        ],
        "completion_instructions": "Log your total walking time and write down the most resilient plant you encountered.",
        "xp_reward": 65
    },
    {
        "title": "Sunlight & Shadow Photographer",
        "description": "Cultivate an eye for natural lighting, shadows cast by branches, and vibrant organic color contrasts.",
        "difficulty": "Easy",
        "duration_minutes": 15,
        "activity_category": "Photography",
        "environment": "Any Safe Outdoor Area",
        "tasks": [
            "Capture a macro photo of a flower, seed pod, or interesting stone.",
            "Photograph the play of dappled sunlight filtering through leaves.",
            "Frame a wide-angle landscape or tree horizon shot.",
            "Save your best image to upload to the Nature Journal."
        ],
        "safety_reminders": [
            "Look where you are stepping while holding a camera or phone.",
            "Do not lean over steep drop-offs or river banks for a shot.",
            "Be mindful of insects and stinging plants."
        ],
        "completion_instructions": "Upload at least one nature photo to your journal to complete this quest.",
        "xp_reward": 55
    },
    {
        "title": "Canopy & Cloud Wanderer",
        "description": "A brisk 30-minute outdoor walk designed to boost cardiovascular energy and foster nature curiosity.",
        "difficulty": "Challenging",
        "duration_minutes": 30,
        "activity_category": "Walking",
        "environment": "Park or Nature Trail",
        "tasks": [
            "Walk continuously at a brisk, steady pace for 20 minutes.",
            "Identify three different tree species along the path by inspecting their leaves and bark.",
            "Observe animal or insect activity along the forest or grass edge.",
            "Spend the final 5 minutes cooling down and stretching under a tree."
        ],
        "safety_reminders": [
            "Bring water and stay hydrated.",
            "Wear supportive footwear suitable for dirt or gravel paths.",
            "Stay on marked trails to protect native flora and prevent erosion."
        ],
        "completion_instructions": "Log your 30 minutes of outdoor time to claim 90 XP.",
        "xp_reward": 90
    }
]

class AIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._client: Optional[genai.Client] = None
        if self.api_key:
            try:
                self._client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize GenAI client: {e}")

    def check_health(self) -> Dict[str, Any]:
        if not self.api_key:
            return {
                "status": "not_configured",
                "message": "GEMINI_API_KEY is not configured. Safe fallback quests are active.",
                "model": self.model_name
            }
        try:
            # Check availability or return active
            return {
                "status": "available",
                "message": f"Gemini AI service ready with model {self.model_name}.",
                "model": self.model_name
            }
        except Exception as e:
            return {
                "status": "fallback_only",
                "message": f"AI service error: {str(e)}. Fallbacks active.",
                "model": self.model_name
            }

    def generate_quest(self, req: QuestGenerateRequest) -> Tuple[QuestStructuredOutput, str]:
        """
        Generates a tailored quest. Returns (QuestStructuredOutput, source) where source is 'ai' or 'fallback'.
        """
        if not self._client or not self.api_key:
            logger.info("No Gemini API key configured. Using safe curated fallback quest.")
            return self._get_fallback_quest(req), "fallback"

        prompt = f"""
        You are NatureQuest AI, an inspiring outdoor guide encouraging wellness and environmental appreciation.
        Generate a safe, engaging, and mindful outdoor quest customized to these user parameters:
        - Duration: {req.duration_minutes} minutes
        - Difficulty: {req.difficulty}
        - Activity Category: {req.activity_category}
        - Environment: {req.environment}
        - User Interests: {', '.join(req.interests) if req.interests else 'General nature & plants'}
        - Accessibility Preference: {req.accessibility_preference}

        CRITICAL SAFETY RULES:
        1. NEVER suggest picking rare flowers, breaking branches, or destroying habitats.
        2. NEVER suggest consuming, foraging, or tasting any wild plants, berries, or fungi.
        3. NEVER suggest trespassing on private property, entering unsafe waterways, steep cliffs, or remote areas without trails.
        4. Tasks must be achievable, environmentally respectful (Leave No Trace), and mindful.
        5. Assign XP reward between 30 and 150 proportional to duration and difficulty.

        Return ONLY a valid JSON object matching this schema:
        {{
            "title": "Short poetic title (3-7 words)",
            "description": "Inspiring explanation of the quest (1-2 sentences)",
            "difficulty": "{req.difficulty}",
            "duration_minutes": {req.duration_minutes},
            "activity_category": "{req.activity_category}",
            "environment": "{req.environment}",
            "tasks": ["Specific action 1", "Specific action 2", "Specific action 3", "Specific action 4"],
            "safety_reminders": ["Safety rule 1", "Safety rule 2"],
            "completion_instructions": "How to record or verify in the app",
            "xp_reward": 50
        }}
        """

        try:
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                )
            )

            if response and response.text:
                raw_json = json.loads(response.text)
                validated_quest = QuestStructuredOutput(**raw_json)
                return validated_quest, "ai"

        except Exception as e:
            logger.error(f"Gemini API request failed: {e}. Falling back to curated quest.", exc_info=True)

        return self._get_fallback_quest(req), "fallback"

    def _get_fallback_quest(self, req: QuestGenerateRequest) -> QuestStructuredOutput:
        # Match by category if possible, else random
        matching = [q for q in FALLBACK_QUESTS if q["activity_category"].lower() == req.activity_category.lower()]
        selected = random.choice(matching) if matching else random.choice(FALLBACK_QUESTS)
        
        # Adapt parameters to match requested duration & difficulty
        adapted = dict(selected)
        adapted["duration_minutes"] = req.duration_minutes
        adapted["difficulty"] = req.difficulty
        adapted["environment"] = req.environment
        
        # Calculate XP based on duration and difficulty
        diff_multiplier = {"Easy": 1.0, "Medium": 1.3, "Challenging": 1.6}.get(req.difficulty, 1.0)
        calculated_xp = int((req.duration_minutes * 2.5 + 20) * diff_multiplier)
        adapted["xp_reward"] = min(max(calculated_xp, 30), 200)
        
        return QuestStructuredOutput(**adapted)

ai_service = AIService()
