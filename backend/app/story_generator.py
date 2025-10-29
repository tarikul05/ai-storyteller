import openai
import json
import uuid
from datetime import datetime
from config import Config
from models import StoryRequest, StoryResponse

class StoryGenerator:
  def __init__(self):
    self.client = openai.OpenAI(api_key=Config.OPENAI_API_KEY)
  
  def generate_story_prompt(self, request: StoryRequest) -> str:
    """Generate a detailed prompt for story generation"""
    
    age_appropriate_language = {
      3: "very simple words, short sentences, repetitive phrases",
      5: "simple vocabulary, clear concepts, some repetition",
      8: "engaging vocabulary, more complex sentences, detailed descriptions",
      12: "rich vocabulary, complex sentences, deeper themes"
    }
    
    language_style = "very simple words, short sentences"
    for age_limit, style in sorted(age_appropriate_language.items()):
      if request.age <= age_limit:
        language_style = style
        break
    
    prompt = f"""
    You are a magical storyteller for children aged {request.age}. 
    Create a heartwarming, engaging story with these specifications:
    
    CHILD'S NAME: {request.child_name}
    MAIN CHARACTER: {request.main_character}
    THEME: {request.theme.value}
    SETTING: {request.setting}
    MORAL LESSON: {request.moral_lesson or request.theme.value}
    LANGUAGE STYLE: {language_style}
    STORY LENGTH: 3-5 minutes reading time
    
    Story Structure:
    1. Introduction - Introduce characters and setting
    2. Adventure/Challenge - Create an engaging problem
    3. Resolution - Show how characters overcome challenges
    4. Moral - End with a clear, positive moral lesson
    
    Make the story personalized for {request.child_name} and include {request.main_character} as a brave, kind character.
    Use age-appropriate language that a {request.age}-year-old would enjoy.
    """
    
    return prompt
  
  def generate_story(self, request: StoryRequest) -> StoryResponse:
    """Generate a complete story based on the request"""
    
    prompt = self.generate_story_prompt(request)
    
    try:
      response = self.client.chat.completions.create(
          model="gpt-4",
          messages=[
              {"role": "system", "content": "You are a creative, warm, and engaging children's storyteller. You create magical, age-appropriate stories that teach positive values."},
              {"role": "user", "content": prompt}
          ],
          max_tokens=1500,
          temperature=0.8
      )
      
      story_content = response.choices[0].message.content.strip()
      
      # Extract title and moral (you can enhance this parsing)
      lines = story_content.split('\n')
      title = lines[0].replace('Title:', '').strip() if 'Title:' in lines[0] else f"{request.main_character}'s Adventure"
      
      # Generate a simple moral based on the theme
      moral_lessons = {
          "courage": "Being brave means facing your fears, not having no fears.",
          "friendship": "True friends are there for you through all adventures.",
          "teamwork": "Together we can achieve amazing things!",
          "honesty": "Honesty is the foundation of trust and friendship.",
          "kindness": "Small acts of kindness can make a big difference.",
          "adventure": "Every adventure teaches us something new about ourselves."
        }
        
      moral = moral_lessons.get(request.theme.value, "Always be kind and brave!")
      
      story_id = str(uuid.uuid4())
      
      return StoryResponse(
        story_id=story_id,
        title=title,
        content=story_content,
        moral=moral,
        duration_minutes=3.0
      )
        
    except Exception as e:
      raise Exception(f"Story generation failed: {str(e)}")