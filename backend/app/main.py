from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from models import StoryRequest, StoryResponse
from story_generator import StoryGenerator
from text_to_speech import TextToSpeech
from image_generator import ImageGenerator
import os
from pathlib import Path

app = FastAPI(title="Magic Storyteller Agent", version="1.0.0")

# Mount storage for serving files
app.mount("/storage", StaticFiles(directory="storage"), name="storage")

# Initialize components
story_gen = StoryGenerator()
tts = TextToSpeech()
img_gen = ImageGenerator()

@app.get("/")
async def root():
    return {"message": "Welcome to Magic Storyteller Agent! 🧚‍♀️"}

@app.post("/generate-story", response_model=StoryResponse)
async def generate_story(request: StoryRequest):
    """Generate a personalized children's story"""
    try:
        # Generate story content
        story_response = story_gen.generate_story(request)
        
        # Generate audio if requested
        if request.include_audio:
            audio_path = tts.generate_audio(story_response.content, story_response.story_id)
            story_response.audio_path = audio_path
        
        # Generate images if requested
        if request.include_images:
            image_paths = img_gen.generate_story_scenes(
                story_response.content, 
                story_response.story_id
            )
            story_response.images = image_paths
        
        return story_response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/story-audio/{story_id}")
async def get_story_audio(story_id: str):
    """Retrieve generated audio file"""
    audio_path = Path("storage/stories") / f"{story_id}_narration.mp3"
    
    if not audio_path.exists():
        raise HTTPException(status_code=404, detail="Audio not found")
    
    return FileResponse(audio_path, media_type="audio/mpeg")

@app.get("/story-image/{story_id}/{scene_num}")
async def get_story_image(story_id: str, scene_num: int):
    """Retrieve generated image file"""
    image_path = Path("storage/images") / f"{story_id}_scene_{scene_num}.png"
    
    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(image_path, media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8009)