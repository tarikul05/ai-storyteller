from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class StoryTheme(str, Enum):
  COURAGE = "courage"
  FRIENDSHIP = "friendship"
  TEAMWORK = "teamwork"
  HONESTY = "honesty"
  KINDNESS = "kindness"
  ADVENTURE = "adventure"

class StoryRequest(BaseModel):
  child_name: str = Field(..., description="Name of the child")
  age: int = Field(5, ge=3, le=12, description="Child's age (3-12)")
  theme: StoryTheme = Field(StoryTheme.ADVENTURE, description="Story theme")
  main_character: str = Field(..., description="Main character name")
  setting: str = Field("magical forest", description="Story setting")
  moral_lesson: Optional[str] = Field(None, description="Specific moral lesson")
  include_images: bool = Field(False, description="Generate illustrations")
  include_audio: bool = Field(False, description="Generate audio narration")

class StoryResponse(BaseModel):
  story_id: str
  title: str
  content: str
  moral: str
  images: List[str] = []
  audio_path: Optional[str] = None
  duration_minutes: float