import openai
import os
from pathlib import Path
from config import Config

class ImageGenerator:
    def __init__(self):
        self.client = openai.OpenAI(api_key=Config.OPENAI_API_KEY)
    
    def generate_story_scenes(self, story_content: str, story_id: str, num_scenes: int = 3) -> list:
        """Generate illustration scenes for the story"""
        
        # Extract key scenes from the story
        scenes = self._extract_scenes(story_content, num_scenes)
        image_paths = []
        
        for i, scene_description in enumerate(scenes):
            image_path = self._generate_image(scene_description, story_id, i)
            if image_path:
                image_paths.append(image_path)
        
        return image_paths
    
    def _extract_scenes(self, story_content: str, num_scenes: int) -> list:
        """Extract key scenes for illustration"""
        # Simple scene extraction - you can enhance this with LLM
        paragraphs = [p for p in story_content.split('\n') if p.strip() and len(p.strip()) > 50]
        
        if len(paragraphs) >= num_scenes:
            return paragraphs[:num_scenes]
        else:
            # Use the full story and split logically
            return [story_content[i:i+200] for i in range(0, min(len(story_content), 600), 200)][:num_scenes]
    
    def _generate_image(self, scene_description: str, story_id: str, scene_num: int) -> str:
        """Generate a single image for a scene"""
        
        try:
            # Create child-friendly prompt
            prompt = f"""
            Children's book illustration style, colorful, friendly, warm, magical.
            Scene: {scene_description[:800]}
            Style: Bright colors, soft edges, friendly characters, magical atmosphere.
            """
            
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            
            image_url = response.data[0].url
            image_path = Path(Config.IMAGE_PATH) / f"{story_id}_scene_{scene_num}.png"
            
            # Download and save image
            import requests
            img_response = requests.get(image_url)
            with open(image_path, 'wb') as f:
                f.write(img_response.content)
            
            return str(image_path)
            
        except Exception as e:
            print(f"Image generation failed for scene {scene_num}: {e}")
            return None