import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # OpenAI API Key
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # ElevenLabs API Key (optional)
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
    
    # Story settings
    MAX_STORY_LENGTH = 1000
    DEFAULT_AGE = 5
    
    # File paths
    STORAGE_PATH = "storage/stories"
    IMAGE_PATH = "storage/images"
    
    # Create directories if they don't exist
    os.makedirs(STORAGE_PATH, exist_ok=True)
    os.makedirs(IMAGE_PATH, exist_ok=True)