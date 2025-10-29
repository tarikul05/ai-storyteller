import os
from pathlib import Path
from config import Config

class TextToSpeech:
  def __init__(self):
    self.elevenlabs_api_key = Config.ELEVENLABS_API_KEY
  
  def generate_audio(self, text: str, story_id: str, voice: str = "Bella") -> str:
    """Generate audio narration for the story"""
    
    try:
      # Option 1: Using ElevenLabs (premium quality)
      if self.elevenlabs_api_key:
        return self._generate_elevenlabs_audio(text, story_id, voice)
      else:
        # Option 2: Using OpenAI TTS (good quality)
        return self._generate_openai_audio(text, story_id)
            
    except Exception as e:
      print(f"Audio generation failed: {e}")
      return None
  
  def _generate_openai_audio(self, text: str, story_id: str) -> str:
    """Generate audio using OpenAI TTS"""
    from openai import OpenAI
    
    client = OpenAI(api_key=Config.OPENAI_API_KEY)
    
    audio_path = Path(Config.STORAGE_PATH) / f"{story_id}_narration.mp3"
    
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",  # alloy, echo, fable, onyx, nova, shimmer
        input=text[:4096]  # Limit text length
    )
    
    response.stream_to_file(str(audio_path))
    return str(audio_path)
  
  def _generate_elevenlabs_audio(self, text: str, story_id: str, voice: str) -> str:
      """Generate audio using ElevenLabs"""
      try:
          from elevenlabs import generate, save
          from elevenlabs import set_api_key
          
          set_api_key(self.elevenlabs_api_key)
          
          audio_path = Path(Config.STORAGE_PATH) / f"{story_id}_narration.mp3"
          
          audio = generate(
              text=text[:5000],  # Limit text length
              voice=voice,
              model="eleven_monolingual_v1"
          )
          
          save(audio, str(audio_path))
          return str(audio_path)
          
      except ImportError:
          print("ElevenLabs not available, falling back to OpenAI TTS")
          return self._generate_openai_audio(text, story_id)