import requests
import json

# Test the story generation
def test_story_generation():
    base_url = "http://localhost:8009"
    
    story_request = {
        "child_name": "Lily",
        "age": 6,
        "theme": "friendship",
        "main_character": "Sparkle the Unicorn",
        "setting": "Enchanted Rainbow Valley",
        "moral_lesson": "True friends accept you for who you are",
        "include_images": True,
        "include_audio": True
    }
    
    try:
        response = requests.post(
            f"{base_url}/generate-story",
            json=story_request
        )
        
        if response.status_code == 200:
            story_data = response.json()
            print("🎉 Story Generated Successfully!")
            print(f"📖 Title: {story_data['title']}")
            print(f"📝 Content: {story_data['content'][:200]}...")
            print(f"💫 Moral: {story_data['moral']}")
            print(f"🎵 Audio: {story_data['audio_path']}")
            print(f"🖼️ Images: {len(story_data['images'])} scenes")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"🚨 Test failed: {e}")

if __name__ == "__main__":
    test_story_generation()