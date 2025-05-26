from pydantic import BaseModel
from typing import Dict

class EmotionResponse(BaseModel):
    dominant_emotion: str
    emotions: Dict[str, float]
