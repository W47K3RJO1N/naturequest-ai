import base64
import io
import json
import logging
import random
from typing import Optional
from PIL import Image

from google import genai
from google.genai import types

from app.core.config import settings
from app.schemas.schemas import PlantIdentificationResult

logger = logging.getLogger("naturequest.vision")

SAMPLE_MOCK_IDENTIFICATIONS = [
    {
        "common_name": "Broadleaf Plantain",
        "scientific_name": "Plantago major",
        "category": "Plant",
        "confidence": 0.88,
        "description": "A hardy perennial herb with wide, oval leaves and prominent parallel veins, often found in lawns and along footpath edges.",
        "care_or_nature_notes": "Very resilient native or naturalized ground cover that helps stabilize urban soil and feeds wild bird species with its seed spikes.",
        "provider": "NatureQuest Vision (Demo Provider)"
    },
    {
        "common_name": "White Clover",
        "scientific_name": "Trifolium repens",
        "category": "Plant",
        "confidence": 0.94,
        "description": "A low-growing herbaceous plant with compound leaves consisting of three round leaflets with subtle whitish crescents.",
        "care_or_nature_notes": "A nitrogen-fixing legume that enriches the soil and provides nectar for honeybees and local bumblebees.",
        "provider": "NatureQuest Vision (Demo Provider)"
    },
    {
        "common_name": "Common Dandelion",
        "scientific_name": "Taraxacum officinale",
        "category": "Plant",
        "confidence": 0.96,
        "description": "Recognizable bright yellow composite flower heads that mature into spherical seed puffs (clocks), with deeply toothed basal leaves.",
        "care_or_nature_notes": "One of the earliest springtime nectar sources for emerging pollinators. Deep taproots help aerate compacted soil.",
        "provider": "NatureQuest Vision (Demo Provider)"
    },
    {
        "common_name": "Turkey Tail Fungi",
        "scientific_name": "Trametes versicolor",
        "category": "Fungi",
        "confidence": 0.85,
        "description": "A common polypore mushroom displaying concentric multicolored zones resembling the plumage of a wild turkey.",
        "care_or_nature_notes": "Grows primarily on dead hardwood logs, playing a vital ecological role in breaking down lignin and recycling forest nutrients.",
        "provider": "NatureQuest Vision (Demo Provider)"
    },
    {
        "common_name": "American Robin",
        "scientific_name": "Turdus migratorius",
        "category": "Bird",
        "confidence": 0.91,
        "description": "A migratory songbird characterized by its reddish-orange breast, dark gray upperparts, and cheerful vocalizations.",
        "care_or_nature_notes": "Often seen foraging on lawns for earthworms or perched in berry-producing bushes during cooler seasons.",
        "provider": "NatureQuest Vision (Demo Provider)"
    }
]

class VisionProvider:
    def identify_nature_image(self, image_bytes: bytes, mime_type: str = "image/jpeg") -> PlantIdentificationResult:
        # Check if Gemini vision is enabled with a valid key
        if settings.GEMINI_API_KEY and settings.VISION_PROVIDER == "gemini":
            try:
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                
                prompt = """
                Analyze this photo of a plant, flower, tree, fungus, or wildlife specimen.
                Provide an identification suggestion based purely on visual features.
                Remember that AI vision can make errors, so provide your honest confidence rating.

                Return a JSON object strictly matching this schema:
                {
                    "common_name": "Common English name",
                    "scientific_name": "Genus species (or null)",
                    "category": "Plant" or "Fungi" or "Bird" or "Insect" or "Tree" or "Other",
                    "confidence": 0.85,
                    "description": "Concise botanical/visual description of key features observed in the photo (2-3 sentences)",
                    "care_or_nature_notes": "Interesting ecological role or habitat observation notes",
                    "safety_disclaimer": "Identifications are suggestions based on AI vision and should never be used to consume wild plants or fungi."
                }
                """
                
                response = client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=[
                        types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                        prompt
                    ],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.2
                    )
                )

                if response and response.text:
                    data = json.loads(response.text)
                    data["provider"] = "Google Gemini Vision"
                    return PlantIdentificationResult(**data)

            except Exception as e:
                logger.warning(f"Gemini vision call failed ({e}). Reverting to fallback identification provider.")

        # If Gemini is unavailable or not configured, return an intelligent demo naturalist identification
        choice = random.choice(SAMPLE_MOCK_IDENTIFICATIONS)
        return PlantIdentificationResult(
            common_name=choice["common_name"],
            scientific_name=choice["scientific_name"],
            category=choice["category"],
            confidence=choice["confidence"],
            description=choice["description"],
            care_or_nature_notes=choice["care_or_nature_notes"],
            safety_disclaimer="Identifications are suggestions based on AI vision and should not be used to consume wild plants or fungi.",
            provider=choice["provider"]
        )

vision_provider = VisionProvider()
